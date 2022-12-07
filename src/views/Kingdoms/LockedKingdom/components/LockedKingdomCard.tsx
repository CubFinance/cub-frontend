import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useLocation} from 'react-router-dom'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import {useBusdPriceFromLpSymbol} from 'state/hooks'
import {Button as UiButton, Flex, Heading, Text, useModal} from '@pancakeswap-libs/uikit'
import {FarmWithStakedValue} from 'views/Farms/components/FarmCard/FarmCard'
import DepositModal from 'views/Farms/components/DepositModal'
import {useStakeLocked} from 'hooks/useStake'
import {useLockedUnstake} from 'hooks/useUnstake'
import {useApprove} from 'hooks/useApprove'
import {getBep20Contract, getLockedKingdomsContract} from 'utils/contractHelpers'
import {getAddress} from 'utils/addressHelpers'
import useWeb3 from 'hooks/useWeb3'

import './KingdomCard.css'
import {useCountUp} from "react-countup";
import useSWRImmutable from "swr/immutable";
import {format, formatDistanceToNow} from "date-fns";
import WithdrawModal from './WithdrawModal'
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
import WithdrawalFeeTimer from "./WithdrawalFeeTimer";
import useVaultApy from "../../../../hooks/useVaultApy";
import BurningCountDown from "../BurningCountdown";
import Message from "./Message";
import ExtendModal from "./ExtendModal";
import {convertLockedToFlexible} from "../../../../utils/callHelpers";
import {fetchFarmUserDataAsync} from "../../../../state/farms";
import {useAppDispatch} from "../../../../state";
import {DEFAULT_TOKEN_DECIMAL} from "../../../../config";
import useAvgLockDuration from "./useAvgLockDuration";

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

interface KingdomCardProps {
  farm: FarmWithStakedValue
  walletBalance: number
  depositBalance: number
  rewardBalance: number
  walletBalanceQuoteValue: number
  depositBalanceQuoteValue: number
  addLiquidityUrl: string
  account?: string
  cakePrice?: BigNumber
  aprApy?: any
  bnbDividends?: any
  cakeVaultEarnings?: any
}

