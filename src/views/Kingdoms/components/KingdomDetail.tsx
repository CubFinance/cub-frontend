import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Button as UiButton, Link, Flex, Text } from '@pancakeswap-libs/uikit'
import { DEFAULT_TOKEN_DECIMAL, BAKERY_ADD_LIQUIDITY_URL, PCS_ADD_LIQUIDITY_URL, BASE_EXCHANGE_URL, BELT_EXCHANGE } from 'config'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import KingdomCard from './KingdomCard'
import AprApy from './AprApy'

const Button = styled(UiButton)`
  height: 36px;
  font-size: 1rem;
  padding: 0 12px;
`

const Details = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  /*padding-left: 0.8rem;
  padding-right: 0.8rem;*/
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

const StyledLinkExternal = styled(Link)`
  font-weight: 400;
`

const CubKingdom = styled.div`
  color: ${(props) => props.theme.colors.text};
  margin-top: 0.2rem;
`

interface KingdomDetailProps {
  farm: FarmWithStakedValue
  walletBalance: number
  depositBalance: number
  rewardBalance: number
  walletBalanceQuoteValue: number
  depositBalanceQuoteValue: number
  farmName: string
  oneTokenQuoteValue: BigNumber
  removed?: boolean
  aprApy?: any
  account?: string
  cakePrice?: BigNumber
}

const KingdomDetail: React.FC<KingdomDetailProps> = ({
  farm,
  walletBalance,
  depositBalance,
  rewardBalance,
  walletBalanceQuoteValue,
  depositBalanceQuoteValue,
  farmName,
  oneTokenQuoteValue,
  removed,
  aprApy,
  account,
  cakePrice,
}) => {
  const tokenValueFormated = oneTokenQuoteValue && oneTokenQuoteValue.toString() !== 'NaN'
    ? `~$${oneTokenQuoteValue.times(DEFAULT_TOKEN_DECIMAL).toFixed(2)}`
    : '-'
  const { lpSymbol, multiplier, quoteToken, token, lpAddresses, isTokenOnly, isKingdomToken, kingdomContract, altPid } = farm
  const lpLabel = lpSymbol && lpSymbol.toUpperCase().replace('PANCAKE', '')
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
  })

  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const tokenAddress = token.address[process.env.REACT_APP_CHAIN_ID]

  const isToken = isTokenOnly || isKingdomToken
  const farmContract= isToken ?
    `https://bscscan.com/token/${tokenAddress}`
    : `https://bscscan.com/token/${lpAddress}`
  const vaultContract = `https://bscscan.com/token/${kingdomContract}`
  let infoAddress = `https://pancakeswap.info/pair/${isTokenOnly ? tokenAddress : lpAddress}`

  let exchangeUrl = PCS_ADD_LIQUIDITY_URL
  let buyTokenUrl = `${BASE_EXCHANGE_URL}/#/swap`
  let addLiquidityUrl = `${exchangeUrl}/${liquidityUrlPathParts}`
  if (farm.farmType === 'Bakery') {
    exchangeUrl = BAKERY_ADD_LIQUIDITY_URL
    addLiquidityUrl = `${exchangeUrl}/${liquidityUrlPathParts}`
    infoAddress = `https://info.bakeryswap.org/#/pair/${isTokenOnly ? tokenAddress : lpAddress}`
  }
  else if (farm.farmType === 'Belt') {
    exchangeUrl = BELT_EXCHANGE
    addLiquidityUrl = exchangeUrl
    buyTokenUrl = exchangeUrl
    infoAddress = exchangeUrl
  }

  let displayMultiplier = multiplier
  if (aprApy.newMultiplier) displayMultiplier = `${aprApy.newMultiplier}*`
  // else if (multiplier) displayMultiplier = `${multiplier.substr(0,4)}X`

  return (
    <KDetail>
      <KingdomCard
        farm={farm}
        walletBalance={walletBalance}
        depositBalance={depositBalance}
        rewardBalance={rewardBalance}
        walletBalanceQuoteValue={walletBalanceQuoteValue}
        depositBalanceQuoteValue={depositBalanceQuoteValue}
        addLiquidityUrl={addLiquidityUrl}
        account={account}
        cakePrice={cakePrice}
      />
      <Details className="k-details">
        <Detail>
          <Flex justifyContent="space-between">
            <Text>{lpSymbol}:</Text>
            <Text>({tokenValueFormated})</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Multiplier:</Text>
            <Text>{displayMultiplier}</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Type:</Text>
            <Text>Auto-compound</Text>
          </Flex>
          {altPid === 12 ? (
            <CubKingdom>*CUB Kingdom multiplier coexists with CUB Den multiplier</CubKingdom>
          ) : (
            <Flex justifyContent="space-between">
              <Text>Farm:</Text>
              <Text>{farmName}</Text>
            </Flex>
          )}
        </Detail>
        <Detail>
          <AprApy
            aprApy={aprApy}
            lpLabel={lpLabel}
            addLiquidityUrl={addLiquidityUrl}
          />
        </Detail>
        <Detail>
          <StyledLinkExternal external href={farmContract}>Farm Contract</StyledLinkExternal>
          <StyledLinkExternal external href={vaultContract}>Kingdom Contract</StyledLinkExternal>
          {!removed && (
            <>
              <StyledLinkExternal external href={buyTokenUrl}>
                {`Buy ${token.symbol}`}
              </StyledLinkExternal>
              <StyledLinkExternal external href={addLiquidityUrl}>
                Add Liquidity
              </StyledLinkExternal>
            </>
          )}
          <StyledLinkExternal external href={infoAddress}>See Token Info</StyledLinkExternal>
        </Detail>
      </Details>
    </KDetail>
  )
}

export default KingdomDetail
