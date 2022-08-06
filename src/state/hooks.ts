import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { orderBy } from 'lodash'
import { Team } from 'config/constants/types'
import Nfts from 'config/constants/nfts'
import { getWeb3NoAccount } from 'utils/web3'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import useRefresh from 'hooks/useRefresh'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { fetchFarmsPublicDataAsync, fetchPoolsPublicDataAsync, fetchPoolsUserDataAsync, setBlock } from './actions'
import { State, Farm, Pool, ProfileState, TeamsState, AchievementState, PriceState, FarmsState } from './types'
import { fetchProfile } from './profile'
import { fetchTeam, fetchTeams } from './teams'
import { fetchAchievements } from './achievements'
// import { fetchPrices } from './prices'
import { fetchWalletNfts } from './collectibles'

export const useFetchPublicData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync())
    // dispatch(fetchPoolsPublicDataAsync())
  }, [dispatch, slowRefresh])

  useEffect(() => {
    const web3 = getWeb3NoAccount()
    const interval = setInterval(async () => {
      const blockNumber = await web3.eth.getBlockNumber()
      dispatch(setBlock(blockNumber))
    }, 6000)

    return () => clearInterval(interval)
  }, [dispatch])
}

// Farms

export const useFarms = (): FarmsState => {
  const farms = useSelector((state: State) => state.farms)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useKingdomFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid && f.isKingdom))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  }
}

export const useLpTokenPrice = (symbol: string) => {
  /* const farm = useFarmFromSymbol(symbol)
  // const tokenPriceInUsd = useGetApiPrice(getAddress(farm.token.address))
  const tokenPriceInUsd = farm.token.busdPrice
  // console.log('farm.lpTotalSupplyy',farm.lpTotalSupply)
  // console.log('farm.lpTotalInQuoteToken',farm.lpTotalInQuoteToken)
  let lpTotal = farm.lpTotalInQuoteToken
  if (farm.farmType === 'Bakery') lpTotal = farm.lpTotalInQuoteTokenPCS

  return farm.lpTotalSupply && lpTotal
    ? new BigNumber(getBalanceNumber(farm.lpTotalSupply)).div(lpTotal).times(tokenPriceInUsd).times(2)
    : BIG_ZERO
    */
  const farm = useFarmFromSymbol(symbol)
  const farmTokenPriceInUsd = useBusdPriceFromPid(farm.pid)
  let lpTokenPrice = BIG_ZERO

  if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(farm.tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(farm.lpTotalSupply)
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
  }

  return lpTokenPrice
}

// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const pools = useSelector((state: State) => state.pools.data)
  return pools
}

export const usePoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return pool
}

export const useFarmFromTokenSymbol = (tokenSymbol: string, preferredQuoteTokens?: string[]): Farm => {
  const farms = useSelector((state: State) => state.farms.data.filter((farm) => farm.token.symbol === tokenSymbol))
  const filteredFarm = filterFarmsByQuoteToken(farms, preferredQuoteTokens)
  return filteredFarm
}

// Return the base token price for a farm, from a given pid
export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const farm = useFarmFromPid(pid)
  return farm && new BigNumber(farm.token.busdPrice)
}

export const useBusdPriceFromLpSymbol = (symbol: string): BigNumber => {
  const farm = useFarmFromSymbol(symbol)
  return farm && new BigNumber(farm.token.busdPrice)
}

export const useBusdPriceFromToken = (tokenSymbol: string): BigNumber => {
  const tokenFarm = useFarmFromTokenSymbol(tokenSymbol)
  const tokenPrice = useBusdPriceFromPid(tokenFarm?.pid)
  return tokenPrice
}

// Profile

export const useFetchProfile = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchProfile(account))
  }, [account, dispatch])
}

export const useProfile = () => {
  const { isInitialized, isLoading, data, hasRegistered }: ProfileState = useSelector((state: State) => state.profile)
  return { profile: data, hasProfile: isInitialized && hasRegistered, isInitialized, isLoading }
}

// Teams

export const useTeam = (id: number) => {
  const team: Team = useSelector((state: State) => state.teams.data[id])
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTeam(id))
  }, [id, dispatch])

  return team
}

export const useTeams = () => {
  const { isInitialized, isLoading, data }: TeamsState = useSelector((state: State) => state.teams)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTeams())
  }, [dispatch])

  return { teams: data, isInitialized, isLoading }
}

