import BigNumber from "bignumber.js";
import useSWRImmutable from "swr/immutable";
import {getLockedKingdomsContract} from "../../../utils/contractHelpers";

export interface InitialPoolVaultState {
    totalShares: BigNumber
    totalLockedAmount: BigNumber
    pricePerFullShare: BigNumber
    fees: {
        performanceFee: BigNumber
        withdrawalFee: BigNumber
        withdrawalFeePeriod: BigNumber
    }
    userData: {
        shares: BigNumber
        lastDepositedTime: BigNumber
        tokenAtLastUserAction: BigNumber
        lastUserActionTime: BigNumber
        lockStartTime: BigNumber
        lockEndTime: BigNumber
        userBoostedShare: BigNumber
        locked: boolean
        lockedAmount: BigNumber
        overdueFee: BigNumber
    }
}

export const useSWRImmutableFetchPoolVaultData = (account: string) => {
    return useSWRImmutable("chain-balance-locked-cub-better", () => fetchPoolVaultData(account))
}

// call LockedKingdoms ABI and convert into the above format
export const fetchPoolVaultData = async (account: string): Promise<InitialPoolVaultState> => {
    const contract = getLockedKingdomsContract()
    const [
        totalShares,
        totalLockedAmount,
        pricePerFullShare,
        performanceFee,
        withdrawalFee,
        withdrawalFeePeriod,
        userInfo,
        userOverdueFee,
    ] = await Promise.all([
        contract.methods.totalShares().call(),
        contract.methods.totalLockedAmount().call(),
        contract.methods.getPricePerFullShare().call(),
        contract.methods.calculatePerformanceFee(account).call(),
        contract.methods.withdrawalFee().call(),
        contract.methods.withdrawalFeePeriod().call(),
        contract.methods.userInfo(account).call(),
        contract.methods.calculateOverdueFee(account).call(),
    ])

    return {
        totalShares: new BigNumber(totalShares),
        totalLockedAmount: new BigNumber(totalLockedAmount),
        pricePerFullShare: new BigNumber(pricePerFullShare),
        fees: {
            performanceFee: new BigNumber(performanceFee),
            withdrawalFee: new BigNumber(withdrawalFee),
            withdrawalFeePeriod: new BigNumber(withdrawalFeePeriod),
        },
        userData: {...userInfo, overdueFee: userOverdueFee},
    }

}