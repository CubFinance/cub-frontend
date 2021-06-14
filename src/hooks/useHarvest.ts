import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync, updateUserBalance, updateUserPendingReward } from 'state/actions'
import { soushHarvest, soushHarvestBnb, harvest } from 'utils/callHelpers'
import { useMasterchef, useSousChef, useKingdom } from './useContract'

export const useHarvest = (farmPid: number, isKingdom?: boolean) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const kingdomContract = useKingdom()

  const handleHarvest = useCallback(async () => {
    const txHash = await harvest(isKingdom ? kingdomContract : masterChefContract, farmPid, account, isKingdom)
    dispatch(fetchFarmUserDataAsync(account))
    return txHash
  }, [account, dispatch, farmPid, masterChefContract, kingdomContract, isKingdom])

  return { onReward: handleHarvest }
}

export const useAllHarvest = (farms: any[]) => {
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const kingdomContract = useKingdom()

  const handleHarvest = useCallback(async () => {
    const harvestPromises = farms.reduce((accum, farm) => {
      if (farm.isKingdom) return [...accum, harvest(kingdomContract, farm.pid, account, farm.isKingdom)]
      return [...accum, harvest(masterChefContract, farm.pid, account, farm.isKingdom)]
    }, [])

    return Promise.all(harvestPromises)
  }, [account, farms, masterChefContract, kingdomContract])

  return { onReward: handleHarvest }
}

export const useSousHarvest = (sousId, isUsingBnb = false) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const sousChefContract = useSousChef(sousId)
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    if (sousId === 0) {
      await harvest(masterChefContract, 0, account, false)
    } else if (isUsingBnb) {
      await soushHarvestBnb(sousChefContract, account)
    } else {
      await soushHarvest(sousChefContract, account)
    }
    dispatch(updateUserPendingReward(sousId, account))
    dispatch(updateUserBalance(sousId, account))
  }, [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId])

  return { onReward: handleHarvest }
}
