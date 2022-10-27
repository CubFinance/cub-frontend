import React from 'react'
import BigNumber from 'bignumber.js'
import { Text, Flex, Skeleton } from '@pancakeswap-libs/uikit'
import Balance from 'components/Balance'

import ApyButton from 'views/Farms/components/FarmCard/ApyButton'

export interface AprApyProps {
  aprApy: any
  lpLabel: string
  addLiquidityUrl: string
}

const AprApy: React.FC<AprApyProps> = ({ aprApy,  lpLabel, addLiquidityUrl }) => {
  const { farmAPR, apr, compounding, hostApr, dailyAPR, farmAPY, totalAPYString, cakePrice, aprWithLpRewards, lpRewardsApr } = aprApy

  return (
    <>
      <Flex justifyContent="space-between">
        <Text color="warning">Total APY:</Text>
        <Text bold color="warning">{totalAPYString}%</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text>Farm APR:</Text>
        <Text>{`${new BigNumber(hostApr).toFixed(2)}% (${new BigNumber(dailyAPR).toFixed(3)}%)`}</Text>
      </Flex>
      {lpRewardsApr ? (
        <Flex justifyContent="space-between">
          <Text>APR+LP rewards:</Text>
          <Text>{aprWithLpRewards}%</Text>
        </Flex>
      ) : null}
      <Flex justifyContent="space-between">
        <Text>Compounds / year:</Text>
        <Text>~{compounding}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text>Farm APY:</Text>
        <Balance
          fontSize="16px"
          value={farmAPY}
          decimals={2}
          unit="%"
        />
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text>CUB APR:</Text>
        <Text bold style={{ display: 'flex', alignItems: 'center' }}>
          {apr ? (
            <>
              <ApyButton lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} cakePrice={cakePrice} apr={apr} />
              {farmAPR || apr.toLocaleString('en-US', { maximumFractionDigits: 2 })}%
            </>
          ) : (
            <Skeleton height={24} width={80} />
          )}
        </Text>
      </Flex>
    </>
  )
}

export default AprApy
