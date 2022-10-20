import { Flex, Text, IconButton, AddIcon, MinusIcon, useModal, Skeleton, Box } from '@pancakeswap-libs/uikit'
import React from 'react'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import VaultStakeModal from '../VaultStakeModal'
import {usePriceCakeBusd} from "../../../../../state/hooks";

interface HasStakeActionProps {
  stakingTokenBalance: BigNumber
  performanceFee: number
}

const HasSharesActions: React.FC<React.PropsWithChildren<HasStakeActionProps>> = ({
  stakingTokenBalance,
  performanceFee,
}) => {
  /* const {
    userData: {
      balance: { cakeAsBigNumber, cakeAsNumberBalance },
    },
  } = useVaultPoolByKey(pool.vaultKey) */

  // const { stakingToken } = pool

  const cakePriceBusd = usePriceCakeBusd()
  /* const stakedDollarValue = cakePriceBusd.gt(0)
    ? getBalanceNumber(cakeAsBigNumber.multipliedBy(cakePriceBusd), stakingToken.decimals)
    : 0 */

  // const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)
  /* const [onPresentStake] = useModal(
    <VaultStakeModal stakingMax={stakingTokenBalance} performanceFee={performanceFee} pool={pool} />,
  ) */
  /* const [onPresentUnstake] = useModal(
    <VaultStakeModal stakingMax={cakeAsBigNumber} pool={pool} isRemovingStake />,
    true,
    true,
    'withdraw-vault',
  ) */

  return (
    <>
      <Flex mb="16px" justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          <Balance fontSize="20px" bold value={0} decimals={5} />
          <Text as={Flex} fontSize="12px" color="textSubtle" flexWrap="wrap">
            {cakePriceBusd.gt(0) ? (
              <Balance
                value={0}
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                unit=" USD"
              />
            ) : (
              <Skeleton mt="1px" height={16} width={64} />
            )}
          </Text>
        </Flex>
      </Flex>
    </>
  )
}

export default HasSharesActions
