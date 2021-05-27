import React from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { Text, Flex, LinkExternal } from '@pancakeswap-libs/uikit'
import useTotalCakeBalance from 'hooks/useTotalCakeBalance'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { getPoolApr } from 'utils/apr'
import { getBalanceNumber } from 'utils/formatBalance'
import { useGetApiPrice } from 'state/hooks'
import Balance from 'components/Balance'
import BigNumber from 'bignumber.js'

export interface ExpandableSectionProps {
  bscScanAddress?: string
  infoAddress?: string
  removed?: boolean
  totalValueFormatted?: string
  lpLabel?: string
  addLiquidityUrl?: string
  isKingdom?: boolean
  cubAPR?: number
}

const Wrapper = styled.div`
  margin-top: 24px;
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  bscScanAddress,
  infoAddress,
  removed,
  totalValueFormatted,
  lpLabel,
  addLiquidityUrl,
  isKingdom,
  cubAPR,
}) => {
  const TranslateString = useI18n()

  const totalStakedCake = useTotalCakeBalance()
  const tokenPrice = useGetApiPrice('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82')

  let apr:number
  if (isKingdom) {
    apr = getPoolApr(
      tokenPrice,
      tokenPrice,
      getBalanceNumber(totalStakedCake, 18),
      parseFloat('10'),
    )
  }

  let extra = null
  if (isKingdom) {
    const dailyAPR = new BigNumber(apr).div(new BigNumber(365)).toNumber()
    // const one = new BigNumber(1)
    // const r = new BigNumber(apr).div(100)
    // console.log('r',r.toNumber())
    // const rDivN = r.div(4500)
    // console.log('rDivN',rDivN.toNumber())
    // const bracket = one.plus(rDivN)
    // console.log('bracket',bracket.toNumber())
    // const expo = Math.pow(bracket.toNumber(), 4500)
    // console.log('expo',expo)
    // const farmAPY = new BigNumber(expo).minus(1).times(100).toFixed(2)
    const farmAPY = ((((apr / 100 / 4500) + 1) ** 4500) - 1) * 100
    const totalAPY = cubAPR + farmAPY
    const totalAPYString = cubAPR && totalAPY.toLocaleString('en-US', { maximumFractionDigits: 2 })
    console.log('cubAPR',cubAPR)
    console.log('farmAPY',farmAPY)
console.log('totalAPY',totalAPY)
    extra = (
      <>
        <Flex justifyContent="space-between">
          <Text>{TranslateString(354, 'Farm APR')}:</Text>
          <Text>{`${new BigNumber(apr).toFixed(2)}% (${new BigNumber(dailyAPR).toFixed(2)}%)`}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>{TranslateString(354, 'Compound per year')}:</Text>
          <Text>~4,500</Text>
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
        <Flex justifyContent="space-between">
          <Text>{TranslateString(354, 'CUB APR')}:</Text>
          <Text>{cubAPR && cubAPR.toLocaleString('en-US', { maximumFractionDigits: 2 })}%</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>{TranslateString(354, 'Total APY')}:</Text>
          <Text>{totalAPYString}%</Text>
        </Flex>
      </>
    )
  }

  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <Text>{TranslateString(354, 'Total Liquidity')}:</Text>
        <Text>{totalValueFormatted}</Text>
      </Flex>
      {!removed && (
        <StyledLinkExternal href={addLiquidityUrl}>
          {TranslateString(999, `Get ${lpLabel}`, { name: lpLabel })}
        </StyledLinkExternal>
      )}
      <StyledLinkExternal href={bscScanAddress}>{TranslateString(999, 'View Contract')}</StyledLinkExternal>
      <StyledLinkExternal href={infoAddress}>{TranslateString(999, 'See Pair Info')}</StyledLinkExternal>
      {extra}
    </Wrapper>
  )
}

export default DetailsSection
