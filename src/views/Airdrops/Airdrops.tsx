import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { Route, useRouteMatch, useLocation } from 'react-router-dom'
import { useAppDispatch } from 'state'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Text, Flex } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import { useTotalCubStaked } from 'state/hooks'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { BIG_ZERO } from 'utils/bigNumber'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import { getBalanceNumber } from 'utils/formatBalance'
import { getCakeAddress } from 'utils/addressHelpers'
import CardValue from 'views/Home/components/CardValue'
import StakedBalance from './StakedBalance'

const Title = styled.div`
  font-size: 2rem;
  color: ${(props) => props.theme.colors.primary};
`

const FlexMobile = styled(Flex)`
  justify-content: space-between;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    justify-content: felx-start;
  }
`

const Airdrops: React.FC = () => {
  // const { path } = useRouteMatch()
  // const { pathname } = useLocation()
  const { account } = useWeb3React()

  const dispatch = useAppDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const { cub = BIG_ZERO, value = BIG_ZERO } = useTotalCubStaked()
  const totalSupply = useTotalSupply()
  const burnedBalance = useBurnedBalance(getCakeAddress())
  const circSupply = totalSupply ? totalSupply.minus(burnedBalance) : new BigNumber(0);
  const cubSupply = getBalanceNumber(circSupply) || 0;
  const pendingAirdrop = cubSupply ? new BigNumber(1000000).div(cubSupply).times(cub) : BIG_ZERO
  const pCubValue = pendingAirdrop.times(1)

  return (
    <>
      <PageHeader>
        <div className='k-header'>
          <Heading as="h1" size="xxl" color="secondary" mb="10px">
            POLYCUB Airdrop
          </Heading>
        </div>
      </PageHeader>
      <Page>
        <FlexMobile>
          <Flex flexDirection="column">
            <Title>Total Staked CUB Balance</Title>
            <StakedBalance cub={cub} value={value} />
          </Flex>
          <Flex flexDirection="column">
            <Title>Pending Airdrop (60 days)</Title>
            <StakedBalance cub={pendingAirdrop} value={pCubValue} />
            {/* <Text bold fontSize="40px" style={{ lineHeight: '1' }} color="text">{pendingAirdrop.toLocaleString('en-US', { maximumFractionDigits: 0 })}</Text> */}
          </Flex>
        </FlexMobile>
      </Page>
    </>
  )
}

export default Airdrops
