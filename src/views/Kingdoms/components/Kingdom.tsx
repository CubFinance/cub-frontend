import React from 'react'
import BigNumber from 'bignumber.js'
import { provider } from 'web3-core'
import { Farm } from 'state/types'
import KingdomDetail from './KingdomDetail'
import ExpandIcon from './ExpandIcon'
import Divider from './Divider'
import CardValue from './CardValue'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

interface KingdomProps {
  farm: FarmWithStakedValue
  removed: boolean
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  ethereum?: provider
  account?: string
}

const Kingdom: React.FC<KingdomProps> = ({ farm, removed, cakePrice, bnbPrice, ethereum, account }) => {
  const totalValueFormated = farm.lpTotalInQuoteToken
    ? `$${Number(farm.lpTotalInQuoteToken).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  return (
    <>
      <Divider />
      <div className="k-content">
        <div className="flex-grid k-grid">
          <div className="col">
            <div className="token">{farm.tokenSymbol}</div>
            <div>{farm.multiplier} TVL {totalValueFormated}</div>
          </div>
          <div className="col">
            <div>167.8%</div>
            <div>0.46%</div>
          </div>
          <div className="col">
            <div>-</div>
            <div>-</div>
            <div>-</div>
          </div>
          <div className="col">
            <ExpandIcon />
          </div>
        </div>
        <KingdomDetail />
      </div>
    </>
  )
}

export default Kingdom
