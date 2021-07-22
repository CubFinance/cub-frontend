import React, { useEffect, useCallback, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import Balance from 'components/Balance'
import { Flex, Text } from '@pancakeswap-libs/uikit'
import useTotalStaked from '../hooks/useTotalStaked';

const Wrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
`

interface TotalStakedProps {
  farms: any
  cakePrice: BigNumber
  totalStake?: any
}

const TotalStaked: React.FC<TotalStakedProps> = ({ farms, cakePrice, totalStake }) => {
  const [totalStakeUSD, totalCub, totalCubUSD, totalAPY, totalDailyAPR, count] = useTotalStaked(farms, cakePrice);

  // console.log('totalStakeUSD', totalStakeUSD)
  // console.log('totalCub', totalCub)
  // console.log('totalCubUSD', totalCubUSD)
  // console.log('totalAPY', totalAPY)
  // console.log('totalDailyAPR', totalDailyAPR)

  const stakedUSDFormatted = totalStakeUSD ?  `$${totalStakeUSD.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
    : '-'
  const dailyFormatted = totalDailyAPR ?  `${totalDailyAPR.toLocaleString('en-US', { maximumFractionDigits: 2 })}%`
      : '-'
  const cubUSDFormatted = totalCubUSD ?  `$${totalCubUSD.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
        : '-'

  return (
    <Wrapper>
      <Flex justifyContent="space-between" alignItems="flex-start">
        <div>
          <Text>Total Deposit</Text>
          <Text fontSize="18px" color="textSubtle">{stakedUSDFormatted}</Text>
          <Text>{count} assets</Text>
        </div>
        <div>
          <Text>Average APY</Text>
          <Balance
            fontSize="18px"
            value={totalAPY}
            decimals={totalAPY ? 2 : 1}
            unit="%"
            color="textSubtle"
          />
          <Text>Daily {dailyFormatted}</Text>
        </div>
        <div>
          <Text>CUB Rewards</Text>
          <Balance
            fontSize="18px"
            value={totalCub}
            decimals={totalCub ? 2 : 1}
            unit=""
            color="textSubtle"
          />
          <Text>{cubUSDFormatted}</Text>
        </div>
      </Flex>
    </Wrapper>
  )
}

export default TotalStaked
