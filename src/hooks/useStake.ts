import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync, updateUserStakedBalance, updateUserBalance } from 'state/actions'
import { stake, sousStake, sousStakeBnb } from 'utils/callHelpers'
import { useMasterchef, useSousChef, useKingdom } from './useContract'

const useStake = (pid: number, isKingdom?: boolean) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const kingdomContract = useKingdom()

  const handleStake = useCallback(
    async (amount: string) => {
      await stake(isKingdom ? kingdomContract : masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
    },
    [account, dispatch, masterChefContract, pid, kingdomContract, isKingdom],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if (sousId === 0) {
        await stake(masterChefContract, 0, amount, account)
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account)
      } else {
        await sousStake(sousChefContract, amount, decimals, account)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId],
  )

  return { onStake: handleStake }
}

export default useStake
