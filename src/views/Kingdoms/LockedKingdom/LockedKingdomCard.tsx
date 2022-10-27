import React, { useState, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useBusdPriceFromLpSymbol } from 'state/hooks'
import { Flex, Text, Button as UiButton, useModal } from '@pancakeswap-libs/uikit'
import Balance from 'components/Balance'
import CardBusdValue from 'views/Home/components/CardBusdValue'

import '../components/KingdomCard.css'

const KCard = styled.div`
  align-self: baseline;
  /*background: ${(props) => props.theme.card.background};
  border-radius: 8px;
  box-shadow: 0 3px 4px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);*/
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  /*padding: 6px 12px;*/
  position: relative;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`

const Button = styled(UiButton)`
  height: 40px;
  margin-top: 0.3rem;
  display: block;
`

const Values = styled.div`
  display: flex;
`

const Brackets = styled.span`
  color: ${(props) => props.theme.colors.text};
`

// props
interface LockedKingdomCardProps {
    stakedOnly?: boolean;
}

const KingdomCard: React.FC<LockedKingdomCardProps> = ({stakedOnly = false,}) => {
    const location = useLocation()
    const bnbPrice = useBusdPriceFromLpSymbol('BNB-BUSD LP')
    const [requestedApproval, setRequestedApproval] = useState(false)
    const [pendingTx, setPendingTx] = useState(false)
    const [pendingTxDivs, setPendingTxDivs] = useState(false)

    const bnbRewards = 0;
    const bnbRewardsUSD = 0;
    const isApproved = false;
    const walletBalance = 0;
    const walletBalanceQuoteValue = 0;
    const depositBalanceQuoteValue = 0;
    const depositBalance = 0;

    const approvedButton = (
        <Button
            mt="8px"
            disabled={requestedApproval || location.pathname.includes('archived')}
        >
            Approve Contract
        </Button>
    )

    const harvestSection = (
            <>
                <Text>BNB Dividends</Text>
        <Values>
        <Balance
            fontSize="16px"
        value={bnbRewards}
        decimals={bnbRewards ? 3 : 2}
        unit=""
            />
            &nbsp;<Brackets>(</Brackets><CardBusdValue value={bnbRewardsUSD} /><Brackets>)</Brackets>
        </Values>
        <Button
        disabled={bnbRewards === 0 || pendingTxDivs || !isApproved}
    >
        Claim
        </Button>
        </>
    )

    return (
        <KCard>
            <div className="k-card">
        <div className="flex-grid">
        <div className="col">
        <Flex justifyContent='space-between'>
        <Text>Balance (Wallet)</Text>
        </Flex>
        <Values>
        <Balance
            fontSize="16px"
    value={walletBalance}
    decimals={walletBalance ? 3 : 2}
    unit=""
        />
        &nbsp;<Brackets>(</Brackets><CardBusdValue value={walletBalanceQuoteValue} /><Brackets>)</Brackets>
    </Values>
    { isApproved ? (
        <Button mt="8px" fullWidth>Deposit</Button>
    ) : (
        approvedButton
    )}
    </div>
    <div className="col">
    <Flex justifyContent='space-between'>
    <Text>Deposit (Staked)</Text>
    </Flex>
    <Values>
    <Balance
        fontSize="16px"
    value={depositBalance}
    decimals={depositBalance ? 3 : 2}
    unit=""
        />
        &nbsp;<Brackets>(</Brackets><CardBusdValue value={depositBalanceQuoteValue} /><Brackets>)</Brackets>
    </Values>
    { isApproved ? (
        <Button mt="8px" fullWidth>Withdraw</Button>
    ) : (
        approvedButton
    )}
    </div>
    <div className="col">
        {harvestSection}
        </div>
        </div>
        </div>
        </KCard>
)
}

export default KingdomCard