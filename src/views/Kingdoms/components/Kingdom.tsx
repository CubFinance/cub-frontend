import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { provider } from 'web3-core'
import styled from 'styled-components'
// import { IconButton } from '@pancakeswap-libs/uikit'
// import { Farm } from 'state/types'
import { tokenEarnedPerThousandDollarsCompounding, getRoi } from 'utils/compoundApyHelpers'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { getBalanceNumber } from 'utils/formatBalance'
import { useFarmUser } from 'state/hooks'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'

import KingdomDetail from './KingdomDetail'
// import ExpandIcon from './ExpandIcon'
import Divider from './Divider'
// import LinkButton from './LinkButton'
// import CardValue from './CardValue'

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
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

  const { apr } = farm

  const totalValueFormated = farm.lpTotalInQuoteToken
    ? `$${Number(farm.lpTotalInQuoteToken).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'
  const farmAPR = apr && apr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  // const farmApy = farm.apy.times(new BigNumber(100)).toNumber()
  // const oneThousandDollarsWorthOfCake = 1000 / cakePrice.toNumber()
  // const cakeEarnedPerThousand365D = tokenEarnedPerThousandDollarsCompounding({ numberOfDays: 365, farmAPR, cakePrice })
  // const cakeEarnedPerThousand1D = tokenEarnedPerThousandDollarsCompounding({ numberOfDays: 1, farmAPR, cakePrice })

  const { earnings, stakedBalance } = useFarmUser(farm.pid)

  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayDeposit = rawStakedBalance.toLocaleString()

  const rawEarningsBalance = getBalanceNumber(earnings)
  const displayBalance = rawEarningsBalance.toLocaleString()

  return (
    <>
      <Divider />
      <div className="k-content">
        <div className="flex-grid k-grid">
          <div className="col">
            <div className="token">{farm.lpSymbol}</div>
            <div> TVL {totalValueFormated}</div>
          </div>
          <div className="col">
            {/* <div>{getRoi({ amountEarned: cakeEarnedPerThousand365D, amountInvested: oneThousandDollarsWorthOfCake })}%</div>
            <div>{getRoi({ amountEarned: cakeEarnedPerThousand1D, amountInvested: oneThousandDollarsWorthOfCake })}%</div>
            <div>{farm.multiplier}</div> */}
          </div>
          <div className="col">
            <div>{displayBalance}</div>
            <div>{displayDeposit}</div>
            <div>0.00</div>
          </div>
          <div className="col">
            <ExpandableSectionButton
              onClick={() => setShowExpandableSection(!showExpandableSection)}
              expanded={showExpandableSection}
              // onlyArrow
            />
          </div>
        </div>
        <ExpandingWrapper expanded={showExpandableSection}>
          <KingdomDetail
            farm={farm}
          />
        </ExpandingWrapper>
      </div>
    </>
  )
}

export default Kingdom
