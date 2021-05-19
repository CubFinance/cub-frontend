import React from 'react'
import Page from 'components/layout/Page'
// import styled from 'styled-components'
// import FlexLayout from 'components/layout/Flex'

import { useTotalValue } from '../../state/hooks'
import CardValue from './components/CardValue'
// import KingdomDetail from './components/KingdomDetail'
import './Kingdoms.css'

/* const KHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  position: relative;
  text-align: center;
`
const TVLHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
` */
/* export interface KingdomsProps{
  tokenMode?: boolean
  kingdomMode?: boolean
} */

const Kingdoms: React.FC = ({ children }) => {
  const totalValue = useTotalValue();
  // const { children } = kingdomsProps;

  return (
    <Page className="k-container">
      <div className='k-header'>
        <div><h1>Kingdoms</h1></div>
        <div className='tvl-header'>
          <div>TVL</div>
          <CardValue value={totalValue.toNumber()} prefix="$" decimals={2}/>
        </div>
      </div>
      <div id="kingdoms">
        <div id="content-header" className="k-content">
          <div className="flex-grid k-grid">
            <div className="col">
              <div>Token</div>
              <div>TVL</div>
            </div>
            <div className="col">
              <div>APY</div>
              <div>Daily APR</div>
              <div>AUTOx</div>
            </div>
            <div className="col">
              <div>Balance</div>
              <div>Deposit</div>
              <div>Rewards</div>
            </div>
            <div className="col" />
          </div>
        </div>
        { children }
      </div>
    </Page>
  )
}

export default Kingdoms
