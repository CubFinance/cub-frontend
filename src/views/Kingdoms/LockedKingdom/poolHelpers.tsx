import BigNumber from "bignumber.js";
import useSWRImmutable from "swr/immutable";
import {getCakeContract, getLockedKingdomsContract} from "../../../utils/contractHelpers";
import {BIG_TEN} from "../../../utils/bigNumber";
import {DEFAULT_TOKEN_DECIMAL} from "../../../config";
import {getLockedKingdomsAddress} from "../../../utils/addressHelpers";

export interface InitialPoolVaultState {
    totalShares: string
    totalLockedAmount: string
    pricePerFullShare: string
    totalBalance: string
    fees: {
        performanceFee: string
        withdrawalFee: string
        withdrawalFeePeriod: string
    }
}

// call LockedKingdoms ABI and convert into the above format
export const fetchPoolVaultData = async (): Promise<InitialPoolVaultState> => {
    const contract = getLockedKingdomsContract()
    const cubContract = getCakeContract();
    const lockedKingdomsAddress = getLockedKingdomsAddress();

    const [
        totalShares,
        totalLockedAmount,
        pricePerFullShare,
        withdrawalFee,
        withdrawalFeePeriod,
        performanceFee,
        totalBalance
    ] = await Promise.all([
        contract.methods.totalShares().call(),
        contract.methods.totalLockedAmount().call(),
        contract.methods.getPricePerFullShare().call(),
        contract.methods.withdrawFee().call(),
        contract.methods.withdrawFeePeriod().call(),
        contract.methods.performanceFee().call(),
        cubContract.methods.balanceOf(lockedKingdomsAddress).call(),
    ])

    return {
        totalShares: new BigNumber(totalShares).toString(),
        totalLockedAmount: new BigNumber(totalLockedAmount).div(DEFAULT_TOKEN_DECIMAL).toString(),
        pricePerFullShare: new BigNumber(pricePerFullShare).toString(),
        totalBalance: new BigNumber(totalBalance).div(DEFAULT_TOKEN_DECIMAL).toString(),
        fees: {
            performanceFee: new BigNumber(performanceFee).toString(),
            withdrawalFee: new BigNumber(withdrawalFee).toString(),
            withdrawalFeePeriod: new BigNumber(withdrawalFeePeriod).toString(),
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
        userPerformanceFee,
    ] = await Promise.all([
        contract.methods.userInfo(account).call(),
        contract.methods.calculateOverdueFee(account).call(),
        contract.methods.calculatePerformanceFee(account).call(),
    ])

    return {
        shares: new BigNumber(userInfo.shares).toString(),
        lastDepositedTime: new BigNumber(userInfo.lastDepositedTime).toString(),
        tokenAtLastUserAction: new BigNumber(userInfo.tokenAtLastUserAction).div(DEFAULT_TOKEN_DECIMAL).toString(),
        lastUserActionTime: new BigNumber(userInfo.lastUserActionTime).toString(),
        lockStartTime: new BigNumber(userInfo.lockStartTime).toString(),
        lockEndTime: new BigNumber(userInfo.lockEndTime).toString(),
        userBoostedShare: new BigNumber(userInfo.userBoostedShare).toString(),
        locked: userInfo.locked,
        lockedAmount: new BigNumber(userInfo.lockedAmount).div(DEFAULT_TOKEN_DECIMAL).toString(),
        overdueFee: new BigNumber(userOverdueFee).toString(),
        performanceFee: new BigNumber(userPerformanceFee).toString(),
    }
}

export const fetchLockedKingdomTotalStaked = async () => {
    const contract = getCakeContract();
    const lockedKingdomsAddress = getLockedKingdomsAddress();
    const totalStaked = await contract.methods.balanceOf(lockedKingdomsAddress).call();
    return new BigNumber(totalStaked).toString();
}