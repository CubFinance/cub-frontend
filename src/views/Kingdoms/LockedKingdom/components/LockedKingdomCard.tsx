import React, { useState, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useBusdPriceFromLpSymbol } from 'state/hooks'
import { Flex, Text, Button as UiButton, useModal } from '@pancakeswap-libs/uikit'
import Balance from 'components/Balance'
import CardBusdValue from 'views/Home/components/CardBusdValue'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import DepositModal from 'views/Farms/components/DepositModal'
import WithdrawModal from 'views/Farms/components/WithdrawModal'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import { useHarvest } from 'hooks/useHarvest'
import { useApprove } from 'hooks/useApprove'
import { useClaim} from 'hooks/useClaim'
import {getBep20Contract, getLockedKingdomsContract} from 'utils/contractHelpers'
import { getAddress } from 'utils/addressHelpers'
import useWeb3 from 'hooks/useWeb3'
import { DEFAULT_TOKEN_DECIMAL } from 'config'

import './KingdomCard.css'

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

interface KingdomCardProps {
  farm?: FarmWithStakedValue
  walletBalance: number
  depositBalance: number
  rewardBalance: number
  walletBalanceQuoteValue: number
  depositBalanceQuoteValue: number
  addLiquidityUrl: string
  account?: string
  cakePrice?: BigNumber
  bnbDividends?: any
}

const LockedKingdomCard: React.FC<KingdomCardProps> = ({
  farm,
  walletBalance,
  depositBalance,
  rewardBalance,
  walletBalanceQuoteValue,
  depositBalanceQuoteValue ,
  addLiquidityUrl,
  account,
  cakePrice,
  bnbDividends,
}) => {
  const location = useLocation()
  const bnbPrice = useBusdPriceFromLpSymbol('BNB-BUSD LP')
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const [pendingTxDivs, setPendingTxDivs] = useState(false)
  const { pid, isTokenOnly, isKingdom, isKingdomToken, lpSymbol, lpAddresses, token: { address } } = farm

  const tokenName = lpSymbol.toUpperCase()
  const {
    allowance: allowanceAsString = 0,
    tokenBalance: tokenBalanceAsString = 0,
    stakedBalance: stakedBalanceAsString = 0,
  } = farm.userData || {}
  const allowance = new BigNumber(allowanceAsString)
  const tokenBalance = new BigNumber(tokenBalanceAsString)
  const stakedBalance = new BigNumber(stakedBalanceAsString)
  // const cakePrice = usePriceCakeBusd()
  const earningsBusd = rewardBalance ? new BigNumber(rewardBalance).multipliedBy(cakePrice).toNumber() : 0

  const web3 = useWeb3()
  const { onStake } = useStake(pid, isKingdom)
  const { onUnstake } = useUnstake(pid, isKingdom)
  const { onReward } = useHarvest(pid, isKingdom)
  const { onClaim } = useClaim(bnbDividends || {})

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onStake} tokenName={tokenName} addLiquidityUrl={addLiquidityUrl} isTokenOnly={isTokenOnly} isKingdomToken={isKingdomToken} />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} isTokenOnly={isTokenOnly} isKingdomToken={isKingdomToken} />,
  )

  const lpAddress = getAddress(lpAddresses)
  const tokenAddress = getAddress(address)
  const lpContract = useMemo(() => {
    if(isTokenOnly || isKingdomToken){
      return getBep20Contract(tokenAddress, web3)
    }
    return getBep20Contract(lpAddress, web3)
  }, [lpAddress, isTokenOnly, web3, tokenAddress, isKingdomToken])

  const { onApprove } = useApprove(lpContract, false, true)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  const approvedButton = (
    <Button
      mt="8px"
      disabled={requestedApproval || location.pathname.includes('archived')}
      onClick={handleApprove}
    >
      Approve Contract
    </Button>
  )

  const bnbRewards = bnbDividends && bnbDividends.amount ? new BigNumber(bnbDividends.amount).div(DEFAULT_TOKEN_DECIMAL).toNumber() : 0
  const bnbRewardsUSD = bnbRewards ? new BigNumber(bnbRewards).multipliedBy(bnbPrice).toNumber() : 0

  let harvestSection = null
  if (farm.lpSymbol === 'CUB') {
    harvestSection = (
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
          onClick={async () => {
            setPendingTxDivs(true)
            await onClaim()
            setPendingTxDivs(false)
          }}
        >
          Claim
        </Button>
      </>
    )
  } else {
    harvestSection = (
      <>
        <Text>CUB Rewards</Text>
        <Values>
          <Balance
            fontSize="16px"
            value={rewardBalance}
            decimals={rewardBalance ? 3 : 2}
            unit=""
          />
          &nbsp;<Brackets>(</Brackets><CardBusdValue value={earningsBusd} /><Brackets>)</Brackets>
        </Values>
        <Button
          disabled={rewardBalance === 0 || pendingTx || !isApproved}
          onClick={async () => {
            setPendingTx(true)
            await onReward()
            setPendingTx(false)
          }}
        >
          Harvest
        </Button>
      </>
    )
  }

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
              <Button mt="8px" fullWidth onClick={onPresentDeposit}>Deposit</Button>
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
              <Button mt="8px" fullWidth onClick={onPresentWithdraw}>Withdraw</Button>
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

export default LockedKingdomCard
