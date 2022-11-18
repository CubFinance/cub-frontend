import getTimePeriods from 'utils/getTimePeriods'
import {Text} from '@pancakeswap-libs/uikit'
import React from 'react'

const WithdrawalFeeTimer: React.FC<React.PropsWithChildren<{ secondsRemaining: number }>> = ({ secondsRemaining }) => {
    const { days, hours, minutes } = getTimePeriods(secondsRemaining)

    return (
        <Text bold fontSize="14px">
            {`${days}d:${hours}h:${minutes}m`}
        </Text>
    )
}

export default WithdrawalFeeTimer
