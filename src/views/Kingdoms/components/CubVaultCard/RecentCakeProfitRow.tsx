import { Flex, Text } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool, VaultKey, DeserializedLockedVaultUser } from 'state/types'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
import RecentCakeProfitBalance from './RecentCakeProfitBalance'

const RecentCakeProfitCountdownRow = ({ pool }: { pool: DeserializedPool }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pricePerFullShare, userData } = useVaultPoolByKey(pool.vaultKey)
  const cakePriceBusd = usePriceCakeBusd()
  const { hasAutoEarnings, autoCakeToDisplay } = getCakeVaultEarnings(
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
  )

  if (!(userData.userShares.gt(0) && account)) {
    return null
  }

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="14px">{`${t('Recent CAKE profit')}:`}</Text>
      {hasAutoEarnings && <RecentCakeProfitBalance cakeToDisplay={autoCakeToDisplay} pool={pool} account={account} />}
    </Flex>
  )
}

export default RecentCakeProfitCountdownRow
