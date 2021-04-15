import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Input, Button as UiButton } from '@pancakeswap-libs/uikit'
// import Input, { InputProps } from 'components/Input'
import './KingdomCard.css'

const KCard = styled.div`
  align-self: baseline;
  background: ${(props) => props.theme.card.background};
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);
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
`

const KingdomCard: React.FC = () => {

  return (
    <KCard>
      <div className="k-card">
        <div className="flex-grid">
          <div className="col">
            <Flex justifyContent='space-between'>
              <Text>Balance</Text>
              <Text>– ($–)</Text>
            </Flex>
          </div>
          <div className="col">
            <Flex justifyContent='space-between'>
              <Text>Deposit</Text>
              <Text>– ($–)</Text>
            </Flex>
          </div>
          <div className="col">
            <Text>AUTO Rewards</Text>
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
            <div>–</div>
            <div>$–</div>
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
