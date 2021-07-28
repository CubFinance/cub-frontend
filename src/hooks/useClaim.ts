import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync, updateUserBalance, updateUserPendingReward } from 'state/actions'
import { claim } from 'utils/callHelpers'
import { useMasterchef, useSousChef, useKingdom } from './useContract'

export const useClaim = (bnbDividends: any) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { user = '', amount = '', nonce = '', signature = '' } = bnbDividends

  const handleClaim = useCallback(async () => {
    const txHash = await claim('0xa22efc88F3Eb641D881D0807dc8E305d71920cAB', account, user, amount, nonce, signature)
    dispatch(fetchFarmUserDataAsync(account))
    return txHash
  }, [dispatch, account, user, amount, nonce, signature])

  return { onClaim: handleClaim }
}

export default useClaim
