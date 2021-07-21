import React, { useEffect, useCallback, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import useTotalStaked from '../hooks/useTotalStaked';

interface TotalStakedProps {
  farms: any
  cakePrice: BigNumber
  totalStake?: any
}

const TotalStaked: React.FC<TotalStakedProps> = ({ farms, cakePrice, totalStake }) => {
  const [totalStakeUSD, totalCub, totalCubUSD, totalAPY, totalDailyAPR] = useTotalStaked(farms, cakePrice);

  // const [totalCub, totalCubUSD] = useTotalStaked(farms, cakePrice);
  // console.log('totalCub', totalCub)
  // console.log('totalCubUSD', totalCubUSD)
  // console.log('totalStake',totalStake)

  console.log('totalStakeUSD', totalStakeUSD)
  console.log('totalCub', totalCub)
  console.log('totalCubUSD', totalCubUSD)
  console.log('totalAPY', totalAPY)
  console.log('totalDailyAPR', totalDailyAPR)

  return (
    <>
      staked
    </>
  )
}

export default TotalStaked
