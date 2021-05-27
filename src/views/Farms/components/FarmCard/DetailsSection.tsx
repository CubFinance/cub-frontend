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

export interface ExpandableSectionProps {
  bscScanAddress?: string
  infoAddress?: string
  removed?: boolean
  totalValueFormatted?: string
  lpLabel?: string
  addLiquidityUrl?: string
  isKingdom?: boolean
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
      <Flex justifyContent="space-between">
        <Text>{TranslateString(354, 'CAKE APR')}:</Text>
        <Text>
          <Balance
            fontSize="16px"
            value={apr}
            decimals={2}
            unit="%"
            bold
          />
        </Text>
      </Flex>

    </Wrapper>
  )
}

export default DetailsSection
