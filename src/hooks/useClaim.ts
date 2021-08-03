import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/actions'
import { claim } from 'utils/callHelpers'
import { useBnbDvividendsContract } from './useContract'

export const useClaim = (bnbDividends: any) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const bnbDividendsContract = useBnbDvividendsContract()
  const { user = '', amount = '', nonce = '', signature = '' } = bnbDividends

  const handleClaim = useCallback(async () => {
    const txHash = await claim(bnbDividendsContract, account, user, amount, nonce, signature)
    dispatch(fetchFarmUserDataAsync(account))
    return txHash
  }, [dispatch, account, user, amount, nonce, signature, bnbDividendsContract])

  return { onClaim: handleClaim }
}

export default useClaim
