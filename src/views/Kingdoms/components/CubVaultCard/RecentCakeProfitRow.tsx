import { Flex, Text } from '@pancakeswap-libs/uikit'
import React from 'react'
import {useWeb3React} from "@web3-react/core";

const RecentCakeProfitCountdownRow = () => {
  // const { account } = useWeb3React()
  // const { pricePerFullShare, userData } = useVaultPoolByKey(pool.vaultKey)
  // const cakePriceBusd = usePriceCakeBusd()
  /* const { hasAutoEarnings, autoCakeToDisplay } = getCakeVaultEarnings(
    account,
    userData.cakeAtLastUserAction,
    userData.userShares,
    pricePerFullShare,
    cakePriceBusd.toNumber(),
    pool.vaultKey === VaultKey.CakeVault
      ? (userData as DeserializedLockedVaultUser).currentPerformanceFee.plus(
          (userData as DeserializedLockedVaultUser).currentOverdueFee,
        )
      : null,
  ) */

  /* if (!(userData.userShares.gt(0) && account)) {
    return null
  } */

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="14px">Recent CAKE profit</Text>
      {/* hasAutoEarnings && <RecentCakeProfitBalance cakeToDisplay={autoCakeToDisplay} pool={pool} account={account} /> */}
    </Flex>
  )
}

export default RecentCakeProfitCountdownRow
