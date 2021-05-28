import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import kingdomsABI from 'config/abi/kingdoms.json'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddress, getKingdomsAddress } from 'utils/addressHelpers'
import { FarmConfig } from 'config/constants/types'

export const fetchFarmUserAllowances = async (account: string, farmsToFetch: FarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress()
  const kingdomAddress = getKingdomsAddress()

  const calls = farmsToFetch.map((farm) => {
    // const lpContractAddress = getAddress(farm.lpAddresses)
    const lpContractAddress = farm.isTokenOnly ? getAddress(farm.token.address) : getAddress(farm.lpAddresses)
    const mainAddress = farm.isKingdom ? kingdomAddress : masterChefAddress
    return { address: lpContractAddress, name: 'allowance', params: [account, mainAddress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (account: string, farmsToFetch: FarmConfig[]) => {
  const calls = farmsToFetch.map((farm) => {
    // const lpContractAddress = getAddress(farm.lpAddresses)
    const lpContractAddress = farm.isTokenOnly || farm.isKingdomToken ? getAddress(farm.token.address) : getAddress(farm.lpAddresses)
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmUserStakedBalances = async (account: string, farmsToFetch: FarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress()
  const kingdomAddress = getKingdomsAddress()

  const callsMC = farmsToFetch.map((farm) => {
    if (!farm.isKingdom)
      return {
        address: masterChefAddress,
        name: 'userInfo',
        params: [farm.pid, account],
      }
    return null
  })

  const callsK = farmsToFetch.map((farm) => {
    if (farm.isKingdom)
      return {
        address: kingdomAddress,
        name: 'userInfo',
        params: [farm.pid, account],
      }
    return null
  })

  // Get rid of nulls
  const masterCalls = callsMC.filter(call => call)
  const kingdomCalls = callsK.filter(call => call)

  const rawStakedBalancesMC = await multicall(masterchefABI, masterCalls)
  const rawStakedBalancesK = await multicall(kingdomsABI, kingdomCalls)

  const rawStakedBalances = [...rawStakedBalancesMC, ...rawStakedBalancesK]
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances

  /* const calls = farmsToFetch.map((farm) => {
    return {
      address: farm.isKingdom ? kingdomAddress : masterChefAddress,
      name: 'userInfo',
      params: [farm.pid, account],
    }
  })

  const rawStakedBalances = await multicall(masterchefABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances */
}

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: FarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress()
  const kingdomAddress = getKingdomsAddress()

  const callsMasterChef = farmsToFetch.map((farm) => {
    if (!farm.isKingdom)
      return {
        address: masterChefAddress,
        name: 'pendingCub',
        params: [farm.pid, account],
      }
    return null
  })

  const callsKingdoms = farmsToFetch.map((farm) => {
    if (farm.isKingdom)
      return {
        address: kingdomAddress,
        name: 'pendingCUB',
        params: [farm.pid, account],
      }
    return null
  })

  // Get rid of nulls
  const masterCalls = callsMasterChef.filter(call => call)
  const kingdomCalls = callsKingdoms.filter(call => call)

  const rawEarningsMasterChef = await multicall(masterchefABI, masterCalls)
  const rawEarningsKingdoms = await multicall(kingdomsABI, kingdomCalls)

  const rawEarnings = [...rawEarningsMasterChef, ...rawEarningsKingdoms]
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })

  return parsedEarnings
}
