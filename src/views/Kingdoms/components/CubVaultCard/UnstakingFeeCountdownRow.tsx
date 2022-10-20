import { Flex, Text, useTooltip } from '@pancakeswap-libs/uikit'
import React from 'react';
import {useWeb3React} from "@web3-react/core";

interface UnstakingFeeCountdownRowProps {
  isTableVariant?: boolean
}

const UnstakingFeeCountdownRow: React.FC<React.PropsWithChildren<UnstakingFeeCountdownRowProps>> = ({
  isTableVariant
}) => {
  const { account } = useWeb3React()

  // const feeAsDecimal = withdrawalFee / 100 || '-'
  // const withdrawalDayPeriod = withdrawalFeePeriod ? secondsToDay(withdrawalFeePeriod) : '-'
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text bold mb="4px">
        Unstaking fee: %fee%%
      </Text>
      <Text>
        Only applies within %num% days of staking. Unstaking after %num% days will not include a fee. Timer resets every time you stake new CAKE in the pool.
      </Text>
    </>
  )

  /* const { secondsRemaining, hasUnstakingFee } = useWithdrawalFeeTimer(
    parseInt(lastDepositedTime, 10),
    userShares,
    withdrawalFeePeriod,
  ) */

  // The user has made a deposit, but has no fee
  // const noFeeToPay = lastDepositedTime && !hasUnstakingFee && userShares.gt(0)

  // Show the timer if a user is connected, has deposited, and has an unstaking fee
  // const shouldShowTimer = account && lastDepositedTime && hasUnstakingFee

  // const withdrawalFeePeriodHour = withdrawalFeePeriod ? secondsToHours(withdrawalFeePeriod) : '-'

  /* const getRowText = () => {
    if (noFeeToPay) {
      return t('Unstaking Fee')
    }
    if (shouldShowTimer) {
      return t('unstaking fee before')
    }
    return t('unstaking fee if withdrawn within %num%h', { num: withdrawalFeePeriodHour })
  } */

  return null;

  /* return (
    <Flex
      alignItems={isTableVariant ? 'flex-start' : 'center'}
      justifyContent="space-between"
      flexDirection={isTableVariant ? 'column' : 'row'}
    >
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} small textTransform="lowercase">
        {noFeeToPay ? '0' : feeAsDecimal}% {getRowText()}
      </TooltipText>
      {shouldShowTimer && <WithdrawalFeeTimer secondsRemaining={secondsRemaining} />}
    </Flex>
  ) */
}

export default UnstakingFeeCountdownRow
