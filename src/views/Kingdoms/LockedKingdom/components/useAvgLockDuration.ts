import {useMemo, useState} from 'react'
import { BOOST_WEIGHT, DURATION_FACTOR } from 'config/constants/pools'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'

import { DEFAULT_TOKEN_DECIMAL } from 'config'
import {memoize} from "lodash";
import formatDuration from "date-fns/formatDuration";
import addSeconds from "date-fns/addSeconds";
import differenceInWeeks from "date-fns/differenceInWeeks";
import {BIG_TEN, BIG_ZERO} from "../../../../utils/bigNumber";

export const getFullDecimalMultiplier = memoize((decimals: number): BigNumber => {
    return BIG_TEN.pow(decimals)
})

const formatSecondsToWeeks = (secondDuration) => formatDuration({ weeks: secondsToWeeks(secondDuration) })

export const secondsToWeeks = (seconds) => {
    const now = new Date()
    const addedDate = addSeconds(now, seconds)

    return differenceInWeeks(new Date(addedDate), now, { roundingMethod: 'round' })
}

export default function useAvgLockDuration(tLA: BigNumber, totalShares: BigNumber, tB: BigNumber, pricePerFullShare: BigNumber) {
    const totalBalance = tB.times(DEFAULT_TOKEN_DECIMAL);
    const totalLockedAmount = tLA.times(DEFAULT_TOKEN_DECIMAL);

    const avgLockDurationsInSeconds = useMemo(() => {
        const flexibleCakeAmount = totalBalance.minus(totalLockedAmount)
        const flexibleCakeShares = flexibleCakeAmount.div(pricePerFullShare).times(DEFAULT_TOKEN_DECIMAL)
        const lockedCakeBoostedShares = totalShares.minus(flexibleCakeShares)
        const lockedCakeOriginalShares = totalLockedAmount.div(pricePerFullShare).times(DEFAULT_TOKEN_DECIMAL)
        const avgBoostRatio = lockedCakeBoostedShares.div(lockedCakeOriginalShares)

        return avgBoostRatio
            .minus(1)
            .times(new BigNumber(DURATION_FACTOR.toString()))
            .div(new BigNumber(BOOST_WEIGHT.toString()).div(getFullDecimalMultiplier(12)))
            .toFixed(0)
    }, [totalLockedAmount, totalBalance, pricePerFullShare, totalShares])

    const avgLockDurationsInWeeks = useMemo(
        () => formatSecondsToWeeks(avgLockDurationsInSeconds),
        [avgLockDurationsInSeconds],
    )

    return {
        avgLockDurationsInWeeks,
        avgLockDurationsInSeconds: _toNumber(avgLockDurationsInSeconds),
    }
}
