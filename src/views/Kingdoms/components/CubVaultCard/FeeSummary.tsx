import { Text, Flex, useTooltip } from '@pancakeswap-libs/uikit'
import React, {useEffect} from 'react'
import KingdomLockedABI from 'config/abi/KingdomsLocked.json'
import {useWeb3React} from "@web3-react/core";
import {secondsToDay} from "./timeHelper";
import {getHasWithdrawFee} from "./useWithdrawalFeeTimer";
import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'
import multicall from "../../../../utils/multicall";

class VaultKey {
}

interface FeeSummaryProps {
  stakingTokenSymbol: string
  stakeAmount: string
  vaultKey: VaultKey
}

function getVaultLockedAddress() {
    return "0x08bea2702d89abb8059853d654d0838c5e06fe0b";
}

async function useVaultPoolByKey(account: string) {
    const mCalls = [
        {
            address: getVaultLockedAddress(),
            name: 'withdrawFeePeriod',
        },
        {
            address: getVaultLockedAddress(),
            name: 'userInfo',
            params: [account],
        },
        {
            address: getVaultLockedAddress(),
            name: 'withdrawFee',
        }
    ]

    // fetch withdrawalFeePeriod from contract 0x08bea2702d89abb8059853d654d0838c5e06fe0b with abi defined in src/config/abi/KingdomsLocked.json using web3React
    const call = await multicall(KingdomLockedABI, mCalls)

    console.log(call);

    // convert calls to obj
    const [withdrawFeePeriod, userInfo, withdrawFee] = call;

    return {
        fees: { withdrawalFee: withdrawFee, withdrawalFeePeriod: withdrawFeePeriod },
        userData: userInfo
    }
}

const FeeSummary: ({
                       stakingTokenSymbol,
                       stakeAmount,
                       vaultKey
                   }: { stakingTokenSymbol: any; stakeAmount: any; vaultKey: any }) => JSX.Element = ({
  stakingTokenSymbol,
  stakeAmount,
  vaultKey,
}) => {
  const { account } = useWeb3React()
    const [data, setData] = React.useState<any>(null);

  // this is terrible
  useVaultPoolByKey(account).then((res) => {
      setData(res);
  });
  const withdrawalFee = 2;
  const withdrawalFeePeriod = 86400;
  const feeAsDecimal = withdrawalFee / 100
  const feeInCake = (parseFloat(stakeAmount) * (feeAsDecimal / 100)).toFixed(4)
  const withdrawalDayPeriod = withdrawalFeePeriod ? secondsToDay(withdrawalFeePeriod) : '-'
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text bold mb="4px">
        {`Unstaking fee: ${feeAsDecimal}%`}
      </Text>
      <Text>
        {`Only applies within ${withdrawalDayPeriod} days of staking. Unstaking after %num% days will not include a fee. Timer resets every time you stake new CAKE in the pool.`}
      </Text>
    </>,
  )

  const hasFeeToPay = data.userInfo ? data.userData.lastDepositedTime && getHasWithdrawFee(parseInt(data.userData.lastDepositedTime, 10), withdrawalFeePeriod) : false;

  return (
    <>
      <Flex mt="24px" alignItems="center" justifyContent="space-between">
        {tooltipVisible && tooltip}
        <Text ref={targetRef} small>
          Unstaking Fee
        </Text>
        <Text fontSize="14px">
          {stakeAmount && hasFeeToPay ? feeInCake : '-'} {stakingTokenSymbol}
        </Text>
      </Flex>
    </>
  )
}

export default FeeSummary
