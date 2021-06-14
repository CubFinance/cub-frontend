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
import { useBusdPriceFromPid } from 'state/hooks'
// import { getAddress } from 'utils/addressHelpers'
import useKingdomAPRAPY from 'hooks/useKingdomAPRAPY'
import Balance from 'components/Balance'
import { DEFAULT_TOKEN_DECIMAL } from 'config'

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

const Kingdom: React.FC<KingdomProps> = ({ farm, removed, cakePrice, account }) => {
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const { apr, lpTotalInQuoteToken, lpSymbol, pcsPid, multiplier, isKingdom, isKingdomToken, tokenPriceVsQuote, poolWeightPCS, pcsCompounding, lpTokenBalancePCS = 0, lpTotalInQuoteTokenPCS = 0, quoteToken: { busdPrice: quoteTokenPriceUsd }, altPid } = farm
  const farmImage = lpSymbol.split(' ')[0].toLocaleLowerCase()

  let aprApy = useKingdomAPRAPY(
    isKingdom,
    isKingdomToken,
    Number(tokenPriceVsQuote),
    poolWeightPCS,
    pcsCompounding,
    apr,
    lpTokenBalancePCS,
    lpTotalInQuoteTokenPCS,
    Number(quoteTokenPriceUsd),
    altPid,
  )

  const { dailyAPR, totalAPY, newMultiplier, pcsApr } = aprApy
  const { tokenBalance, stakedBalance, earnings } = farm.userData
  const rawTokenBalance = tokenBalance ? getBalanceNumber(new BigNumber(tokenBalance)) : 0
  const rawStakedBalance = stakedBalance ? getBalanceNumber(new BigNumber(stakedBalance)) : 0
  const rawEarningsBalance = earnings ? getBalanceNumber(new BigNumber(earnings)) : 0

  const tokenPrice = useBusdPriceFromPid(farm.pid)
  let oneTokenQuoteValue = new BigNumber(0)

  if (!farm.isKingdomToken)
    oneTokenQuoteValue = lpTotalInQuoteTokenPCS ? new BigNumber(lpTotalInQuoteTokenPCS).div(new BigNumber(lpTokenBalancePCS)).times(quoteTokenPriceUsd).div(DEFAULT_TOKEN_DECIMAL) : new BigNumber(0)
  else oneTokenQuoteValue = tokenPrice.div(DEFAULT_TOKEN_DECIMAL)

  const walletBalanceQuoteValue = tokenBalance ? new BigNumber(tokenBalance).times(oneTokenQuoteValue).toNumber() : 0

  const depositBalanceQuoteValue = stakedBalance ? new BigNumber(stakedBalance).times(oneTokenQuoteValue).toNumber() : 0

  const totalValueFormated = lpTotalInQuoteToken
    ? `$${Number(new BigNumber(lpTotalInQuoteToken).times(quoteTokenPriceUsd)).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'
  const farmAPR = apr && apr.toLocaleString('en-US', { maximumFractionDigits: 2 })

  const farmName = (pcsPid || pcsPid === 0) ? 'Pancake v2' : ''

  aprApy = { ...aprApy, pcsCompounding: farm.pcsCompounding, farmAPR, apr: altPid === 12 ? pcsApr : farm.apr, cakePrice, quoteTokenPriceUsd: Number(quoteTokenPriceUsd) }

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
              <Text>{newMultiplier || multiplier}</Text>
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
            account={account}
          />
        </ExpandingWrapper>
      </K>
    </>
  )
}

export default Kingdom
