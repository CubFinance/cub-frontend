import { Box, CardBody, CardProps, Flex, Text } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import React from 'react'

import {useWeb3React} from "@web3-react/core";
import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'
import RecentCakeProfitRow from './RecentCakeProfitRow'
import { StakingApy } from './StakingApy'
import VaultCardActions from './VaultCardActions'

const StyledCardBody = styled(CardBody)<{ isLoading: boolean }>`
  min-height: ${({ isLoading }) => (isLoading ? '0' : '254px')};
`

export const CakeVaultDetail: React.FC = ({...props}) => {
  return (
    <>
      <StyledCardBody isLoading={false}>
        { /* <> */ }
            {/* <StakingApy pool={pool} />
              <Box>
                {account && (
                  <Box mb="8px">
                    <UnstakingFeeCountdownRow vaultKey={pool.vaultKey} />
                  </Box>
                )}
                <RecentCakeProfitRow pool={pool} />
              </Box>
              <Flex flexDirection="column">
                {account ? (
                  <VaultCardActions
                    pool={pool}
                    accountHasSharesStaked={accountHasSharesStaked}
                    isLoading={isLoading}
                    performanceFee={performanceFeeAsDecimal}
                  />
                ) : (
                  <>
                    <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                      Start earning
                    </Text>
                  </>
                )}
              </Flex>
          </> */ }
      </StyledCardBody>
    </>
  )
}

const CakeVaultCard: React.FC = ({...props}) => {
  const { account } = useWeb3React()

  // const vaultPool = useVaultPoolByKey(pool.vaultKey)

 /* const {
    userData: { userShares, isLoading: isVaultUserDataLoading },
    fees: { performanceFeeAsDecimal },
  } = vaultPool */

  // const accountHasSharesStaked = userShares && userShares.gt(0)
  // const isLoading = !pool.userData || isVaultUserDataLoading

  // if (showStakedOnly && !accountHasSharesStaked) {
  //  return null
  // }

  return null;
}

export default CakeVaultCard
