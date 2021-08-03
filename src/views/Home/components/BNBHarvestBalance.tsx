import React from 'react'
import { Text } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { BIG_ZERO } from 'utils/bigNumber'

import { useBusdPriceFromLpSymbol } from 'state/hooks'
import styled from 'styled-components'
import CardValue from './CardValue'
import CardBusdValue from './CardBusdValue'

const Block = styled.div`
  margin-bottom: 24px;
`

const BNBHarvestBalance = ({ bnbDividends }) => {
  const { account } = useWeb3React()
  const bnbPrice = useBusdPriceFromLpSymbol('BNB-BUSD LP')

  const bnbRewards = bnbDividends && bnbDividends.amount ? new BigNumber(bnbDividends.amount).div(DEFAULT_TOKEN_DECIMAL) : BIG_ZERO
  const bnbRewardsUSD = bnbRewards ? bnbRewards.multipliedBy(bnbPrice).toNumber() : 0

  if (!account) {
    return (
      <Text color="textDisabled" style={{ lineHeight: '76px' }}>
        Locked
      </Text>
    )
  }

  return (
    <Block>
      <CardValue value={bnbRewards.toNumber()} lineHeight="1.5" />
      {!bnbPrice.eq(0) && <CardBusdValue value={bnbRewardsUSD} />}
    </Block>
  )
}

export default BNBHarvestBalance
