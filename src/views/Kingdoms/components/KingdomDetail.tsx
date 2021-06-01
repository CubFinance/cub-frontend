import React from 'react'
// import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Button as UiButton } from '@pancakeswap-libs/uikit'
import KingdomCard from './KingdomCard'
import { FarmWithStakedValue } from '../../Farms/components/FarmCard/FarmCard'

const Button = styled(UiButton)`
  height: 36px;
  font-size: 1rem;
  padding: 0 12px;
`

const Details = styled.div`
  margin-top: 1rem;
  margin-bottom: 2rem;
  display: flex;
  font-size: 1rem;
  font-size: 0.95rem
`

const Detail = styled.div`
  display: inline;
  margin-right: 1rem;
  & div {
    font-family: Arial;
    font-size: 0.8rem;
    padding: 2px;
  }
`

const DHeader = styled.span`
  font-size: 1rem;
`

interface KingdomDetailProps {
  farm?: FarmWithStakedValue
  walletBalance: number
  depositBalance: number
  rewardBalance: number
  walletBalanceQuoteValue: number
  depositBalanceQuoteValue: number
}

const KingdomDetail: React.FC<KingdomDetailProps> = ({ walletBalance, depositBalance, rewardBalance, walletBalanceQuoteValue, depositBalanceQuoteValue }) => {

  return (
    <>
      <KingdomCard
        walletBalance={walletBalance}
        depositBalance={depositBalance}
        rewardBalance={rewardBalance}
        walletBalanceQuoteValue={walletBalanceQuoteValue}
        depositBalanceQuoteValue={depositBalanceQuoteValue}
      />
      <Button mr="8px" variant="secondary">Farm Contract</Button>
      <Button mr="8px" variant="secondary">Vault Contract</Button>
      <Details>
        <Detail>
          <DHeader>Vault Details</DHeader>
          <div>Asset: BTC</div>
          <div>($3,019.33)</div>
          <div>AUTO multiplier: 0.05x </div>
          <div>Type: auto-compounding</div>
          <div>Farm name: Bakery</div>
        </Detail>
        <Detail>
          <DHeader>APY Calculations</DHeader>
          <div>Farm APR: 72.8% (0.20% daily)</div>
          <div>Optimal compounds per year: 365</div>
          <div>Farm APY: 103.7%</div>
          <div>AUTO APR: 76.1% (0.21% daily)</div>
          <div>Total APY: 179.8%</div>
        </Detail>
        <Detail>
          <DHeader>Fees</DHeader>
          <div>Management Fee: 0.9%</div>
          <div>Withdrawal Fee: None</div>
          <div>Fee to CUB Staking Kingdom: 1%</div>
          <div>CUB Burn Rate: 100% of Fees Buyback and Burn CUB</div>
        </Detail>
      </Details>
    </>
  )
}

export default KingdomDetail
