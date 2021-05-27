import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
// import { DEFAULT_TOKEN_DECIMAL } from 'config'
import cakeABI from 'config/abi/cake.json'
import multicall from 'utils/multicall'
// import { convertSharesToCake } from 'views/Pools/helpers'
// import { getCakeVaultContract } from 'utils/contractHelpers'
// import makeBatchRequest from 'utils/makeBatchRequest'
import useRefresh from './useRefresh'

// const cakeVaultContract = getCakeVaultContract()

const useTotalCakeBalance = () => {
  const [balances, setBalance] = useState(new BigNumber(0))
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchTotalStakeBalance = async () => {
      const callsNonBnbPools = [
        {
          address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
          name: 'balanceOf',
          params: ['0x73feaa1eE314F8c655E354234017bE2193C9E24E'],
        },
      ]

      const [balanceMaster] = await multicall(cakeABI, callsNonBnbPools)
      // return balanceMaster

      /* const [sharePrice, shares] = await makeBatchRequest([
        cakeVaultContract.methods.getPricePerFullShare().call,
        cakeVaultContract.methods.totalShares().call,
      ])

      const totalSharesAsBigNumber = new BigNumber(shares as string)
      const sharePriceAsBigNumber = new BigNumber(sharePrice as string)
      const totalCakeInVaultEstimate = convertSharesToCake(totalSharesAsBigNumber, sharePriceAsBigNumber)
      const totalCakeInVault = totalCakeInVaultEstimate.cakeAsBigNumber.toJSON()

      const totalManualCake = new BigNumber(balanceMaster).minus(new BigNumber(totalCakeInVault))

      setBalance(totalManualCake) */

      setBalance(new BigNumber(balanceMaster))
    }

    fetchTotalStakeBalance()
  }, [fastRefresh])

  return balances
}

export default useTotalCakeBalance
