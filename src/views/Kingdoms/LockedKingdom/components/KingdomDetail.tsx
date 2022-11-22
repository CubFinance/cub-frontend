import React, {useMemo} from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Link, Flex, Text } from '@pancakeswap-libs/uikit'
import { DEFAULT_TOKEN_DECIMAL, BAKERY_ADD_LIQUIDITY_URL, PCS_ADD_LIQUIDITY_URL, PCS_EXCHANGE_URL, BELT_EXCHANGE } from 'config'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import LockedKingdomCard from './LockedKingdomCard'
import AprApy from './AprApy'
import useAvgLockDuration from "./useAvgLockDuration";
import Balance from "../../../../components/Balance";

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
  cakeVaultEarnings?: any
  cakePrice?: BigNumber
  bnbDividends?: any
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
  bnbDividends,
    cakeVaultEarnings,
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
  const vaultContract = `https://bscscan.com/address/${kingdomContract}`
  let infoAddress = `https://pancakeswap.info/pair/${isTokenOnly ? tokenAddress : lpAddress}`

  const avgLockDuration = useAvgLockDuration(new BigNumber(farm?.lockedKingdomData?.totalLockedAmount || 0), new BigNumber(farm?.lockedKingdomData?.totalShares || 0), new BigNumber(farm?.lockedKingdomData?.totalBalance || 0), new BigNumber(farm?.lockedKingdomData?.pricePerFullShare || 0));
  const totalLocked = useMemo(() => farm?.lockedKingdomData?.totalLockedAmount ? new BigNumber(farm?.lockedKingdomData?.totalLockedAmount).toFixed(0) : 0, [farm?.lockedKingdomData?.totalLockedAmount]);

  let exchangeUrl = PCS_ADD_LIQUIDITY_URL
  let buyTokenUrl = `${PCS_EXCHANGE_URL}/swap/${token.address['56']}`
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
      <Details className="k-details" style={{flexWrap: "wrap"}}>
        <Detail style={{width: "20%"}}>
          <Flex justifyContent="space-between">
            <Text>Total locked:</Text>
            <Text><Balance value={Number(totalLocked)} fontSize="md" decimals={0} unit=" CUB" /></Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text><abbr title="The average lock duration of all the locked staking positions of other users">Avg. Lock Duration:</abbr></Text>
            <Text>{avgLockDuration.avgLockDurationsInWeeks}</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Multiplier:</Text>
            <Text>{displayMultiplier}</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Performance Fee:</Text>
            <Text>0~2%</Text>
          </Flex>
          <StyledLinkExternal external href={infoAddress}>See Token Info</StyledLinkExternal>
          <StyledLinkExternal external href={vaultContract}>See Contract</StyledLinkExternal>
          <StyledLinkExternal external href={buyTokenUrl}>
            {`Buy ${token.symbol}`}
          </StyledLinkExternal>
        </Detail>
        <LockedKingdomCard
            farm={farm}
            aprApy={aprApy}
            walletBalance={walletBalance}
            depositBalance={depositBalance}
            rewardBalance={rewardBalance}
            walletBalanceQuoteValue={walletBalanceQuoteValue}
            depositBalanceQuoteValue={depositBalanceQuoteValue}
            addLiquidityUrl={addLiquidityUrl}
            account={account}
            cakeVaultEarnings={cakeVaultEarnings}
            cakePrice={cakePrice}
            bnbDividends={bnbDividends}
        />
      </Details>
    </KDetail>
  )
}

export default KingdomDetail
