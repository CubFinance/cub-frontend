import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import {BIG_TEN, BIG_ZERO} from 'utils/bigNumber'
import {
  getAddress,
  getBakery,
  getBelt,
  getKingdomsAddress,
  getMasterChefAddress,
  getPCSv2MasterChefAddress
} from 'utils/addressHelpers'
import {FarmConfig} from 'config/constants/types'
import kingdomsABI from 'config/abi/kingdoms.json'
import pcsv2ABI from 'config/abi/PCS-v2-masterchef.json'
import bakeryABI from 'config/abi/bakery.json'
import beltABI from 'config/abi/belt.json'
import multiStratABI from 'config/abi/MultiStrategyTokenImpl.json'
import {
  getBeltAPR,
  getBTCAmount,
  getBTCBNBAmount,
  getBTCBNBBakeryAmount,
  getCAKEamount,
  getCUBAmount,
  getETHAmount,
  getSPSBNBAmount,
  getUSDAmount,
  getWBNBBUSDAmount,
  getWBNBDOTAmount,
  getWBNBETHAmount,
} from 'utils/kingdomScripts'
import {fetchLockedKingdomTotalStaked, fetchPoolVaultData} from "../../views/Kingdoms/LockedKingdom/poolHelpers";

const fetchFarms = async (farmsToFetch: FarmConfig[]) => {
  const beltData = await getBeltAPR()
  return Promise.all(
      farmsToFetch.map(async (farmConfig) => {
        const lpAddress = getAddress(farmConfig.lpAddresses)
        const tokenAddress = getAddress(farmConfig.token.address)
        const quoteAddress = getAddress(farmConfig.quoteToken.address)
        const DECIMAL_PLACES_MAX = Math.max(farmConfig.quoteToken.decimals, farmConfig.token.decimals)
        const DEFAULT_TOKEN_DECIMAL = 10 ** DECIMAL_PLACES_MAX;
        let asyncLockedKingdomData = null;
        if (farmConfig.isKingdomLocked) {
          asyncLockedKingdomData = fetchPoolVaultData();
        }

        let calls = [
          // Balance of token in the LP contract
          {
            address: tokenAddress,
            name: 'balanceOf',
            params: [lpAddress],
          },
          // Balance of quote token on LP contract
          {
            address: quoteAddress,
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
            address: tokenAddress,
            name: 'decimals',
          },
          // Quote token decimals
          {
            address: quoteAddress,
            name: 'decimals',
          },
        ]

        if (farmConfig.isKingdom) {
          let hostMasterchef = getPCSv2MasterChefAddress()
          if (farmConfig.farmType === 'Bakery') hostMasterchef = getBakery()
          else if (farmConfig.farmType === 'Belt') hostMasterchef = getBelt()

          calls = [
            // Balance of token in the LP contract
            {
              address: tokenAddress,
              name: 'balanceOf',
              params: [lpAddress],
            },
            // Balance of quote token on LP contract
            {
              address: quoteAddress,
              name: 'balanceOf',
              params: [lpAddress],
            },
            // Balance of LP tokens in the master chef contract
            {
              address: farmConfig.isKingdomToken ? tokenAddress : lpAddress,
              name: 'balanceOf',
              params: [hostMasterchef],
            },
            {
              address: lpAddress,
              name: 'totalSupply',
            },
            // Token decimals
            {
              address: tokenAddress,
              name: 'decimals',
            },
            // Quote token decimals
            {
              address: quoteAddress,
              name: 'decimals',
            },
          ]
        }
// if (farmConfig.lpSymbol === 'beltBTC') console.log('calls',calls)

        const multiResult = await multicall(erc20, calls)

        const [
          tokenBalanceLP,
          quoteTokenBalanceLP,
          lpTokenBalanceMC,
          lpTotalSupply,
          tokenDecimals,
          quoteTokenDecimals,
        ] = multiResult

        let kingdomSupply: string
        let beltAPR: string
        let beltRate: string

        if (farmConfig.isKingdom) {
          switch (farmConfig.pid) {
            case 0:
              kingdomSupply = await getCAKEamount()
              break
            case 1:
              kingdomSupply = await getWBNBBUSDAmount()
              break
            case 2:
              kingdomSupply = await getWBNBETHAmount()
              break
            case 3:
              kingdomSupply = await getWBNBDOTAmount()
              break
            case 4:
              kingdomSupply = await getCUBAmount()
              break
            case 5:
              kingdomSupply = await getBTCBNBBakeryAmount()
              break
            case 6:
              kingdomSupply = await getBTCAmount()
              kingdomSupply = new BigNumber(kingdomSupply).div(DEFAULT_TOKEN_DECIMAL).toString()
              beltAPR = beltData.btc
              break
            case 7:
              kingdomSupply = await getETHAmount()
              kingdomSupply = new BigNumber(kingdomSupply).div(DEFAULT_TOKEN_DECIMAL).toString()
              beltAPR = beltData.eth
              break
            case 8:
              kingdomSupply = await getUSDAmount()
              kingdomSupply = new BigNumber(kingdomSupply).div(DEFAULT_TOKEN_DECIMAL).toString()
              beltAPR = beltData.stable
              beltRate = beltData.stableRate
              break
            case 9:
              kingdomSupply = await getBTCBNBAmount()
              break
            case 10:
              kingdomSupply = await getSPSBNBAmount()
              break
            case 34:
              kingdomSupply = await fetchLockedKingdomTotalStaked();
              break
            default:
              break
          }
        }
        //   if (farmConfig.lpSymbol === 'BLEO-BNB LP (v2)' && farmConfig.pid === 28) {
        //   console.log('farm',farmConfig.lpSymbol)
        //   console.log('tokenBalanceLP',new BigNumber(tokenBalanceLP).div(DEFAULT_TOKEN_DECIMAL).toFixed(12))
        //   console.log('quoteTokenBalanceLP',new BigNumber(quoteTokenBalanceLP).div(DEFAULT_TOKEN_DECIMAL).toFixed(12))
        //   console.log('lpTokenBalanceMC',new BigNumber(lpTokenBalanceMC).div(DEFAULT_TOKEN_DECIMAL).toFixed(12))
        //   console.log('lpTotalSupply',new BigNumber(lpTotalSupply).div(DEFAULT_TOKEN_DECIMAL).toFixed(12))
        // }
        let tokenAmount
        let lpTotalInQuoteToken
        let tokenPriceVsQuote
        let quoteTokenAmount
        let lpTotalInQuoteTokenPCS = new BigNumber(0)

        if (farmConfig.isTokenOnly || farmConfig.isKingdomToken) {
          tokenAmount = farmConfig.isKingdomToken ? new BigNumber(kingdomSupply).div(new BigNumber(10).pow(tokenDecimals)) : new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(tokenDecimals));

          if (farmConfig.farmType === 'Belt') tokenAmount = new BigNumber(kingdomSupply)

          if (farmConfig.token.symbol === 'BUSD' && farmConfig.quoteToken.symbol === 'BUSD') {
            tokenPriceVsQuote = new BigNumber(1)
          } else {
            tokenPriceVsQuote = new BigNumber(quoteTokenBalanceLP).div(new BigNumber(tokenBalanceLP))
          }

          lpTotalInQuoteToken = tokenAmount.times(tokenPriceVsQuote)
          // lpTotalInQuoteTokenPCS = tokenAmountPCS.times(tokenPriceVsQuote)
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

            const lpTokenRatioPCS = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

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
          }
          // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
          tokenAmount = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals)).times(lpTokenRatio)
          quoteTokenAmount = new BigNumber(quoteTokenBalanceLP)
              .div(BIG_TEN.pow(quoteTokenDecimals))
              .times(lpTokenRatio)

          if (tokenAmount.comparedTo(0) > 0) {
            tokenPriceVsQuote = quoteTokenAmount.div(tokenAmount)
          } else {
            tokenPriceVsQuote = new BigNumber(quoteTokenBalanceLP).div(new BigNumber(tokenBalanceLP))
          }
        }

        const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals))

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

        if (farmConfig.isKingdom && !farmConfig.isKingdomLocked) {
          const address = farmConfig.isKingdomLocked ? getMasterChefAddress() : getKingdomsAddress();

          const kCalls = [
            {
              address,
              name: 'poolInfo',
              params: [farmConfig.pid],
            },
            {
              address,
              name: 'totalAllocPoint',
            },
          ]

          const [kInfo, kTotalAllocPoint] = await multicall(kingdomsABI, kCalls).catch(error => {
            throw new Error(`multicall nontoken: ${error}`)
          })

          const allocPoint = new BigNumber(kInfo.allocPoint._hex)
          const kingdomTotalAlloc = new BigNumber(1350)

          const kingdomCorrectAlloc = allocPoint.times(new BigNumber(kingdomTotalAlloc)).div(new BigNumber(kTotalAllocPoint))

          const kingdomPoolWeight = kingdomCorrectAlloc.div(new BigNumber(totalAllocPoint))

          let poolWeightPCS = new BigNumber(0)
          if (farmConfig.altPid || farmConfig.altPid === 0) {
            let hostMasterchef = getPCSv2MasterChefAddress()
            let hostAbi = pcsv2ABI
            if (farmConfig.farmType === 'Belt') {
              hostMasterchef = getBelt()
              hostAbi = beltABI
            }

            const hostCalls = [
              {
                address: hostMasterchef,
                name: 'poolInfo',
                params: [farmConfig.altPid],
              },
              {
                address: hostMasterchef,
                name: 'totalAllocPoint',
              }
            ]

            const [infoPCS, totalAllocPointPCS] = await multicall(hostAbi, hostCalls).catch(error => {
              throw new Error(`multicall pcs error: ${error}`)
            })

            poolWeightPCS = new BigNumber(infoPCS.allocPoint._hex).div(new BigNumber(totalAllocPointPCS))
          } else if (farmConfig.farmType === 'Bakery') {
            const bakeryCalls = [
              {
                address: getBakery(),
                name: 'poolInfoMap',
                params: [lpAddress],
              },
              {
                address: getBakery(),
                name: 'totalAllocPoint',
              }
            ]

            const [infoBakery, totalAllocPointBakery] = await multicall(bakeryABI, bakeryCalls).catch(error => {
              throw new Error(`multicall pcs error: ${error}`)
            })

            poolWeightPCS = new BigNumber(infoBakery.allocPoint._hex).div(new BigNumber(totalAllocPointBakery))
          }

          let tokenValuePerOrigin = BIG_ZERO
          // let totalSupplyBelt = BIG_ZERO
          if (farmConfig.farmType === 'Belt' && farmConfig.lpSymbol !== '4belt') {
            const bCalls = [
              {
                address: tokenAddress,
                name: 'getPricePerFullShare',
              },
              // {
              //   address: tokenAddress,
              //   name: 'totalSupply',
              // },
            ]
            const [pricePerFullShare] = await multicall(multiStratABI, bCalls)
            tokenValuePerOrigin = new BigNumber(pricePerFullShare).div(DEFAULT_TOKEN_DECIMAL)
            // totalSupplyBelt = new BigNumber(tSupply).div(DEFAULT_TOKEN_DECIMAL)
          }

          return {
            ...farmConfig,
            tokenAmount: tokenAmount.toJSON(),
            lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
            lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
            tokenPriceVsQuote: tokenPriceVsQuote.toJSON(),
            poolWeight: farmConfig.pid === 4 ? '0.19' : kingdomPoolWeight.toJSON(),
            multiplier: farmConfig.pid === 4 ? '30X' : `${kingdomCorrectAlloc.div(100).toFixed(1).toString()}X`,
            // multiplier: farmConfig.pid === 4 ? '30X' : `2X`,
            // multiplier: '1.5X',
            depositFeeBP: kInfo.depositFeeBP,
            cubPerBlock: new BigNumber(cubPerBlock).toNumber(),
            lpTokenBalancePCS: new BigNumber(lpTokenBalanceMC).div(DEFAULT_TOKEN_DECIMAL).toNumber(),
            lpTotalInQuoteTokenPCS: lpTotalInQuoteTokenPCS.toNumber(),
            poolWeightPCS: poolWeightPCS.toJSON(),
            kingdomSupply,
            tokenAmountTotal: tokenAmountTotal.toJSON(),
            tokenValuePerOrigin: tokenValuePerOrigin.toJSON(),
            // totalSupplyBelt: totalSupplyBelt.toJSON(),
            beltAPR,
            beltRate,
          }
        }

        const allocPoint = new BigNumber(info.allocPoint._hex)
        const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))
// console.log('tokenPriceVsQuote',tokenPriceVsQuote.toFormat(10))
        return {
          ...farmConfig,
          tokenAmount: tokenAmount.toJSON(),
          // quoteTokenAmount: quoteTokenAmount.toJSON(),
          lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
          lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
          tokenPriceVsQuote: tokenPriceVsQuote.toJSON(),
          // tokenPriceVsQuote: quoteTokenAmount.div(tokenAmount).toJSON(),
          poolWeight: poolWeight.toJSON(),
          lockedKingdomData: await asyncLockedKingdomData,
          multiplier: `${allocPoint.div(100).toString()}X`,
          depositFeeBP: info.depositFeeBP,
          cubPerBlock: new BigNumber(cubPerBlock).toNumber(),
          tokenAmountTotal: tokenAmountTotal.toJSON(),
          lpTokenBalance: new BigNumber(lpTokenBalanceMC).div(DEFAULT_TOKEN_DECIMAL).toNumber(),
        }
      }),
  )
}

export default fetchFarms