const LockedKingdomCard: React.FC<KingdomCardProps> = ({
  farm,
  addLiquidityUrl,
  account,
  cakePrice,
    aprApy,
    cakeVaultEarnings,
}) => {
  const location = useLocation()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const {isTokenOnly, isKingdomToken, lpSymbol, lpAddresses, token: { address } } = farm

  const web3 = useWeb3()

  const poolVaultData = useMemo(() => {
    if (farm.lockedKingdomData) {
      return {
        totalShares: new BigNumber(farm.lockedKingdomData.totalShares),
        totalLockedAmount: new BigNumber(farm.lockedKingdomData.totalLockedAmount),
        pricePerFullShare: new BigNumber(farm.lockedKingdomData.pricePerFullShare),
        totalBalance: new BigNumber(farm.lockedKingdomData.totalBalance),
        fees: {
            withdrawalFee: new BigNumber(farm.lockedKingdomData.fees.withdrawalFee),
            withdrawalFeePeriod: new BigNumber(farm.lockedKingdomData.fees.withdrawalFeePeriod),
            performanceFee: new BigNumber(farm.lockedKingdomData.fees.performanceFee),
        }
      }
    }
    return null;
  }, [farm?.lockedKingdomData])

  const tokenName = lpSymbol.toUpperCase()
  const {
    tokenBalance: tokenBalanceAsString = 0,
    allowance: allowanceAsString = 0,
  } = farm.userData || {}

  const tokenBalance = new BigNumber(tokenBalanceAsString)

  const allowance = new BigNumber(allowanceAsString)

  const userDataAsBigNumbers = useMemo(() => {
    if (farm.userData.lockedKingdomUserData) {
        // const {} = farm.userData.lockedKingdomUserData
        return {
            shares: new BigNumber(farm.userData.lockedKingdomUserData.shares),
            lastDepositedTime: new BigNumber(farm.userData.lockedKingdomUserData.lastDepositedTime),
            tokenAtLastUserAction: new BigNumber(farm.userData.lockedKingdomUserData.tokenAtLastUserAction),
            lastUserActionTime: new BigNumber(farm.userData.lockedKingdomUserData.lastUserActionTime),
            lockStartTime: new BigNumber(farm.userData.lockedKingdomUserData.lockStartTime),
            lockEndTime: new BigNumber(farm.userData.lockedKingdomUserData.lockEndTime),
            userBoostedShare: new BigNumber(farm.userData.lockedKingdomUserData.userBoostedShare),
            locked: farm.userData.lockedKingdomUserData.locked,
            overdueFee: new BigNumber(farm.userData.lockedKingdomUserData.overdueFee),
            performanceFee: new BigNumber(farm.userData.lockedKingdomUserData.performanceFee),
        }
    }
    return null
  }, [farm.userData.lockedKingdomUserData]);

  // gets staked balance
  const stakedBalanceAsString = farm?.userData?.lockedKingdomUserData?.tokenAtLastUserAction;
  const stakedBalance = useMemo(() => new BigNumber(stakedBalanceAsString), [stakedBalanceAsString]);

  const stakedBalanceUSD = stakedBalance.multipliedBy(cakePrice);

  // stake is active?
  const isStakeActive = userDataAsBigNumbers?.shares.gt(0) || false;

  // stake is locked?
  const isStakeLocked = userDataAsBigNumbers?.lockEndTime.gte(new Date().getTime() / 1000) && (userDataAsBigNumbers?.lockEndTime.toNumber() !== 0) || false;

  // stake was originally locked? (used for determining if it will decay over time)
  const wasStakeLocked = userDataAsBigNumbers?.lockEndTime.gt(0) || false;

  const dispatch = useAppDispatch()

  const autoCakeToDisplay = cakeVaultEarnings?.autoCakeToDisplay || 0;
  const autoUsdToDisplay = cakeVaultEarnings?.autoUsdToDisplay || 0;

  const { onStakeLocked } = useStakeLocked()
  const onStake = (amount: string) => onStakeLocked(amount, 0);
  const { onUnstake } = useLockedUnstake(userDataAsBigNumbers?.shares.toString() || '0')

  const { lockedApy: maxLockedApy, getBoostFactor } = aprApy;

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const [onPresentMoreDepositLocked] = useModal(
      <DepositModalLocked isAddAdditional currentStartTime={userDataAsBigNumbers?.lockStartTime?.toNumber() || 0} currentEndTime={userDataAsBigNumbers?.lockEndTime?.toNumber() || 0} max={tokenBalance} onConfirm={onStakeLocked} tokenName={tokenName} addLiquidityUrl={addLiquidityUrl} isTokenOnly={isTokenOnly} isKingdomToken={isKingdomToken} />,
  )

  const convertToFlexible = () => {
      const lockedKingdomsContract = getLockedKingdomsContract(web3);

      convertLockedToFlexible(lockedKingdomsContract, account).then((response) => {
        dispatch(fetchFarmUserDataAsync(account))
        console.info(response);
      });
  };

  const existingStakeDuration = userDataAsBigNumbers?.lockEndTime?.minus(userDataAsBigNumbers?.lockStartTime).div(604800).toNumber() || 0;
  const existingStakeSecondsRemain = Math.max(userDataAsBigNumbers?.lockEndTime?.minus(new Date().getTime() / 1000).toNumber() || 0, 0);

  const [onPresentConvertToLocked] = useModal(
      <ExtendModal amount={stakedBalance.toString()} onConfirm={onStakeLocked} tokenName="CUB" addLiquidityUrl={addLiquidityUrl} title="Convert to Lock" />
  );

  const [onPresentExtend] = useModal(
      <ExtendModal amount={stakedBalance.toString()} existingStakeDuration={existingStakeDuration} existingStakeSecondsRemain={existingStakeSecondsRemain} onConfirm={onStakeLocked} tokenName="CUB" addLiquidityUrl={addLiquidityUrl} title="Extend" />
  );

  const [onPresentRenew] = useModal(
      <ExtendModal amount={autoCakeToDisplay.toString()} existingStakeDuration={existingStakeDuration} onConfirm={onStakeLocked} tokenName="CUB" addLiquidityUrl={addLiquidityUrl} title="Renew" />
  );

  const [onPresentFlexAdd] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onStake}  tokenName={tokenName} addLiquidityUrl={addLiquidityUrl} isTokenOnly={isTokenOnly} isKingdomToken={isKingdomToken} onConvertToLocked={onPresentConvertToLocked} showConvertToLocked maxLockedApy={maxLockedApy} />
  )

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onStake}  tokenName={tokenName} addLiquidityUrl={addLiquidityUrl} isTokenOnly={isTokenOnly} isKingdomToken={isKingdomToken} />,
  )
  const [onPresentDepositLocked] = useModal(
      <DepositModalLocked max={tokenBalance} onConfirm={onStakeLocked} tokenName={tokenName} addLiquidityUrl={addLiquidityUrl} isTokenOnly={isTokenOnly} isKingdomToken={isKingdomToken} />,
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal shares={userDataAsBigNumbers?.shares} performanceFee={userDataAsBigNumbers?.performanceFee.plus(userDataAsBigNumbers?.overdueFee).plus(userDataAsBigNumbers?.userBoostedShare)} hasWithdrawFee={userDataAsBigNumbers?.lastDepositedTime.lte(getEpochSecondsIn3Days())} pricePerFullShare={poolVaultData?.pricePerFullShare} onConfirm={onUnstake} tokenName={tokenName} isTokenOnly={isTokenOnly} isKingdomToken={isKingdomToken} />,
  )

  function getEpochSecondsIn3Days() {
    return Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3;
  }

  // returns {time: Date, isAfterBurning: boolean)
  function getAfterBurnTimeAndDate() {
    // end time + 1 week
    const time = new Date((userDataAsBigNumbers?.lockEndTime.multipliedBy(1000).toNumber() || 0) + 604800000);

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

  const countUp = <CounterUpper value={autoCakeToDisplay} />

  const countUp2 = <CounterUpper value={autoUsdToDisplay} />

  const stakedAmountCountUp = <CounterUpper value={stakedBalance.toNumber()} />

  const stakedAmountUSDCountUp = <CounterUpper value={stakedBalanceUSD.toNumber()} />

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
                      {/* button to add more locked deposit */}
                      <Button
                          mt="8px"
                          fullWidth
                          style={{width: "100%"}}
                          disabled={location.pathname.includes('archived')}
                          onClick={onPresentMoreDepositLocked}
                      >Add CUB</Button>
                    </ActionContent>
                </ActionContent>
              <ActionContent style={{flexDirection: "column", alignItems: "flex-end"}}>
                  <ActionTitles>
                    <Subtle style={{color: "lightgray"}}>UNLOCKS IN</Subtle>
                  </ActionTitles>
                  <Heading color="text" size="md" mb="8px">
                      {formatDistanceToNow(new Date((userDataAsBigNumbers?.lockEndTime?.toNumber() || 0) * 1000), { addSuffix: true }).replace(/^in /, "")} {/* questionmark tooltip here */}
                      <abbr title={`After Burning starts at ${format(new Date(((userDataAsBigNumbers?.lockEndTime?.toNumber() || 0) * 1000) + 604800000), 'MMM dd yyyy, HH:mm')}. You need to renew your fix-term position, to initiate a new lock or convert your staking position to flexible before it starts. Otherwise all the rewards will be burned within the next 90 days.`}>?</abbr>
                  </Heading>
                {/* show the date in <Text size 12px */}
                <Text fontSize="12px" color="textSubtle">On {format(new Date((userDataAsBigNumbers?.lockEndTime?.toNumber() || 0) * 1000), 'MMM dd yyyy, HH:mm')}</Text>

                {/* button to extend lock duration */}
                <Button
                    mt="8px"
                    fullWidth
                    disabled={location.pathname.includes('archived')}
                    onClick={onPresentExtend}
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
                  <abbr title={`After Burning starts at ${format(new Date(((userDataAsBigNumbers?.lockEndTime?.toNumber() || 0) * 1000) + 604800000), 'MMM dd yyyy, HH:mm')}. You need to renew your fix-term position, to initiate a new lock or convert your staking position to flexible before it starts. Otherwise all the rewards will be burned within the next 90 days.`}>?</abbr>
                </Heading>
                {/* show the date in <Text size 12px */}
                <Text fontSize="12px" color="textSubtle">On {format(new Date((userDataAsBigNumbers?.lockEndTime?.toNumber() || 0) * 1000), 'MMM dd yyyy, HH:mm')}</Text>
              </ActionContent>
              {afterBurnData.isAfterBurning ? <ActionContent style={{flexDirection: "column", alignItems: "flex-end"}}>
                    <ActionTitles>
                      <Subtle style={{color: "lightgray"}}>AFTER BURNING</Subtle>
                    </ActionTitles>
                    <Text color="failure" bold>
                      {userDataAsBigNumbers?.overdueFee?.toNumber() > 0 && cakeVaultEarnings?.autoCakeToDisplay > 0 ? `${userDataAsBigNumbers?.overdueFee?.div(DEFAULT_TOKEN_DECIMAL)?.toNumber().toFixed(3)} CUB Burned` : '-'}
                    </Text>
                  </ActionContent> :
                  <ActionContent style={{flexDirection: "column", alignItems: "flex-end"}}>
                <ActionTitles>
                  <Subtle style={{color: "lightgray"}}>AFTER BURNING IN</Subtle>
                </ActionTitles>
                <Heading color="failure" size="md" mb="8px">
                  <BurningCountDown lockEndTime={userDataAsBigNumbers?.lockEndTime?.toString() || "0"} />
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
                    onClick={onPresentWithdraw}
                >-</Button>
                <Button
                    mt="8px"
                    style={{backgroundColor: "transparent", border: "2px solid #F2F2F2", marginLeft: "10px"}}
                    disabled={location.pathname.includes('archived')}
                    onClick={onPresentFlexAdd}
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

  const durationSeconds = (userDataAsBigNumbers?.lockEndTime?.toNumber() || 0) - (userDataAsBigNumbers?.lockStartTime?.toNumber() || 0);
  const boostFactor = getBoostFactor(durationSeconds);
  const numWeeks = Math.floor(durationSeconds / 604800);

  const unstakeFreeSeconds = useMemo(() => getSecondsUntilFlexUnstakeIsFree(userDataAsBigNumbers, poolVaultData), [poolVaultData, userDataAsBigNumbers]);

  function renderLeftInnerPanelContent() {
    if (isStakeLocked || wasStakeLocked) {
      return <>
        <ActionContent style={{flexWrap: "wrap"}}>
          <ActionContent style={{flex: "50%"}}>
            <div>
          <ActionTitles>
            <Title>RECENT CUB PROFIT</Title>
          </ActionTitles>
             <Earned>{countUp}CUB</Earned>
            <Staked>~{countUp2}USD</Staked>
            </div>
          </ActionContent>
          <ActionContent style={{flex: "50%"}}>
              <div>
                <ActionTitles>
                    <Title>YIELD BOOST</Title>
                </ActionTitles>
                <ActionContent>
                  <div>
                    <Heading color="text" size="md">{new BigNumber(boostFactor.toString()).toFixed(3) || "0"}x</Heading>
                    <Text fontSize="12px" color="textSubtle">Lock for {numWeeks} week{numWeeks !== 1 ? "s" : ""}</Text>
                  </div>
                </ActionContent>
              </div>
          </ActionContent>
        </ActionContent>
      </>;
    }

    return <>
      <ActionTitles>
        <Title>RECENT CUB PROFIT</Title>
      </ActionTitles>
      <ActionContent style={{flexWrap: "wrap"}}>
        <div style={{width: "50%", flex: "50% 0 0"}}>
          <Earned>{countUp}CUB</Earned>
          <Staked>~{countUp2}USD</Staked>
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
    if (wasStakeLocked && !isStakeLocked) {
      return <Message
          style={{marginTop: "10px", flex: "100% 1 1"}}
          variant="warning"
          actionInline
          action={
            <Flex flexGrow={1} style={{justifyContent: "flex-end"}}>
              <Button
                  variant="primary"
                  onClick={onPresentRenew}
                  disabled={location.pathname.includes('archived')}
              >Renew
              </Button>
              <Button
                  variant="secondary"
                  style={{marginLeft: "10px"}}
                  onClick={convertToFlexible}
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

    if (isStakeActive && !isStakeLocked) {
      return <Message
          style={{marginTop: "10px", flex: "100% 1 1"}}
          variant="warning"
          actionInline
          action={
            <Flex flexGrow={1} style={{justifyContent: "flex-end"}}>
              <Button
                variant="primary"
                onClick={onPresentConvertToLocked}
                disabled={location.pathname.includes('archived')}
              >Convert to Lock
              </Button>
            </Flex>
          }
      >
        <Text>
          Lock staking users are earning up to {new BigNumber(maxLockedApy).toFixed(2)}% APY.
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
    {renderBottomPanelContent()}
  </>)
}

function CounterUpper({value}) {
  const { countUp: cUp, update: uD } = useCountUp({
    start: 0,
    end: value,
    duration: 1,
    separator: ',',
    decimals: 3,
  });

  const updateValue = useRef(uD);

  useEffect(() => {
    updateValue.current(value);
  });

  return <>{cUp}</>;
}

function getSecondsUntilFlexUnstakeIsFree(userDataBigNumber, poolVaultData) {
  // userdata.lastDepositedTime is the last deposit time in seconds
  // fees.withdrawalFeePeriod is the time in seconds that the user must wait before they can unstake without the 0.1% fee
  // return number of seconds until the user can unstake without the 0.1% fee, if it is less than 0, return 0

  if (userDataBigNumber?.lastDepositedTime) {
    const secondsUntilFree = userDataBigNumber?.lastDepositedTime.plus(poolVaultData?.fees?.withdrawalFeePeriod || 0).minus(Math.floor(new Date().getTime() / 1000));
    return secondsUntilFree.toNumber() > 0 ? secondsUntilFree.toNumber() : 0;
  }

  return 0;
}

export default LockedKingdomCard
