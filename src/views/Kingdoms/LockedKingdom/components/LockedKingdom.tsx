import React, {useEffect, useMemo, useState} from 'react'
import { Text, Image, Flex } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import getKingdomAPRAPY from 'utils/getKingdomAPRAPY'
import Balance from 'components/Balance'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import KingdomDetail from './KingdomDetail'
import Divider from './DividerBlue'
import Spacer from './Spacer'
import useVaultApy from "../../../../hooks/useVaultApy";
import {getCakeVaultEarnings} from "../helpers";

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

const K = styled.div`
  align-self: baseline;
  background: ${(props) => props.theme.card.background};
  border-radius: 8px;
  box-shadow: 0 3px 4px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0.4rem 0.8rem;
  position: relative;
`

const RainbowLight = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 8px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const KImage = styled(Image)`
  width: 64px;
`

const KMain = styled.div`
  cursor: pointer;
`

interface KingdomProps {
  farm: FarmWithStakedValue
  removed?: boolean
  cakePrice?: BigNumber
  account?: string
  bakePrice?: BigNumber
  beltPrice?: BigNumber
  cubDen?: any
  realCakePrice?: BigNumber
  bnbDividends?: any
}

const LockedKingdom: React.FC<KingdomProps> = ({ farm, removed, cakePrice, account, bakePrice, beltPrice, cubDen, realCakePrice, bnbDividends }) => {
  const [showExpandableSection, setShowExpandableSection] = useState(false)
    const [cakeVaultEarnings, setCakeVaultEarnings] = useState(null)

    // useswrimmutable to getCakeVaultEarnings from chain data called "chain-balance-locked-cub"
    useEffect(() => {
        if (farm?.userData?.lockedKingdomUserData) {
            setCakeVaultEarnings(getCakeVaultEarnings(account, new BigNumber(farm?.userData?.lockedKingdomUserData?.tokenAtLastUserAction).times(DEFAULT_TOKEN_DECIMAL), new BigNumber(farm?.userData?.lockedKingdomUserData?.shares), new BigNumber(farm?.lockedKingdomData.pricePerFullShare), cakePrice.toNumber(), new BigNumber(farm?.userData?.lockedKingdomUserData?.performanceFee).plus(new BigNumber(farm?.userData?.lockedKingdomUserData?.overdueFee)).plus(new BigNumber(farm?.userData?.lockedKingdomUserData?.userBoostedShare))))
        }
    }, [account, cakePrice, farm?.lockedKingdomData?.pricePerFullShare, farm?.userData?.lockedKingdomUserData])

  const { lpTotalInQuoteToken, lpSymbol, lpTokenBalancePCS = 0, lpTotalInQuoteTokenPCS = 0, quoteToken: { busdPrice: quoteTokenPriceUsd }, farmType, token: { busdPrice: tokenPriceString } } = farm
  const farmImage = lpSymbol.split(' ')[0].toLocaleLowerCase()

  const { tokenBalance, stakedBalance, earnings } = farm.userData



  const rawTokenBalance = tokenBalance ? getBalanceNumber(new BigNumber(tokenBalance)) : 0
  const rawStakedBalance = stakedBalance ? getBalanceNumber(new BigNumber(stakedBalance)) : 0
  const rawEarningsBalance = cakeVaultEarnings?.autoCakeToDisplay ? getBalanceNumber(new BigNumber(cakeVaultEarnings?.autoCakeToDisplay).times(DEFAULT_TOKEN_DECIMAL)) : 0
  const tokenPrice = new BigNumber(tokenPriceString);
  let oneTokenQuoteValue: BigNumber;

  if (!farm.isKingdomToken)
    oneTokenQuoteValue = lpTotalInQuoteTokenPCS ? new BigNumber(lpTotalInQuoteTokenPCS).div(new BigNumber(lpTokenBalancePCS)).times(quoteTokenPriceUsd).div(DEFAULT_TOKEN_DECIMAL) : new BigNumber(0)
  else oneTokenQuoteValue = farm.farmType !== 'Belt' ? tokenPrice.div(DEFAULT_TOKEN_DECIMAL) : new BigNumber(farm.token.busdPrice).div(DEFAULT_TOKEN_DECIMAL)

  const walletBalanceQuoteValue = tokenBalance ? new BigNumber(tokenBalance).times(oneTokenQuoteValue).toNumber() : 0

  const depositBalanceQuoteValue = stakedBalance ? new BigNumber(stakedBalance).times(oneTokenQuoteValue).toNumber() : 0

  // @ts-ignore
    const totalValueFormated = lpTotalInQuoteToken && lpTotalInQuoteToken !== "NaN"
    ? `$${Number(new BigNumber(lpTotalInQuoteToken).times(quoteTokenPriceUsd)).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

    const aprApy = useVaultApy({duration: 31449600, tvl: totalValueFormated});
    const { flexibleApy, lockedApy } = aprApy;

  return (
    <>
      <Spacer />
      <K>
        {farm.token.symbol === 'CUB' && <StyledCardAccent />}
        <KMain role="presentation" className="flex-grid k-grid" onClick={() => setShowExpandableSection(!showExpandableSection)}
      >
          <div className="col"><KImage src={`/images/farms/${farmImage}.png`} alt={lpSymbol} width={64} height={64} /></div>
          <div className="col">
            <Flex justifyContent="flex-start" alignItems="center">
              <Text className="token">{lpSymbol}</Text>
            </Flex>
            <Text>Uses: {farmType}</Text>
            <Text>TVL {totalValueFormated}</Text>
          </div>
          <div className="col">
            <Balance
              fontSize="16px"
              value={rawTokenBalance}
              decimals={rawTokenBalance ? 2 : 1}
              unit=""
              color={rawTokenBalance ? "warning" : "text"}
            />
            <Text>Balance</Text>
          </div>
          <div className="col">
            <Balance
              fontSize="16px"
              value={rawStakedBalance}
              decimals={rawStakedBalance ? 2 : 1}
              unit=""
              color={rawStakedBalance ? "warning" : "text"}
            />
            <Text>Deposited</Text>
          </div>
          <div className="col">
            <Balance
              fontSize="16px"
              value={rawEarningsBalance}
              decimals={rawEarningsBalance ? 2 : 1}
              unit=""
              color={rawEarningsBalance ? "warning" : "text"}
            />
            <Text>Rewards</Text>
          </div>
          <div className="col">
              <Text color="warning">Up to</Text>
            <Balance
              fontSize="16px"
              value={!Number.isNaN(Number(lockedApy)) ? Number(lockedApy) : 0}
              decimals={2}
              unit="%"
              color="warning"
            />
            <Text color="warning">APY</Text>
          </div>
            <div className="col">
            <Text>Flexible</Text>
                <Balance
              fontSize="16px"
              value={!Number.isNaN(Number(flexibleApy)) ? Number(flexibleApy) : 0}
              decimals={2}
              unit="%"
            />
            <Text>APY</Text>
          </div>
        </KMain>
        <ExpandingWrapper expanded={showExpandableSection}>
          <Divider />
          <KingdomDetail
            farm={farm}
            walletBalance={rawTokenBalance}
            depositBalance={rawStakedBalance}
            cakeVaultEarnings={cakeVaultEarnings}
            rewardBalance={rawEarningsBalance}
            walletBalanceQuoteValue={walletBalanceQuoteValue}
            depositBalanceQuoteValue={depositBalanceQuoteValue}
            farmName={farmType}
            oneTokenQuoteValue={oneTokenQuoteValue}
            removed={removed}
            aprApy={aprApy}
            account={account}
            cakePrice={cakePrice}
            bnbDividends={bnbDividends}
          />
        </ExpandingWrapper>
      </K>
    </>
  )
}

export default LockedKingdom