// Achievements

export const useFetchAchievements = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (account) {
      dispatch(fetchAchievements(account))
    }
  }, [account, dispatch])
}

export const useAchievements = () => {
  const achievements: AchievementState['data'] = useSelector((state: State) => state.achievements.data)
  return achievements
}

// Prices
// export const useFetchPriceList = () => {
//   const { slowRefresh } = useRefresh()
//   const dispatch = useAppDispatch()
//
//   useEffect(() => {
//     dispatch(fetchPrices())
//   }, [dispatch, slowRefresh])
// }

export const useGetApiPrices = () => {
  const prices: PriceState['data'] = useSelector((state: State) => state.prices.data)
  return prices
}

export const useGetApiPrice = (address: string) => {
  const prices = useGetApiPrices()

  if (!prices) {
    return null
  }

  return prices[address.toLowerCase()]
}

// export const usePriceBnbBusd = (): BigNumber => {
//   const bnbBusdFarm = useFarmFromPid(2)
//   return bnbBusdFarm.tokenPriceVsQuote ? new BigNumber(1).div(bnbBusdFarm.tokenPriceVsQuote) : BIG_ZERO
// }

export const usePriceCakeBusd = (): BigNumber => {
  const cakeBnbFarm = useFarmFromPid(29)
  // const bnbBusdPrice = usePriceBnbBusd()
  //
  // const cakeBusdPrice = cakeBnbFarm.tokenPriceVsQuote ? bnbBusdPrice.times(cakeBnbFarm.tokenPriceVsQuote) : BIG_ZERO

  const cakeBusdPrice = cakeBnbFarm.tokenPriceVsQuote ? new BigNumber(cakeBnbFarm.tokenPriceVsQuote) : BIG_ZERO

  return cakeBusdPrice
}

// Block
export const useBlock = () => {
  return useSelector((state: State) => state.block)
}

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock)
}

// Predictions
export const useIsHistoryPaneOpen = () => {
  return useSelector((state: State) => state.predictions.isHistoryPaneOpen)
}

export const useIsChartPaneOpen = () => {
  return useSelector((state: State) => state.predictions.isChartPaneOpen)
}

export const useGetRounds = () => {
  return useSelector((state: State) => state.predictions.rounds)
}

export const useGetSortedRounds = () => {
  const roundData = useGetRounds()
  return orderBy(Object.values(roundData), ['epoch'], ['asc'])
}

export const useGetCurrentEpoch = () => {
  return useSelector((state: State) => state.predictions.currentEpoch)
}

export const useGetIntervalBlocks = () => {
  return useSelector((state: State) => state.predictions.intervalBlocks)
}

export const useGetBufferBlocks = () => {
  return useSelector((state: State) => state.predictions.bufferBlocks)
}

export const useGetTotalIntervalBlocks = () => {
  const intervalBlocks = useGetIntervalBlocks()
  const bufferBlocks = useGetBufferBlocks()
  return intervalBlocks + bufferBlocks
}

export const useGetRound = (id: string) => {
  const rounds = useGetRounds()
  return rounds[id]
}

export const useGetCurrentRound = () => {
  const currentEpoch = useGetCurrentEpoch()
  const rounds = useGetSortedRounds()
  return rounds.find((round) => round.epoch === currentEpoch)
}

export const useGetPredictionsStatus = () => {
  return useSelector((state: State) => state.predictions.status)
}

export const useGetHistoryFilter = () => {
  return useSelector((state: State) => state.predictions.historyFilter)
}

export const useGetCurrentRoundBlockNumber = () => {
  return useSelector((state: State) => state.predictions.currentRoundStartBlockNumber)
}

export const useGetMinBetAmount = () => {
  const minBetAmount = useSelector((state: State) => state.predictions.minBetAmount)
  return useMemo(() => new BigNumber(minBetAmount), [minBetAmount])
}

export const useGetIsFetchingHistory = () => {
  return useSelector((state: State) => state.predictions.isFetchingHistory)
}

export const useGetHistory = () => {
  return useSelector((state: State) => state.predictions.history)
}

export const useGetHistoryByAccount = (account: string) => {
  const bets = useGetHistory()
  return bets ? bets[account] : []
}

