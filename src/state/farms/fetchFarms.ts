import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { BIG_TEN } from 'utils/bigNumber'
import { getAddress, getMasterChefAddress, getKingdomsAddress, getPCSv2MasterChefAddress } from 'utils/addressHelpers'
import { FarmConfig } from 'config/constants/types'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import kingdomsABI from 'config/abi/kingdoms.json'
import pcsv2ABI from 'config/abi/PCS-v2-masterchef.json'
import { getCAKEamount, getWBNBBUSDAmount } from 'utils/kingdomScripts'

const fetchFarms = async (farmsToFetch: FarmConfig[]) => {
  const data = await Promise.all(
    farmsToFetch.map(async (farmConfig) => {
      const lpAddress = getAddress(farmConfig.lpAddresses)
      const tokenAddress = getAddress(farmConfig.token.address)

      let calls = [
        // Balance of token in the LP contract
        {
          address: getAddress(farmConfig.token.address),
          name: 'balanceOf',
          params: [lpAddress],
        },
        // Balance of quote token on LP contract
        {
          address: getAddress(farmConfig.quoteToken.address),
          name: 'balanceOf',
          params: [lpAddress],
        },
        // Balance of LP tokens in the master chef contract
        {
          address: farmConfig.isTokenOnly ? tokenAddress : lpAddress,
          name: 'balanceOf',
          params: [getMasterChefAddress()],
        },
        // Total supply of LP tokens
        {
          address: lpAddress,
          name: 'totalSupply',
        },
        // Token decimals
        {
          address: getAddress(farmConfig.token.address),
          name: 'decimals',
        },
        // Quote token decimals
        {
          address: getAddress(farmConfig.quoteToken.address),
          name: 'decimals',
        },
      ]

      if (farmConfig.isKingdom) {
        calls = [
          // Balance of token in the LP contract
          {
            address: getAddress(farmConfig.token.address),
            name: 'balanceOf',
            params: [lpAddress],
          },
          // Balance of quote token on LP contract
          {
            address: getAddress(farmConfig.quoteToken.address),
            name: 'balanceOf',
            params: [lpAddress],
          },
          // Balance of LP tokens in the master chef contract
          {
            address: farmConfig.isTokenOnly ? tokenAddress : lpAddress,
            name: 'balanceOf',
            params: [getPCSv2MasterChefAddress()],
          },
          {
            address: lpAddress,
            name: 'totalSupply',
          },
          // Token decimals
          {
            address: getAddress(farmConfig.token.address),
            name: 'decimals',
          },
          // Quote token decimals
          {
            address: getAddress(farmConfig.quoteToken.address),
            name: 'decimals',
          },
          {
            address: farmConfig.isKingdomToken ? tokenAddress : lpAddress,
            name: 'balanceOf',
            params: [getPCSv2MasterChefAddress()],
          }
        ]
      }

      const multiResult = await multicall(erc20, calls)

      const [
        tokenBalanceLP,
        quoteTokenBalanceLP,
        lpTokenBalanceMC,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals,
        lpTokenBalancePCSv2
      ] = multiResult

      let kingdomSupply:string

      if (farmConfig.isKingdom) {
        switch (farmConfig.pid) {
          case 0:
            kingdomSupply = await getCAKEamount()
            break
          case 1:
            kingdomSupply = await getWBNBBUSDAmount()
            break
          default:
            break
        }
      }

      let tokenAmount
      let lpTotalInQuoteToken
      let tokenPriceVsQuote
      let quoteTokenAmount
      let lpTotalInQuoteTokenPCS = new BigNumber(0)

      if (farmConfig.isTokenOnly || farmConfig.isKingdomToken) {
        tokenAmount = farmConfig.isKingdomToken ? new BigNumber(kingdomSupply).div(new BigNumber(10).pow(tokenDecimals)) : new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(tokenDecimals));
        if(farmConfig.token.symbol === 'BUSD' && farmConfig.quoteToken.symbol === 'BUSD') {
          tokenPriceVsQuote = new BigNumber(1)
        }else{
          tokenPriceVsQuote = new BigNumber(quoteTokenBalanceLP).div(new BigNumber(tokenBalanceLP))
        }
        lpTotalInQuoteToken = tokenAmount.times(tokenPriceVsQuote)
      } else {
        // Ratio in % a LP tokens that are in staking, vs the total number in circulation
        let lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

        // Total value in staking in quote token value
        lpTotalInQuoteToken = new BigNumber(quoteTokenBalanceLP)
          .div(DEFAULT_TOKEN_DECIMAL)
          .times(new BigNumber(2))
          .times(lpTokenRatio)

        tokenPriceVsQuote = new BigNumber(quoteTokenBalanceLP).div(new BigNumber(tokenBalanceLP))

        if (farmConfig.isKingdom) {
          const lpTokenRatioPCS = new BigNumber(lpTokenBalancePCSv2).div(new BigNumber(lpTotalSupply))
          lpTotalInQuoteTokenPCS = new BigNumber(quoteTokenBalanceLP)
            .div(DEFAULT_TOKEN_DECIMAL)
            .times(new BigNumber(2))
            .times(lpTokenRatioPCS)

          const ratioPCStoKingdom = new BigNumber(lpTotalSupply).div(new BigNumber(kingdomSupply))

          const kingdomTokenSupply = new BigNumber(tokenBalanceLP).div(new BigNumber(ratioPCStoKingdom))

          const kingdomQuoteTokenSupply = new BigNumber(quoteTokenBalanceLP).div(new BigNumber(ratioPCStoKingdom))

          lpTokenRatio = new BigNumber(kingdomTokenSupply).div(new BigNumber(kingdomQuoteTokenSupply))

          lpTotalInQuoteToken = new BigNumber(kingdomQuoteTokenSupply)
            .div(DEFAULT_TOKEN_DECIMAL)
            .times(new BigNumber(2))
            // .times(lpTokenRatio)
        }
        // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
        tokenAmount = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals)).times(lpTokenRatio)
        quoteTokenAmount = new BigNumber(quoteTokenBalanceLP)
          .div(BIG_TEN.pow(quoteTokenDecimals))
          .times(lpTokenRatio)

          if(tokenAmount.comparedTo(0) > 0){
            tokenPriceVsQuote = quoteTokenAmount.div(tokenAmount)
          }else{
            tokenPriceVsQuote = new BigNumber(quoteTokenBalanceLP).div(new BigNumber(tokenBalanceLP))
          }
      }

      const mCalls = [
        {
          address: getMasterChefAddress(),
          name: 'poolInfo',
          params: [farmConfig.pid],
        },
        {
          address: getMasterChefAddress(),
          name: 'totalAllocPoint',
        },
        {
          address: getMasterChefAddress(),
          name: 'cubPerBlock',
        }
      ]

      const [info, totalAllocPoint, cubPerBlock] = await multicall(masterchefABI, mCalls).catch(error => {
        throw new Error(`multicall nontoken: ${error}`)
      })

      if (farmConfig.isKingdom) {
        const kCalls = [
          {
            address: getKingdomsAddress(),
            name: 'poolInfo',
            params: [farmConfig.pid],
          },
          {
            address: getKingdomsAddress(),
            name: 'totalAllocPoint',
          },
        ]

        const [kInfo, kTotalAllocPoint] = await multicall(kingdomsABI, kCalls).catch(error => {
          throw new Error(`multicall nontoken: ${error}`)
        })

        const allocPoint = new BigNumber(kInfo.allocPoint._hex)
        const kingdomTotalAlloc = new BigNumber(600)

        const kingdomCorrectAlloc = allocPoint.times(new BigNumber(kingdomTotalAlloc)).div(new BigNumber(kTotalAllocPoint))

        const kingdomPoolWeight = kingdomCorrectAlloc.div(new BigNumber(totalAllocPoint))

        const pcsCalls = [
          {
            address: getPCSv2MasterChefAddress(),
            name: 'poolInfo',
            params: [farmConfig.pcsPid], // BUSD-BNB
          },
          {
            address: getPCSv2MasterChefAddress(),
            name: 'totalAllocPoint',
          }
        ]

        const [infoPCS, totalAllocPointPCS] = await multicall(pcsv2ABI, pcsCalls).catch(error => {
          throw new Error(`multicall pcs error: ${error}`)
        })

        const allocPointPCS = new BigNumber(infoPCS.allocPoint._hex)
        const poolWeightPCS = allocPointPCS.div(new BigNumber(totalAllocPointPCS))

        return {
          ...farmConfig,
          tokenAmount: tokenAmount.toJSON(),
          lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
          lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
          tokenPriceVsQuote: tokenPriceVsQuote.toJSON(),
          poolWeight: kingdomPoolWeight.toJSON(),
          multiplier: `${kingdomCorrectAlloc.div(100).toString()}X`,
          depositFeeBP: kInfo.depositFeeBP,
          cubPerBlock: new BigNumber(cubPerBlock).toNumber(),
          lpTokenBalancePCSv2: new BigNumber(lpTokenBalancePCSv2).div(DEFAULT_TOKEN_DECIMAL).toNumber(),
          lpTotalInQuoteTokenPCS: lpTotalInQuoteTokenPCS.toNumber(),
          poolWeightPCS: poolWeightPCS.toJSON(),
          kingdomSupply,
        }
      }

      const allocPoint = new BigNumber(info.allocPoint._hex)
      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))

      return {
        ...farmConfig,
        tokenAmount: tokenAmount.toJSON(),
        // quoteTokenAmount: quoteTokenAmount.toJSON(),
        lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: tokenPriceVsQuote.toJSON(),
        // tokenPriceVsQuote: quoteTokenAmount.div(tokenAmount).toJSON(),
        poolWeight: poolWeight.toJSON(),
        multiplier: `${allocPoint.div(100).toString()}X`,
        depositFeeBP: info.depositFeeBP,
        cubPerBlock: new BigNumber(cubPerBlock).toNumber(),
      }
    }),
  )
  return data
}

export default fetchFarms
