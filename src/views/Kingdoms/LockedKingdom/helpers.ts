import {BigNumber} from "bignumber.js";
import {memoize} from "lodash";
import {BIG_TEN, BIG_ZERO} from "../../../utils/bigNumber";

// eslint-disable-next-line import/prefer-default-export
export const getCakeVaultEarnings = (
    account: string,
    cakeAtLastUserAction: BigNumber,
    userShares: BigNumber,
    pricePerFullShare: BigNumber,
    earningTokenPrice: number,
    fee?: BigNumber,
) => {
    const hasAutoEarnings = account && cakeAtLastUserAction?.gt(0) && userShares?.gt(0)
    const { cakeAsBigNumber } = convertSharesToCake(userShares, pricePerFullShare)
    const autoCakeProfit = cakeAsBigNumber.minus(fee || BIG_ZERO).minus(cakeAtLastUserAction)
    const autoCakeToDisplay = autoCakeProfit.gte(0) ? getBalanceNumber(autoCakeProfit, 18) : 0

    const autoUsdProfit = autoCakeProfit.times(earningTokenPrice)
    const autoUsdToDisplay = autoUsdProfit.gte(0) ? getBalanceNumber(autoUsdProfit, 18) : 0
    return { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay }
}

export const convertSharesToCake = (
    shares: BigNumber,
    cakePerFullShare: BigNumber,
    decimals = 18,
    decimalsToRound = 3,
    fee?: BigNumber,
) => {
    const sharePriceNumber = getBalanceNumber(cakePerFullShare, decimals)
    const amountInCake = new BigNumber(shares.multipliedBy(sharePriceNumber)).minus(fee || BIG_ZERO)
    const cakeAsNumberBalance = getBalanceNumber(amountInCake, decimals)
    const cakeAsBigNumber = getDecimalAmount(new BigNumber(cakeAsNumberBalance), decimals)
    const cakeAsDisplayBalance = getFullDisplayBalance(amountInCake, decimals, decimalsToRound)
    return { cakeAsNumberBalance, cakeAsBigNumber, cakeAsDisplayBalance }
}

export const convertCakeToShares = (
    cake: BigNumber,
    cakePerFullShare: BigNumber,
    decimals = 18,
    decimalsToRound = 3,
) => {
    const sharePriceNumber = getBalanceNumber(cakePerFullShare, decimals)
    const amountInShares = new BigNumber(cake.dividedBy(sharePriceNumber))
    const sharesAsNumberBalance = getBalanceNumber(amountInShares, decimals)
    const sharesAsBigNumber = getDecimalAmount(new BigNumber(sharesAsNumberBalance), decimals)
    const sharesAsDisplayBalance = getFullDisplayBalance(amountInShares, decimals, decimalsToRound)
    return { sharesAsNumberBalance, sharesAsBigNumber, sharesAsDisplayBalance }
}

export const getBalanceAmount = (amount: BigNumber, decimals = 18) => {
    return new BigNumber(amount).dividedBy(getFullDecimalMultiplier(decimals))
}

/**
 * This function is not really necessary but is used throughout the site.
 */
export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
    return getBalanceAmount(balance, decimals).toNumber()
}

export const getDecimalAmount = (amount: BigNumber, decimals = 18) => {
    return new BigNumber(amount).times(getFullDecimalMultiplier(decimals))
}

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18, displayDecimals?: number): string => {
    return getBalanceAmount(balance, decimals).toFixed(displayDecimals as number)
}

export const getFullDecimalMultiplier = memoize((decimals: number): BigNumber => {
    return BIG_TEN.pow(decimals)
})