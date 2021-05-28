import React from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { Text, Flex, LinkExternal } from '@pancakeswap-libs/uikit'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { getPoolApr, getFarmApr } from 'utils/apr'
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
  isKingdomToken?: boolean
  cubAPR?: number
  lpTokenBalancePCSv2?: number
  lpTotalInQuoteTokenPCS?: number
  poolWeightPCS?: any
  tokenPriceVsQuote?: number
  pcsCompounding?: number
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
  isKingdomToken,
  cubAPR,
  lpTokenBalancePCSv2,
  lpTotalInQuoteTokenPCS,
  poolWeightPCS,
  tokenPriceVsQuote,
  pcsCompounding,
}) => {
  const TranslateString = useI18n()

  const cakePrice = useGetApiPrice('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82')

  let apr:number

  let extra = null
  if (isKingdom) {
    if (isKingdomToken)
      apr = getPoolApr(
        tokenPriceVsQuote,
        tokenPriceVsQuote,
        getBalanceNumber(new BigNumber(lpTokenBalancePCSv2).times(DEFAULT_TOKEN_DECIMAL), 18),
        parseFloat('10'),
      )
    else
      apr = getFarmApr(poolWeightPCS, new BigNumber(cakePrice), new BigNumber(lpTotalInQuoteTokenPCS), isKingdom)

    const dailyAPR = new BigNumber(apr).div(new BigNumber(365)).toNumber()

    const farmAPY = ((((apr / 100 / pcsCompounding) + 1) ** pcsCompounding) - 1) * 100
    const totalAPY = cubAPR ? cubAPR + farmAPY : farmAPY
    const totalAPYString = totalAPY && totalAPY.toLocaleString('en-US', { maximumFractionDigits: 2 })
    extra = (
      <>
        <Flex justifyContent="space-between">
          <Text>{TranslateString(354, 'Farm APR')}:</Text>
          <Text>{`${new BigNumber(apr).toFixed(2)}% (${new BigNumber(dailyAPR).toFixed(2)}%)`}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>{TranslateString(354, 'Compounds per year')}:</Text>
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
        <Flex justifyContent="space-between">
          <Text>{TranslateString(354, 'CUB APR')}:</Text>
          <Text>{cubAPR ? `${cubAPR.toLocaleString('en-US', { maximumFractionDigits: 2 })}%` : '-'}</Text>
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