export const useGetBetByRoundId = (account: string, roundId: string) => {
  const bets = useSelector((state: State) => state.predictions.bets)

  if (!bets[account]) {
    return null
  }

  if (!bets[account][roundId]) {
    return null
  }

  return bets[account][roundId]
}

// Collectibles
export const useGetCollectibles = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { isInitialized, isLoading, data } = useSelector((state: State) => state.collectibles)
  const identifiers = Object.keys(data)

  useEffect(() => {
    // Fetch nfts only if we have not done so already
    if (!isInitialized) {
      dispatch(fetchWalletNfts(account))
    }
  }, [isInitialized, account, dispatch])

  return {
    isInitialized,
    isLoading,
    tokenIds: data,
    nftsInWallet: Nfts.filter((nft) => identifiers.includes(nft.identifier)),
  }
}

export const useTotalValue = (): BigNumber => {
  const farms = useFarms();
  let value = new BigNumber(0);

  value = farms.data.reduce((accu, farm) => {
    const quoteTokenPriceUsd = farm.quoteToken.busdPrice
    const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(quoteTokenPriceUsd)
    let newAccu = accu
    if (totalLiquidity.gt(0))
      newAccu = accu.plus(totalLiquidity)
    return newAccu
  }, value)

  return value;
}

export const useTotalValueKingdoms = (): BigNumber => {
  const farms = useFarms();
  let value = new BigNumber(0);

  const kingdoms = farms.data.filter(farm => farm.isKingdom)

  value = kingdoms.reduce((accu, farm) => {
    const quoteTokenPriceUsd = farm.quoteToken.busdPrice
    const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(quoteTokenPriceUsd)
    let newAccu = accu
    if (totalLiquidity.gt(0))
      newAccu = accu.plus(totalLiquidity)
    return newAccu
  }, value)

  return value;
}


export const useTotalCubStaked = (): any => {
  const farms = useFarms()
  let total = { cub: new BigNumber(0), value: new BigNumber(0) }

  const cubFarms = farms.data.filter(farm => farm.token.symbol === 'CUB' && new BigNumber(farm.userData.stakedBalance).gt(0))

  total = cubFarms.reduce((accu, farm) => {
    let newAccu = accu

    const { userData, lpTotalInQuoteToken, lpTokenBalance, quoteToken: { busdPrice: quoteTokenPriceUsd }, token: { busdPrice: tokenPriceString } } = farm
    const { stakedBalance } = userData
    const stakedAmount = new BigNumber(stakedBalance);

    const tokenPrice = new BigNumber(tokenPriceString);
    let oneTokenQuoteValue = new BigNumber(0)

    if (!farm.isTokenOnly && !farm.isKingdomToken)
      oneTokenQuoteValue = lpTotalInQuoteToken ? new BigNumber(lpTotalInQuoteToken).div(new BigNumber(lpTokenBalance)).times(quoteTokenPriceUsd).times(DEFAULT_TOKEN_DECIMAL) : new BigNumber(0)
    else oneTokenQuoteValue = tokenPrice.times(DEFAULT_TOKEN_DECIMAL)

    const totalValueStaked = stakedAmount.times(oneTokenQuoteValue).div(DEFAULT_TOKEN_DECIMAL)
    const totalCubValue = !farm.isTokenOnly && !farm.isKingdomToken ? totalValueStaked.div(2) : totalValueStaked
    const amountCubTokens = !farm.isTokenOnly && !farm.isKingdomToken ? totalCubValue.div(tokenPrice) : totalCubValue.div(oneTokenQuoteValue).times(DEFAULT_TOKEN_DECIMAL)

    // console.log('oneTokenQuoteValue',oneTokenQuoteValue.div(DEFAULT_TOKEN_DECIMAL).toNumber())
    // console.log('totalValueStaked',totalValueStaked.div(DEFAULT_TOKEN_DECIMAL).toNumber())
    // console.log('totalCubValue',totalCubValue.div(DEFAULT_TOKEN_DECIMAL).toNumber())
    // console.log('amountCubTokens',amountCubTokens.div(DEFAULT_TOKEN_DECIMAL).toNumber())

    newAccu = { cub: newAccu.cub.plus(amountCubTokens.div(DEFAULT_TOKEN_DECIMAL)), value: newAccu.value.plus(totalCubValue.div(DEFAULT_TOKEN_DECIMAL)) }
    // console.log('newAccu', newAccu)
    return newAccu
  }, total)

  return total
}
