import React, {useCallback, useMemo, useState} from 'react'
import {useLocation} from 'react-router-dom'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import {useBusdPriceFromLpSymbol} from 'state/hooks'
import {Button as UiButton, Flex, Heading, Text, useModal} from '@pancakeswap-libs/uikit'
import {FarmWithStakedValue} from 'views/Farms/components/FarmCard/FarmCard'
import DepositModal from 'views/Farms/components/DepositModal'
import WithdrawModal from 'views/Farms/components/WithdrawModal'
import {useStakeLocked} from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import {useHarvest} from 'hooks/useHarvest'
import {useApprove} from 'hooks/useApprove'
import {useClaim} from 'hooks/useClaim'
import {getBep20Contract, getLockedKingdomsContract} from 'utils/contractHelpers'
import {getAddress} from 'utils/addressHelpers'
import useWeb3 from 'hooks/useWeb3'

import './KingdomCard.css'
import {useCountUp} from "react-countup";
import useSWRImmutable from "swr/immutable";
import {format, formatDistanceToNow} from "date-fns";
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
import {getCakeVaultEarnings} from "../helpers";
import {useSWRImmutableFetchPoolVaultData} from "../poolHelpers";
import {DEFAULT_TOKEN_DECIMAL} from "../../../../config";
import {BIG_TEN} from "../../../../utils/bigNumber";
import WithdrawalFeeTimer from "./WithdrawalFeeTimer";
import useVaultApy from "../../../../hooks/useVaultApy";
import BurningCountDown from "../BurningCountdown";
import Message from "./Message";

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

  const {data: poolVaultData} = useSWRImmutableFetchPoolVaultData(account);

  const tokenName = lpSymbol.toUpperCase()
  const {
    allowance: allowanceAsString = 0,
    tokenBalance: tokenBalanceAsString = 0,
  } = farm.userData || {}
  const allowance = new BigNumber(allowanceAsString)
  const tokenBalance = new BigNumber(tokenBalanceAsString)

  // gets staked balance
  const stakedBalanceAsString = poolVaultData?.userData?.tokenAtLastUserAction || 0;
  const stakedBalance = new BigNumber(stakedBalanceAsString)

  const stakedBalanceUSD = stakedBalance.multipliedBy(cakePrice);

  // stake is active?
  const isStakeActive = poolVaultData?.userData?.shares.gt(0) || false;

  // stake is locked?
  const isStakeLocked = poolVaultData?.userData?.lockEndTime.lte(new Date().getTime() / 1000) && (poolVaultData?.userData?.lockEndTime.toNumber() !== 0) || false;

  // stake was originally locked? (used for determining if it will decay over time)
  const wasStakeLocked = poolVaultData?.userData?.lockEndTime.gt(0) || false;

  // useswrimmutable to getCakeVaultEarnings from chain data called "chain-balance-locked-cub"
  const { data } = useSWRImmutable("chain-balance-locked-cub", async () => {
    return {earnings: poolVaultData ? getCakeVaultEarnings(account, poolVaultData.userData.tokenAtLastUserAction, poolVaultData.userData.shares, poolVaultData.pricePerFullShare, cakePrice.toNumber(), poolVaultData.fees.performanceFee) : null, user: poolVaultData?.userData};
  });

  const autoCakeToDisplay = data?.earnings?.autoCakeToDisplay || 0;
  const autoUsdToDisplay = data?.earnings?.autoUsdToDisplay || 0;

  const web3 = useWeb3()
  // TODO: needs to be changed for the locked kingdoms contract
  const { onStakeLocked } = useStakeLocked()
  const onStake = (amount: string) => onStakeLocked(amount, 0);
  const { onUnstake } = useUnstake(pid, isKingdom)
  const { onReward } = useHarvest(pid, isKingdom)
  const { onClaim } = useClaim(bnbDividends || {})

  const { lockedApy: maxLockedApy } = useVaultApy({duration: 52 * 7 * 24 * 60 * 60});

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const [onPresentMoreDepositLocked] = useModal(
      <DepositModalLocked isAddAdditional currentStartTime={poolVaultData?.userData?.lockStartTime?.toNumber() || 0} currentEndTime={poolVaultData?.userData?.lockEndTime?.toNumber() || 0} max={tokenBalance} onConfirm={onStakeLocked} tokenName={tokenName} addLiquidityUrl={addLiquidityUrl} isTokenOnly={isTokenOnly} isKingdomToken={isKingdomToken} />,
  )

  const onPresentConvertToLocked = () => null;

  const [onPresentFlexAdd] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onStake}  tokenName={tokenName} addLiquidityUrl={addLiquidityUrl} isTokenOnly={isTokenOnly} isKingdomToken={isKingdomToken} onConvertToLocked={onPresentConvertToLocked} showConvertToLocked maxLockedApy={maxLockedApy} />
  )

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onStake}  tokenName={tokenName} addLiquidityUrl={addLiquidityUrl} isTokenOnly={isTokenOnly} isKingdomToken={isKingdomToken} />,
  )
  const [onPresentDepositLocked] = useModal(
      <DepositModalLocked max={tokenBalance} onConfirm={onStakeLocked} tokenName={tokenName} addLiquidityUrl={addLiquidityUrl} isTokenOnly={isTokenOnly} isKingdomToken={isKingdomToken} />,
  )

  // todo: look at this to see if it uses the locked kingdoms contract
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} isTokenOnly={isTokenOnly} isKingdomToken={isKingdomToken} />,
  )

  // returns {time: Date, isAfterBurning: boolean)
  function getAfterBurnTimeAndDate() {
    // end time + 1 week
    const time = new Date((poolVaultData?.userData?.lockEndTime.multipliedBy(1000).toNumber() || 0) + 604800000);

    const isAfterBurning = time.getTime() < new Date().getTime();

    return {time, isAfterBurning};
  }

  const afterBurnData = getAfterBurnTimeAndDate();

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
    end: autoUsdToDisplay,
    duration: 1,
    separator: ',',
    decimals: 3,
  })

  const { countUp: countUp2 } = useCountUp({
    start: 0,
    end: autoCakeToDisplay,
    duration: 1,
    separator: ',',
    decimals: 3,
  });

  const { countUp: stakedAmountCountUp } = useCountUp({
    start: 0,
    end: stakedBalance.toNumber(),
    duration: 1,
    separator: ',',
    decimals: 3,
  });

  const { countUp: stakedAmountUSDCountUp } = useCountUp({
    start: 0,
    end: stakedBalanceUSD.toNumber(),
    duration: 1,
    separator: ',',
    decimals: 3,
  });

  function getSecondsUntilFlexUnstakeIsFree() {
    // userdata.lastDepositedTime is the last deposit time in seconds
    // fees.withdrawalFeePeriod is the time in seconds that the user must wait before they can unstake without the 0.1% fee
    // return number of seconds until the user can unstake without the 0.1% fee, if it is less than 0, return 0

    if (poolVaultData?.userData?.lastDepositedTime) {
        const secondsUntilFree = poolVaultData?.userData?.lastDepositedTime.plus(poolVaultData?.fees?.withdrawalFeePeriod || 0).minus(Math.floor(new Date().getTime() / 1000));
        return secondsUntilFree.toNumber() > 0 ? secondsUntilFree.toNumber() : 0;
    }

    return 0;
  }

  function renderRightInnerPanelContent() {
    if (isApproved) {
      if (isStakeActive) {
        if (isStakeLocked) {
          // stake is locked and it is currently locked
          return <>
            <ActionContent style={{flexWrap: "wrap"}}>
                <ActionContent style={{flexDirection: "column", alignItems: "flex-start"}}>
                    <ActionTitles>
                        <Title>CUB </Title>
                        <Subtle>LOCKED</Subtle>
                    </ActionTitles>
                    <ActionContent style={{display: "block"}}>
                          <Heading color="text" size="md">{stakedAmountCountUp}</Heading>
                          <Text fontSize="12px" color="textSubtle">~{stakedAmountUSDCountUp} USD</Text>
                      {/* button to extend lock duration */}
                      <Button
                          mt="8px"
                          fullWidth
                          style={{width: "100%"}}
                          disabled={location.pathname.includes('archived')}
                          onClick={() => null} /* TODO: add onclick function for extending lock */
                      >Add CUB</Button>
                    </ActionContent>
                </ActionContent>
              <ActionContent style={{flexDirection: "column", alignItems: "flex-end"}}>
                  <ActionTitles>
                    <Subtle style={{color: "lightgray"}}>UNLOCKS IN</Subtle>
                  </ActionTitles>
                  <Heading color="text" size="md" mb="8px">
                      {formatDistanceToNow(new Date((poolVaultData?.userData?.lockEndTime?.toNumber() || 0) * 1000), { addSuffix: true })} {/* questionmark tooltip here */}
                      <abbr title={`After Burning starts at ${format(new Date(((poolVaultData?.userData?.lockEndTime?.toNumber() || 0) * 1000) + 604800000), 'MMM dd yyyy, HH:mm')}. You need to renew your fix-term position, to initiate a new lock or convert your staking position to flexible before it starts. Otherwise all the rewards will be burned within the next 90 days.`}>?</abbr>
                  </Heading>
                {/* show the date in <Text size 12px */}
                <Text fontSize="12px" color="textSubtle">On {format(new Date((poolVaultData?.userData?.lockEndTime?.toNumber() || 0) * 1000), 'MMM dd yyyy, HH:mm')}</Text>

                {/* button to extend lock duration */}
                <Button
                    mt="8px"
                    fullWidth
                    disabled={location.pathname.includes('archived')}
                    onClick={() => null} /* TODO: add onclick function for extending lock */
                >Extend</Button>
              </ActionContent>
            </ActionContent>
            </>;
        }

        if (wasStakeLocked) {
          // stake was locked but now it is unlocked
          return <>
            <ActionContent style={{flexWrap: "wrap"}}>
              <ActionContent style={{flexDirection: "column", alignItems: "flex-start"}}>
                <ActionTitles>
                  <Title>CUB </Title>
                  <Subtle>LOCKED</Subtle>
                </ActionTitles>
                <ActionContent style={{display: "block"}}>
                  <Heading color="text" size="md">{stakedAmountCountUp}</Heading>
                  <Text fontSize="12px" color="textSubtle">~{stakedAmountUSDCountUp} USD</Text>
                </ActionContent>
              </ActionContent>
              <ActionContent style={{flexDirection: "column", alignItems: "flex-end"}}>
                <ActionTitles>
                  <Subtle style={{color: "lightgray"}}>UNLOCKS IN</Subtle>
                </ActionTitles>
                <Heading color="warning" size="md">
                  Unlocked&nbsp;
                  <abbr title={`After Burning starts at ${format(new Date(((poolVaultData?.userData?.lockEndTime?.toNumber() || 0) * 1000) + 604800000), 'MMM dd yyyy, HH:mm')}. You need to renew your fix-term position, to initiate a new lock or convert your staking position to flexible before it starts. Otherwise all the rewards will be burned within the next 90 days.`}>?</abbr>
                </Heading>
                {/* show the date in <Text size 12px */}
                <Text fontSize="12px" color="textSubtle">On {format(new Date((poolVaultData?.userData?.lockEndTime?.toNumber() || 0) * 1000), 'MMM dd yyyy, HH:mm')}</Text>
              </ActionContent>
              {afterBurnData.isAfterBurning ? <ActionContent style={{flexDirection: "column", alignItems: "flex-end"}}>
                    <ActionTitles>
                      <Subtle style={{color: "lightgray"}}>AFTER BURNING</Subtle>
                    </ActionTitles>
                    <Text color="failure" bold>
                      {poolVaultData?.userData?.overdueFee?.toNumber() > 0 ? `${poolVaultData?.userData?.overdueFee?.toNumber().toFixed(2)}%` : '-'}
                    </Text>
                  </ActionContent> :
                  <ActionContent style={{flexDirection: "column", alignItems: "flex-end"}}>
                <ActionTitles>
                  <Subtle style={{color: "lightgray"}}>AFTER BURNING IN</Subtle>
                </ActionTitles>
                <Heading color="failure" size="md" mb="8px">
                  <BurningCountDown lockEndTime={poolVaultData?.userData?.lockEndTime?.toString() || "0"} />
                </Heading>
              </ActionContent>}
            </ActionContent>
          </>;
        }

        // stake is flexible and active

        // left side:
        // CUB STAKED heading
        // CUB staked amount
        // CUB staked amount in USD

        // right side:
        // + button to flex stake more
        // - button to flex stake less

        return <>
            <ActionContent style={{flexWrap: "wrap"}}>
                <ActionContent style={{flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start"}}>
                    <ActionTitles style={{flex: "100%"}}>
                        <Title>CUB </Title>
                        <Subtle>STAKED</Subtle>
                    </ActionTitles>
                    <ActionContent style={{display: "flex"}}>
                      <div style={{display: "block"}}>
                            <Heading color="text" size="md">{stakedAmountCountUp}</Heading>
                            <Text fontSize="12px" color="textSubtle">~{stakedAmountUSDCountUp} USD</Text>
                      </div>
                    </ActionContent>
                </ActionContent>
              <ActionContent style={{alignSelf: "flex-end"}}>
                <Button
                    mt="8px"
                    style={{backgroundColor: "transparent", border: "2px solid #F2F2F2"}}
                    disabled={location.pathname.includes('archived')}
                    onClick={() => null} /* TODO: add onclick function for flex stake less */
                >-</Button>
                <Button
                    mt="8px"
                    style={{backgroundColor: "transparent", border: "2px solid #F2F2F2", marginLeft: "10px"}}
                    disabled={location.pathname.includes('archived')}
                    onClick={() => null} /* TODO: add onclick function for flex stake more */
                >+</Button>
              </ActionContent>
            </ActionContent>
        </>;
      }

      // stake is inactive
      return <>
        <ActionTitles>
          <Title>STAKE </Title>
          <Subtle>CUB</Subtle>
        </ActionTitles>
        <ActionContent style={{flexWrap: "wrap"}}>
          <Button mt="8px" fullWidth onClick={onPresentDeposit}>Flexible</Button>
          <div style={{width: "10%"}} />
          <Button mt="8px" fullWidth onClick={onPresentDepositLocked}>Locked</Button>
          <div style={{width: "100%", flex: "100% 0 0"}}>
            <Text><abbr title="Flexible staking offers flexibility for staking/unstaking whenever you want. Locked staking offers higher APY as well as other benefits.">What&apos;s the difference?</abbr></Text>
          </div>
        </ActionContent>
      </>;
    }

    // isn't approved yet
    return <>
        <ActionTitles>
          <Title>ENABLE </Title>
          <Subtle>POOL</Subtle>
        </ActionTitles>
        <ActionContent>
          {approveButton}
        </ActionContent>
      </>;
    }

  const durationSeconds = (poolVaultData?.userData?.lockEndTime?.toNumber() || 0) - (poolVaultData?.userData?.lockStartTime?.toNumber() || 0);
  const { boostFactor, getLockedApy } = useVaultApy({duration: durationSeconds});
  const numWeeks = Math.floor(durationSeconds / 604800);

  function renderLeftInnerPanelContent() {
    if (isStakeLocked || wasStakeLocked) {
      return <>
        <ActionContent style={{flexWrap: "wrap"}}>
          <ActionContent style={{flex: "50%"}}>
            <div>
          <ActionTitles>
            <Title>RECENT CUB PROFIT</Title>
          </ActionTitles>
             <Earned>{countUp2}CUB</Earned>
            <Staked>~{countUp}USD</Staked>
            </div>
          </ActionContent>
          <ActionContent style={{flex: "50%"}}>
              <div>
                <ActionTitles>
                    <Title>YIELD BOOST</Title>
                </ActionTitles>
                <ActionContent>
                  <div>
                    <Heading color="text" size="md">{boostFactor.toString() || "0"}x</Heading>
                    <Text fontSize="12px" color="textSubtle">Lock for {numWeeks} week{numWeeks !== 1 ? "s" : ""}</Text>
                  </div>
                </ActionContent>
              </div>
          </ActionContent>
        </ActionContent>
      </>;
    }


    const unstakeFreeSeconds = getSecondsUntilFlexUnstakeIsFree();

    return <>
      <ActionTitles>
        <Title>RECENT CUB PROFIT</Title>
      </ActionTitles>
      <ActionContent style={{flexWrap: "wrap"}}>
        <div style={{width: "50%", flex: "50% 0 0"}}>
          <Earned>{countUp2}CUB</Earned>
          <Staked>~{countUp}USD</Staked>
        </div>
        <div style={{width: "50%", flex: "50% 0 0"}}>
          {unstakeFreeSeconds === 0 && isStakeActive ? <Text>No unstaking fee</Text> :
          <>
            <Text>0.1% unstaking fee {!isStakeActive ? "if withdrawn within 72h" : "before"}</Text>
            {isStakeActive ? <WithdrawalFeeTimer secondsRemaining={unstakeFreeSeconds} /> : null}
          </>}
        </div>
      </ActionContent>
    </>
  }

  function renderBottomPanelContent() {
    if (wasStakeLocked) {
      return <Message
          variant="warning"
          actionInline
          action={
            <Flex flexGrow={1} style={{justifyContent: "flex-end"}}>
              {/* todo: add button action functions here */}
              <Button
                  variant="primary"
                  onClick={onPresentWithdraw}
                  disabled={location.pathname.includes('archived')}
              >Renew
              </Button>
              <Button
                  variant="secondary"
                  style={{marginLeft: "10px"}}
                  onClick={onPresentWithdraw}
                  disabled={location.pathname.includes('archived')}
              >Convert To Flexible
              </Button>
            </Flex>
          }
      >
        <Text>
          Renew your staking position to continue earning CUB rewards.
        </Text>
      </Message>;
    }

    if (isStakeActive) {
      return <Message
          variant="warning"
          actionInline
          action={
            <Flex flexGrow={1} style={{justifyContent: "flex-end"}}>
              <Button
                variant="primary"
                onClick={onPresentWithdraw}
                disabled={location.pathname.includes('archived')}
              >Convert to Lock
              </Button>
            </Flex>
          }
      >
        <Text>
          Lock staking users are earning up to {getLockedApy(31449600)}% APY.
        </Text>
      </Message>;
    }

    return null;
  }

  return (<>
          <Detail style={{flex: "40%"}}>
            <ActionContainer>
              {renderLeftInnerPanelContent()}
            </ActionContainer>
          </Detail>
          <Detail style={{flex: "40%"}}>
            <ActionContainer style={{maxHeight: "150px", marginBottom: "10px"}}>
              {renderRightInnerPanelContent()}
            </ActionContainer>
          </Detail>
          <div className="col" />
    {renderBottomPanelContent() /* todo: fix the layout of this */}
  </>)
}

export default LockedKingdomCard
