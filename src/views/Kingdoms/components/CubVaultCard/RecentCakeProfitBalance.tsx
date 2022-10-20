import { useTooltip, Text } from '@pancakeswap-libs/uikit'
import Balance from 'components/Balance'
import React from 'react'

interface RecentCakeProfitBalanceProps {
  cakeToDisplay: number
  account: string
}

const RecentCakeProfitBalance: React.FC<React.PropsWithChildren<RecentCakeProfitBalanceProps>> = ({
  cakeToDisplay,
  account,
}) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<Text>Test</Text>)

  return (
    <>
      {tooltipVisible && tooltip}
      <Text ref={targetRef} small>
        <Balance fontSize="14px" value={cakeToDisplay} />
      </Text>
    </>
  )
}

export default RecentCakeProfitBalance
