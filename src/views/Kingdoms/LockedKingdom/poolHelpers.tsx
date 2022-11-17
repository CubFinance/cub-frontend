import BigNumber from "bignumber.js";
import useSWRImmutable from "swr/immutable";
import {getLockedKingdomsContract} from "../../../utils/contractHelpers";
import {BIG_TEN} from "../../../utils/bigNumber";
import {DEFAULT_TOKEN_DECIMAL} from "../../../config";

export interface InitialPoolVaultState {
    totalShares: BigNumber
    totalLockedAmount: BigNumber
    pricePerFullShare: BigNumber
    fees: {
        performanceFee: BigNumber
        withdrawalFee: BigNumber
        withdrawalFeePeriod: BigNumber
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
    ] = await Promise.all([
        contract.methods.totalShares().call(),
        contract.methods.totalLockedAmount().call(),
        contract.methods.getPricePerFullShare().call(),
        contract.methods.calculatePerformanceFee(account).call(),
        contract.methods.withdrawFee().call(),
        contract.methods.withdrawFeePeriod().call(),
    ])

    return {
        totalShares: new BigNumber(totalShares),
        totalLockedAmount: new BigNumber(totalLockedAmount).div(BIG_TEN.pow(DEFAULT_TOKEN_DECIMAL)),
        pricePerFullShare: new BigNumber(pricePerFullShare).div(BIG_TEN.pow(DEFAULT_TOKEN_DECIMAL)),
        fees: {
            performanceFee: new BigNumber(performanceFee),
            withdrawalFee: new BigNumber(withdrawalFee),
            withdrawalFeePeriod: new BigNumber(withdrawalFeePeriod),
        },
    }
}

export const fetchLockedKingdomUserData = async (account: string) => {
    if (!account) {
        return null
    }

    const contract = getLockedKingdomsContract();

    const [
        userInfo,
        userOverdueFee,
    ] = await Promise.all([
        contract.methods.userInfo(account).call(),
        contract.methods.calculateOverdueFee(account).call(),
    ])

    return {
        shares: new BigNumber(userInfo.shares),
        lastDepositedTime: new BigNumber(userInfo.lastDepositedTime),
        tokenAtLastUserAction: new BigNumber(userInfo.tokenAtLastUserAction).div(BIG_TEN.pow(DEFAULT_TOKEN_DECIMAL)),
        lastUserActionTime: new BigNumber(userInfo.lastUserActionTime),
        lockStartTime: new BigNumber(userInfo.lockStartTime),
        lockEndTime: new BigNumber(userInfo.lockEndTime),
        userBoostedShare: new BigNumber(userInfo.userBoostedShare),
        locked: userInfo.locked,
        lockedAmount: new BigNumber(userInfo.lockedAmount).div(BIG_TEN.pow(DEFAULT_TOKEN_DECIMAL)),
        overdueFee: new BigNumber(userOverdueFee).div(BIG_TEN.pow(DEFAULT_TOKEN_DECIMAL)),
    }
}