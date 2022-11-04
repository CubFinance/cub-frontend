import BigNumber from 'bignumber.js'
// import axios from 'axios'
import erc20ABI from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import kingdomsABI from 'config/abi/kingdoms.json'
import multicall from 'utils/multicall'
import {getAddress, getKingdomsAddress, getLockedKingdomsAddress, getMasterChefAddress} from 'utils/addressHelpers'
import {FarmConfig} from 'config/constants/types'

export const fetchFarmUserAllowances = async (account: string, farmsToFetch: FarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress()
  const kingdomAddress = getKingdomsAddress()
  const lockedKingdomAddress = getLockedKingdomsAddress();

  const calls = farmsToFetch.map((farm) => {
    // const lpContractAddress = getAddress(farm.lpAddresses)
    const lpContractAddress = farm.isTokenOnly || farm.isKingdomToken ? getAddress(farm.token.address) : getAddress(farm.lpAddresses)

    let mainAddress: string;
    if (farm.isKingdomLocked) {
      mainAddress = lockedKingdomAddress;
    } else if (farm.isKingdom) {
      mainAddress = kingdomAddress;
    } else {
      mainAddress = masterChefAddress;
    }
    return { address: lpContractAddress, name: 'allowance', params: [account, mainAddress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  return rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
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

  const nonKingdomFarms = farmsToFetch.filter(farm => !farm.isKingdom)
  const kingdomFarms = farmsToFetch.filter(farm => farm.isKingdom)

  const callsMC = nonKingdomFarms.map((farm) => ({
    address: masterChefAddress,
    name: 'userInfo',
    params: [farm.pid, account],
  }))

  const callsK = kingdomFarms.map((farm) => ({
    address: kingdomAddress,
    name: 'stakedWantTokens',
    params: [farm.pid, account],
  }))

  const rawStakedBalancesMC = await multicall(masterchefABI, callsMC)
  const rawStakedBalancesK = await multicall(kingdomsABI, callsK)

  const rawStakedBalances = [...rawStakedBalancesMC, ...rawStakedBalancesK]
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: FarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress()
  const kingdomAddress = getKingdomsAddress()

  const nonKingdomFarms = farmsToFetch.filter(farm => !farm.isKingdom)
  const kingdomFarms = farmsToFetch.filter(farm => farm.isKingdom)

  const callsMC = nonKingdomFarms.map((farm) => ({
    address: masterChefAddress,
    name: 'pendingCub',
    params: [farm.pid, account],
  }))

  const callsK = kingdomFarms.map((farm) => ({
    address: kingdomAddress,
    name: 'pendingCUB',
    params: [farm.pid, account],
  }))

  const rawEarningsMasterChef = await multicall(masterchefABI, callsMC)
  const rawEarningsKingdoms = await multicall(kingdomsABI, callsK)

  const rawEarnings = [...rawEarningsMasterChef, ...rawEarningsKingdoms]
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })

  return parsedEarnings
}
