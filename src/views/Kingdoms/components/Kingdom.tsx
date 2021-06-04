import React, { useState, useMemo } from 'react'
import { Text, Image, Flex } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import { provider } from 'web3-core'
import styled from 'styled-components'
// import { IconButton } from '@pancakeswap-libs/uikit'
// import { Farm } from 'state/types'
// import { tokenEarnedPerThousandDollarsCompounding, getRoi } from 'utils/compoundApyHelpers'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
// import { useFarmUser } from 'state/hooks'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import useKingdomAPRAPY from 'hooks/useKingdomAPRAPY'
import Balance from 'components/Balance'

import KingdomDetail from './KingdomDetail'
// import ExpandIcon from './ExpandIcon'
import Divider from './DividerBlue'
// import LinkButton from './LinkButton'
// import CardValue from './CardValue'

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

const K = styled.div`
  background: ${(props) => props.theme.card.background};
  border-radius: 8px;
  box-shadow: 0 3px 4px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);
  padding: 0.4rem 0.8rem;
`

const KImage = styled(Image)`
  width: 64px;
`

// export interface FarmWithStakedValue extends Farm {
//   apy?: BigNumber
// }

interface KingdomProps {
  farm: FarmWithStakedValue
  removed?: boolean
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  ethereum?: provider
  account?: string
}

const Kingdom: React.FC<KingdomProps> = ({ farm, removed, cakePrice, bnbPrice, ethereum, account }) => {
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const { apr, lpTotalInQuoteToken, kingdomSupply, lpSymbol, pcsPid, multiplier, isKingdom, isKingdomToken, tokenPriceVsQuote, poolWeightPCS, pcsCompounding, lpTokenBalancePCSv2 = 0, lpTotalInQuoteTokenPCS = 0 } = farm
  const farmImage = lpSymbol.split(' ')[0].toLocaleLowerCase()
  let aprApy = useKingdomAPRAPY(
    isKingdom,
    isKingdomToken,
    Number(tokenPriceVsQuote),
    poolWeightPCS,
    pcsCompounding,
    apr,
    lpTokenBalancePCSv2,
    lpTotalInQuoteTokenPCS,
  )
  const { dailyAPR, totalAPY } = aprApy
  const { tokenBalance, stakedBalance, earnings } = farm.userData
  const rawTokenBalance = tokenBalance ? getBalanceNumber(new BigNumber(tokenBalance)) : 0
  const rawStakedBalance = stakedBalance ? getBalanceNumber(new BigNumber(stakedBalance)) : 0
  const rawEarningsBalance = earnings ? getBalanceNumber(new BigNumber(earnings)) : 0

  // to get usd value of liquiidty when not USD quote token
  /* const quoteTokenPriceUsd = prices[getAddress(farm.quoteToken.address).toLowerCase()]
  const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(quoteTokenPriceUsd) */

  const oneTokenQuoteValue = lpTotalInQuoteToken && kingdomSupply ? new BigNumber(1).times(lpTotalInQuoteToken).div(new BigNumber(kingdomSupply)) : new BigNumber(0)

  const walletBalanceQuoteValue = tokenBalance ? new BigNumber(tokenBalance).times(oneTokenQuoteValue).toNumber() : 0

  const depositBalanceQuoteValue = stakedBalance ? new BigNumber(stakedBalance).times(oneTokenQuoteValue).toNumber() : 0

  const totalValueFormated = lpTotalInQuoteToken
    ? `$${Number(lpTotalInQuoteToken).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'
  const farmAPR = apr && apr.toLocaleString('en-US', { maximumFractionDigits: 2 })

  const farmName = (pcsPid || pcsPid === 0) ? 'Pancake v2' : ''

  aprApy = { ...aprApy, pcsCompounding: farm.pcsCompounding, farmAPR, apr: farm.apr, cakePrice }

  return (
    <>
      <Divider />
      <K>
        <div className="flex-grid k-grid">
          <div className="col"><KImage src={`/images/farms/${farmImage}.png`} alt={lpSymbol} width={64} height={64} /></div>
          <div className="col">
            <Flex justifyContent="flex-start" alignItems="center">
              <Text className="token">{lpSymbol}</Text>
            </Flex>
            <Text>{farmName}</Text>
            <Text> TVL {totalValueFormated}</Text>
          </div>
          <div className="col">
            <Balance
              fontSize="16px"
              value={totalAPY}
              decimals={2}
              unit="%"
            />
            <Balance
              fontSize="16px"
              value={dailyAPR}
              decimals={2}
              unit="%"
            />
            <Text>{multiplier}</Text>
          </div>
          <div className="col">
            <Balance
              fontSize="16px"
              value={rawTokenBalance}
              decimals={rawTokenBalance ? 2 : 1}
              unit=""
            />
            <Balance
              fontSize="16px"
              value={rawStakedBalance}
              decimals={rawStakedBalance ? 2 : 1}
              unit=""
            />
            <Balance
              fontSize="16px"
              value={rawEarningsBalance}
              decimals={rawEarningsBalance ? 2 : 1}
              unit=""
            />
          </div>
          <div className="col">
            <ExpandableSectionButton
              onClick={() => setShowExpandableSection(!showExpandableSection)}
              expanded={showExpandableSection}
              onlyArrow
            />
          </div>
        </div>
        <ExpandingWrapper expanded={showExpandableSection}>
          <KingdomDetail
            farm={farm}
            walletBalance={rawTokenBalance}
            depositBalance={rawStakedBalance}
            rewardBalance={rawEarningsBalance}
            walletBalanceQuoteValue={walletBalanceQuoteValue}
            depositBalanceQuoteValue={depositBalanceQuoteValue}
            farmName={farmName}
            oneTokenQuoteValue={oneTokenQuoteValue}
            removed={removed}
            aprApy={aprApy}
          />
        </ExpandingWrapper>
      </K>
    </>
  )
}

export default Kingdom
