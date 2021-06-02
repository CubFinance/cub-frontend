import React from 'react'
// import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { usePriceCakeBusd } from 'state/hooks'
// import { getBalanceNumber } from 'utils/formatBalance'
import { Flex, Text, Input, Button as UiButton } from '@pancakeswap-libs/uikit'
import Balance from 'components/Balance'
import CardBusdValue from 'views/Home/components/CardBusdValue'
import CardValue from './CardValue'
import { FarmWithStakedValue } from '../../Farms/components/FarmCard/FarmCard'
import './KingdomCard.css'

const KCard = styled.div`
  align-self: baseline;
  /*background: ${(props) => props.theme.card.background};
  border-radius: 8px;
  box-shadow: 0 3px 4px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);*/
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 6px 12px;
  position: relative;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`

const Button = styled(UiButton)`
  height: 40px;
  margin-top: 0;
`

const Values = styled.div`
  display: inline-flex
`

const Brackets = styled.span`
  color: ${(props) => props.theme.colors.text};
`

interface KingdomCardProps {
  farm?: FarmWithStakedValue
  walletBalance: number
  depositBalance: number
  rewardBalance: number
  walletBalanceQuoteValue: number
  depositBalanceQuoteValue: number
}

const KingdomCard: React.FC<KingdomCardProps> = ({ walletBalance, depositBalance, rewardBalance, walletBalanceQuoteValue, depositBalanceQuoteValue }) => {
  const cakePrice = usePriceCakeBusd()
  const earningsBusd = rewardBalance ? new BigNumber(rewardBalance).multipliedBy(cakePrice).toNumber() : 0

  return (
    <KCard>
      <div className="k-card">
        <div className="flex-grid">
          <div className="col">
            <Flex justifyContent='space-between'>
              <Text>Balance</Text>
              <Values>
                <Balance
                  fontSize="16px"
                  value={walletBalance}
                  decimals={walletBalance ? 3 : 2}
                  unit=""
                />
                &nbsp;<Brackets>(</Brackets><CardBusdValue value={walletBalanceQuoteValue} /><Brackets>)</Brackets>
              </Values>
            </Flex>
          </div>
          <div className="col">
            <Flex justifyContent='space-between'>
              <Text>Deposit</Text>
              <Values>
                <Balance
                  fontSize="16px"
                  value={depositBalance}
                  decimals={depositBalance ? 3 : 2}
                  unit=""
                />
                &nbsp;<Brackets>(</Brackets><CardBusdValue value={depositBalanceQuoteValue} /><Brackets>)</Brackets>
              </Values>
            </Flex>
          </div>
          <div className="col">
            <Text>CUB Rewards</Text>
          </div>
        </div>
        <div className="flex-grid">
          <div className="col">
            <Input />
          </div>
          <div className="col">
            <Input />
          </div>
          <div className="col">
            <Balance
              fontSize="16px"
              value={rewardBalance}
              decimals={rewardBalance ? 3 : 2}
              unit=""
            />
            <CardBusdValue value={earningsBusd} />
          </div>
        </div>
        <div className="flex-grid">
          <div className="col">
            <Button mt="8px" fullWidth>Deposit</Button>
          </div>
          <div className="col">
            <Button mt="8px" fullWidth>Withdraw</Button>
          </div>
          <div className="col">
            <Button mt="8px" fullWidth variant="tertiary">Harvest</Button>
          </div>
        </div>
      </div>
    </KCard>
  )
}

export default KingdomCard
