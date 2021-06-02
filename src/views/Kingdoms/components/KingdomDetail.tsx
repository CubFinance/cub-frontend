import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Button as UiButton, LinkExternal, Flex, Text } from '@pancakeswap-libs/uikit'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import AprApy from 'views/Farms/components/FarmCard/AprApy'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import KingdomCard from './KingdomCard'



const Button = styled(UiButton)`
  height: 36px;
  font-size: 1rem;
  padding: 0 12px;
`

const Details = styled.div`
  margin-top: 1rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  padding-left: 0.8rem;
  padding-right: 0.8rem;
  /*font-size: 0.95rem*/
`

const Detail = styled.div`
  /*display: inline;
  margin-right: 1rem;*/
  /*& div {
    font-family: Arial;
    font-size: 0.8rem;
    padding: 2px;
  }*/
  &:nth-child(1) {
    width: 25%
  }
  &:nth-child(2) {
    width: 33%
  }
`

const KDetail = styled.div`
  /*background: ${(props) => props.theme.card.background};
  border-radius: 8px;
  box-shadow: 0 3px 4px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);*/
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`

interface KingdomDetailProps {
  farm?: FarmWithStakedValue
  walletBalance: number
  depositBalance: number
  rewardBalance: number
  walletBalanceQuoteValue: number
  depositBalanceQuoteValue: number
  lpSymbol: string
  multiplier: string
  farmName: string
  oneTokenQuoteValue: BigNumber
  removed?: boolean
  aprApy?: any
  farmContract?: string
  vaultContract?: string
  lpLabel?: string
  infoAddress?: string
  addLiquidityUrl?: string
}

const KingdomDetail: React.FC<KingdomDetailProps> = ({
  walletBalance,
  depositBalance,
  rewardBalance,
  walletBalanceQuoteValue,
  depositBalanceQuoteValue,
  lpSymbol,
  multiplier,
  farmName,
  oneTokenQuoteValue,
  removed,
  aprApy,
  farmContract,
  vaultContract,
  lpLabel,
  infoAddress,
  addLiquidityUrl
}) => {

  const tokenValueFormated = oneTokenQuoteValue
    ? `~$${oneTokenQuoteValue.times(DEFAULT_TOKEN_DECIMAL).toFixed(2)}`
    : '-'

  return (
    <KDetail>
      <KingdomCard
        walletBalance={walletBalance}
        depositBalance={depositBalance}
        rewardBalance={rewardBalance}
        walletBalanceQuoteValue={walletBalanceQuoteValue}
        depositBalanceQuoteValue={depositBalanceQuoteValue}
      />
      <Details>
        <Detail>
          <Flex justifyContent="space-between">
            <Text>{lpSymbol}:</Text>
            <Text>({tokenValueFormated})</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Multiplier:</Text>
            <Text>{multiplier}</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Type:</Text>
            <Text>Auto-compound</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Farm:</Text>
            <Text>{farmName}</Text>
          </Flex>
        </Detail>
        <Detail>
          <AprApy
            aprApy={aprApy}
            lpLabel={lpLabel}
            addLiquidityUrl={addLiquidityUrl}
            isDetails
          />
        </Detail>
        <Detail>
          <StyledLinkExternal href={farmContract}>Farm Contract</StyledLinkExternal>
          <StyledLinkExternal href={vaultContract}>Kingdom Contract</StyledLinkExternal>
          {!removed && (
            <StyledLinkExternal href={addLiquidityUrl}>
              {`Get ${lpLabel}`}
            </StyledLinkExternal>
          )}
          <StyledLinkExternal href={infoAddress}>See Token Info</StyledLinkExternal>
        </Detail>
      </Details>
    </KDetail>
  )
}

export default KingdomDetail
