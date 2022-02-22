import React from 'react'
import { Text } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import useAllEarnings from 'hooks/useAllEarnings'
import { usePriceCakeBusd, useTotalCubStaked } from 'state/hooks'
import styled from 'styled-components'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import CardValue from '../Home/components/CardValue'
import CardBusdValue from '../Home/components/CardBusdValue'

const Block = styled.div`
  margin-bottom: 24px;
`

const StakedBalance = () => {
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const { cub, value } = useTotalCubStaked()
  console.log('cub',cub.toNumber())
  console.log('value',value.toNumber())

  // const cakePriceBusd = usePriceCakeBusd()
  // const earningsBusd = new BigNumber(totalCUB).multipliedBy(cakePriceBusd).toNumber()

  if (!account) {
    return (
      <Text color="textDisabled" style={{ lineHeight: '76px' }}>
        {TranslateString(298, 'Locked')}
      </Text>
    )
  }

  return (
    <Block>
      <CardValue value={cub.toNumber()} lineHeight="1.5" />
      {value.gt(0) && <CardBusdValue value={value.toNumber()} />}
    </Block>
  )
}

export default StakedBalance
