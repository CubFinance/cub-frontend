import React from 'react'
import { Text } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import CardValue from 'views/Home/components/CardValue'
import CardBusdValue from 'views/Home/components/CardBusdValue'

const Block = styled.div`
  margin-bottom: 24px;
`

const StakedBalance = ({ cub, value }) => {
  const TranslateString = useI18n()
  const { account } = useWeb3React()

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
