import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import kingdomsABI from 'config/abi/kingdoms.json'
import multicall from 'utils/multicall'
import { getMasterChefAddress, getKingdomsAddress } from 'utils/addressHelpers'
import farmsConfig from 'config/constants/farms'
import { QuoteToken } from '../../config/constants/types'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

const fetchFarms = async () => {
  const data = await Promise.all(
    farmsConfig.map(async (farmConfig) => {
      const lpAddress = farmConfig.lpAddresses[CHAIN_ID]
      // const params = (farmConfig.isTokenOnly ?? [getMasterChefAddress()]) || (farmConfig.isKingdom ?? [getKingdomsAddress()])
      // console.log('params',params)
      let tokenOrKingdom = {
        address: farmConfig.isTokenOnly ? farmConfig.tokenAddresses[CHAIN_ID] : lpAddress,
        name: 'balanceOf',
        params: [getMasterChefAddress()],
      }

      if (farmConfig.isKingdom) {
        tokenOrKingdom = {
          address: farmConfig.tokenAddresses[CHAIN_ID],
          name: 'balanceOf',
          params: [getKingdomsAddress()],
        }
      }

      const calls = [
        // Balance of token in the LP contract
        {
          address: farmConfig.tokenAddresses[CHAIN_ID],
          name: 'balanceOf',
          params: [lpAddress],
        },
        // Balance of quote token on LP contract
        {
          address: farmConfig.quoteTokenAdresses[CHAIN_ID],
          name: 'balanceOf',
          params: [lpAddress],
        },
        // Balance of LP tokens in the master chef contract
        tokenOrKingdom,
        // Total supply of LP tokens
        {
          address: lpAddress,
          name: 'totalSupply',
        },
        // Token decimals
        {
          address: farmConfig.tokenAddresses[CHAIN_ID],
          name: 'decimals',
        },
        // Quote token decimals
        {
          address: farmConfig.quoteTokenAdresses[CHAIN_ID],
          name: 'decimals',
        },
      ]

      // if (farmConfig.isKingdom && farmConfig.lpSymbol === 'CAKE') {
      //   // console.log('getKingdomsAddress()',getKingdomsAddress())
      //   console.log('calls',calls)
      // }
      const [
        tokenBalanceLP,
        quoteTokenBlanceLP,
        lpTokenBalanceMC,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals
      ] = await multicall(erc20, calls).catch(error => {
        throw new Error(error)
      })

      let tokenAmount;
      let lpTotalInQuoteToken;
      let tokenPriceVsQuote;
      // if (farmConfig.isTokenOnly || farmConfig.isKingdom) {
      if (farmConfig.isTokenOnly) {
        tokenAmount = new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(tokenDecimals));
        if(farmConfig.tokenSymbol === QuoteToken.BUSD && farmConfig.quoteTokenSymbol === QuoteToken.BUSD){
          tokenPriceVsQuote = new BigNumber(1);
        }else{
          tokenPriceVsQuote = new BigNumber(quoteTokenBlanceLP).div(new BigNumber(tokenBalanceLP));
        }
        lpTotalInQuoteToken = tokenAmount.times(tokenPriceVsQuote);
      }else{
        // Ratio in % a LP tokens that are in staking, vs the total number in circulation
        const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

        // Total value in staking in quote token value
        lpTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
          .div(new BigNumber(10).pow(18))
          .times(new BigNumber(2))
          .times(lpTokenRatio)

        // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
        tokenAmount = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)).times(lpTokenRatio)
        const quoteTokenAmount = new BigNumber(quoteTokenBlanceLP)
          .div(new BigNumber(10).pow(quoteTokenDecimals))
          .times(lpTokenRatio)

        if(tokenAmount.comparedTo(0) > 0){
          tokenPriceVsQuote = quoteTokenAmount.div(tokenAmount);
        }else{
          tokenPriceVsQuote = new BigNumber(quoteTokenBlanceLP).div(new BigNumber(tokenBalanceLP));
        }
      }

      let newCalls = [{
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
      }]

      if (farmConfig.isKingdom) {
        newCalls = [{
          address: getKingdomsAddress(),
          name: 'poolInfo',
          params: [farmConfig.pid],
        },
        {
          address: getKingdomsAddress(),
          name: 'totalAllocPoint',
        },
        {
          address: getKingdomsAddress(),
          name: 'CubPerBlock',
        }]
      }

      const [info, totalAllocPoint, eggPerBlock] = await multicall(farmConfig.isKingdom ? kingdomsABI : masterchefABI, newCalls).catch(error => {
        throw new Error(`multicall nontoken: ${error}`)
      })

      const allocPoint = new BigNumber(info.allocPoint._hex)
      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))

      return {
        ...farmConfig,
        tokenAmount: tokenAmount.toJSON(),
        // quoteTokenAmount: quoteTokenAmount,
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: tokenPriceVsQuote.toJSON(),
        poolWeight: poolWeight.toNumber(),
        multiplier: `${allocPoint.div(100).toString()}X`,
        depositFeeBP: info.depositFeeBP,
        cubPerBlock: new BigNumber(eggPerBlock).toNumber(),
      }
    }),
  )
  // console.log('data',data)
  return data
}

export default fetchFarms
