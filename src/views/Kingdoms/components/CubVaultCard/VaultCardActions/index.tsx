import BigNumber from 'bignumber.js'
import React from 'react'

import styled from 'styled-components'
import { Flex, Text, Box } from '@pancakeswap-libs/uikit'
import { BIG_ZERO } from 'utils/bigNumber'
import VaultApprovalAction from './VaultApprovalAction'
import VaultStakeActions from './VaultStakeActions'

const InlineText = styled(Text)`
  display: inline;
`

const CakeVaultCardActions: React.FC<
  React.PropsWithChildren<{
    accountHasSharesStaked: boolean
    isLoading: boolean
    performanceFee: number
  }>
> = ({ accountHasSharesStaked, isLoading, performanceFee }) => {
  // const { stakingToken, userData } = pool
  // const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

    return null;

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        <Box display="inline">
          <InlineText
            color={accountHasSharesStaked ? 'secondary' : 'textSubtle'}
            textTransform="uppercase"
            bold
            fontSize="12px"
          >
            {/* accountHasSharesStaked ? stakingToken.symbol : 'Stake' */}{' '}
          </InlineText>
          <InlineText
            color={accountHasSharesStaked ? 'textSubtle' : 'secondary'}
            textTransform="uppercase"
            bold
            fontSize="12px"
          >
            {/* accountHasSharesStaked ? 'Staked' : `${stakingToken.symbol}` */}
          </InlineText>
        </Box>
        {/* isVaultApproved ? (
          <VaultStakeActions
            pool={pool}
            stakingTokenBalance={stakingTokenBalance}
            accountHasSharesStaked={accountHasSharesStaked}
            performanceFee={performanceFee}
          />
        ) : (
          <VaultApprovalAction vaultKey={pool.vaultKey} isLoading={isLoading} setLastUpdated={setLastUpdated} />
        ) */}
      </Flex>
    </Flex>
  )
}

export default CakeVaultCardActions
