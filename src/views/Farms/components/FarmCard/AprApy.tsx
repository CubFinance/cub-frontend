import React from 'react'
import BigNumber from 'bignumber.js'
import { Text, Flex, Skeleton } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Balance from 'components/Balance'

import ApyButton from './ApyButton'

export interface AprApyProps {
  aprApy: any
  lpLabel: string
  addLiquidityUrl: string
}

const AprApy: React.FC<AprApyProps> = ({ aprApy,  lpLabel, addLiquidityUrl }) => {
  const TranslateString = useI18n()
  const { farmAPR, apr, pcsCompounding, pcsApr, dailyAPR, farmAPY, totalAPYString, cakePrice } = aprApy

  return (
    <>
      <Flex justifyContent="space-between">
        <Text color="warning">{TranslateString(354, 'Total APY')}:</Text>
        <Text bold color="warning">{totalAPYString}%</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text>{TranslateString(354, 'Farm APR')}:</Text>
        <Text>{`${new BigNumber(pcsApr).toFixed(2)}% (${new BigNumber(dailyAPR).toFixed(3)}%)`}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text>{TranslateString(354, 'Compounds / year')}:</Text>
        <Text>~{pcsCompounding}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text>{TranslateString(354, 'Farm APY')}:</Text>
        <Balance
          fontSize="16px"
          value={farmAPY}
          decimals={2}
          unit="%"
        />
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text>{TranslateString(736, 'CUB APR')}:</Text>
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
