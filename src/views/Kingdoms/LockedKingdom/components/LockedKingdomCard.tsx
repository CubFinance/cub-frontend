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
import useStake, {useStakeLocked} from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import { useHarvest } from 'hooks/useHarvest'
import { useApprove } from 'hooks/useApprove'
import { useClaim} from 'hooks/useClaim'
import {getBep20Contract, getLockedKingdomsContract} from 'utils/contractHelpers'
import { getAddress } from 'utils/addressHelpers'
import useWeb3 from 'hooks/useWeb3'
import { DEFAULT_TOKEN_DECIMAL } from 'config'

import './KingdomCard.css'
import {useCountUp} from "react-countup";
import {
  ActionContainer,
  ActionContent,
  ActionTitles,
  Earned,
  Staked,
  Subtle,
  Title
} from "../../../Farms/components/FarmTable/Actions/styles";
import DepositModalLocked from "../../../Farms/components/DepositModalLocked";

const Detail = styled.div`
  /*display: inline;
  margin-right: 1rem;*/
  /*& div {
    font-family: Arial;
    font-size: 0.8rem;
    padding: 2px;
  }*/
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
  // TODO: needs to be changed for the locked kingdoms contract
  const { onStakeLocked } = useStakeLocked()
  const onStake = (amount: string) => onStakeLocked(amount, 0);
  const { onUnstake } = useUnstake(pid, isKingdom)
  const { onReward } = useHarvest(pid, isKingdom)
  const { onClaim } = useClaim(bnbDividends || {})

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onStake} tokenName={tokenName} addLiquidityUrl={addLiquidityUrl} isTokenOnly={isTokenOnly} isKingdomToken={isKingdomToken} />,
  )
  const [onPresentDepositLocked] = useModal(
      <DepositModalLocked max={tokenBalance} onConfirm={onStakeLocked} tokenName={tokenName} addLiquidityUrl={addLiquidityUrl} isTokenOnly={isTokenOnly} isKingdomToken={isKingdomToken} />,
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

  const approveButton = (
    <Button
      mt="8px"
      fullWidth
      disabled={requestedApproval || location.pathname.includes('archived')}
      onClick={handleApprove}
    >
      Approve Contract
    </Button>
  )

  const { countUp } = useCountUp({
    start: 0,
    end: earningsBusd,
    duration: 1,
    separator: ',',
    decimals: 3,
  })

  return (<>
          <Detail style={{flex: "40%"}}>
            <ActionContainer>
              <ActionTitles>
                <Title>RECENT CUB PROFIT</Title>
              </ActionTitles>
              <ActionContent>
                <div style={{width: "50%", flex: "50% 0 0"}}>
                  <Earned>0</Earned>
                  <Staked>{countUp}USD</Staked>
                </div>
                {isApproved ? <Button
                    disabled={pendingTx}
                    onClick={async () => {
                      setPendingTx(true)
                      // await onReward()
                      setPendingTx(false)
                    }}
                    ml="4px"
                >
                  Harvest
                </Button> : <Text>0.1% unstaking fee if withdrawn within 72h</Text>}
              </ActionContent>
            </ActionContainer>
          </Detail>
          <Detail style={{flex: "40%"}}>
            <ActionContainer style={{maxHeight: "150px", marginBottom: "10px"}}>
              <ActionTitles>
                <Title>STAKE </Title>
                <Subtle>CUB</Subtle>
              </ActionTitles>
              <ActionContent style={{flexWrap: "wrap"}}>
                {isApproved ? <>
                  <Button mt="8px" fullWidth onClick={onPresentDeposit}>Flexible</Button>
                  <div style={{width: "10%"}} />
                  <Button mt="8px" fullWidth onClick={onPresentDepositLocked}>Locked</Button>
                </> : approveButton}
                {isApproved ? <div style={{width: "100%", flex: "100% 0 0"}}>
                  <Text><abbr title="Flexible staking offers flexibility for staking/unstaking whenever you want. Locked staking offers higher APY as well as other benefits.">What&apos;s the difference?</abbr></Text>
                </div> : null}
              </ActionContent>
            </ActionContainer>
          </Detail>
          <div className="col" />
  </>)
}

export default LockedKingdomCard
