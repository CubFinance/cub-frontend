import BigNumber from 'bignumber.js'
// import axios from 'axios'
import erc20ABI from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import kingdomsABI from 'config/abi/kingdoms.json'
import lockedKingdomsABI from 'config/abi/lockedKingdom.json'
import multicall from 'utils/multicall'
import {getAddress, getKingdomsAddress, getLockedKingdomsAddress, getMasterChefAddress} from 'utils/addressHelpers'
import {FarmConfig} from 'config/constants/types'
import {getCakeVaultEarnings} from "../../views/Kingdoms/LockedKingdom/helpers";
import {
  fetchLockedKingdomUserData,
  fetchPoolVaultData,
} from "../../views/Kingdoms/LockedKingdom/poolHelpers";
import {DEFAULT_TOKEN_DECIMAL} from "../../config";

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
  // todo: fix this for locked kingdoms
  const masterChefAddress = getMasterChefAddress()
  const kingdomAddress = getKingdomsAddress()
  const lockedKingdomsAddress = getLockedKingdomsAddress();

  const nonKingdomFarms = farmsToFetch.filter(farm => !farm.isKingdom)
  const kingdomFarms = farmsToFetch.filter(farm => farm.isKingdom && !farm.isKingdomLocked)
  const lockedKingdomFarms = farmsToFetch.filter(farm => farm.isKingdomLocked)

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

  const callsLK = lockedKingdomFarms.map(() => ({
    address: lockedKingdomsAddress,
    name: 'userInfo',
    params: [account],
  }));

  /* const fullBalance = useMemo(() => {
    return new BigNumber(shares?.minus(performanceFee).multipliedBy(pricePerFullShare).dividedBy(new BigNumber(10).pow(18)).toFixed(18)) || new BigNumber(0);
  }, [shares, performanceFee, pricePerFullShare]); */

  const rawStakedBalancesMC = await multicall(masterchefABI, callsMC)
  const rawStakedBalancesK = await multicall(kingdomsABI, callsK)
  const rawStakedBalancesLK = await multicall(lockedKingdomsABI, callsLK)

  const rawStakedBalances = [...rawStakedBalancesMC, ...rawStakedBalancesLK, ...rawStakedBalancesK]
  // parse them to their numeric forms
  // todo: might need to change this for locked to get right number of d.p.
  return rawStakedBalances.map((stakedBalance) => {
    if (Object.hasOwn(stakedBalance, 'tokenAtLastUserAction')) {
      return new BigNumber(stakedBalance.tokenAtLastUserAction._hex).toJSON()
    }
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
}

async function getLockedKingdomsUserEarnings(account: string) {
  const poolVaultData = await fetchPoolVaultData();
  const poolVaultUserData = await fetchLockedKingdomUserData(account);

  return getCakeVaultEarnings(account, new BigNumber(poolVaultUserData.tokenAtLastUserAction), new BigNumber(poolVaultUserData.shares), new BigNumber(poolVaultData.pricePerFullShare), 0, new BigNumber(poolVaultData.fees.performanceFee)).autoCakeToDisplay;
}

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: FarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress()
  const kingdomAddress = getKingdomsAddress()

  const nonKingdomFarms = farmsToFetch.filter(farm => !farm.isKingdom)
  const kingdomFarms = farmsToFetch.filter(farm => farm.isKingdom && !farm.isKingdomLocked)

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

  const callsLK = getLockedKingdomsUserEarnings(account);

  const rawEarningsMasterChef = await multicall(masterchefABI, callsMC)
  const rawEarningsKingdoms = await multicall(kingdomsABI, callsK)
  const rawEarningsLockedKingdoms = await callsLK;

  const rawEarnings = [...rawEarningsMasterChef, rawEarningsLockedKingdoms, ...rawEarningsKingdoms]
  const parsedEarnings = rawEarnings.map((earnings) => {
    if (earnings === "NaN") {
      return new BigNumber(0).toJSON()
    }

    return new BigNumber(earnings).toJSON()
  })

  return parsedEarnings
}
