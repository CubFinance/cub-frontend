import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { Route, useRouteMatch, useLocation } from 'react-router-dom'
import { useAppDispatch } from 'state'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Toggle, Text, Flex } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import StakedBalance from './StakedBalance'

const Title = styled.div`
  font-size: 2rem
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

  return (
    <>
      <PageHeader>
        <div className='k-header'>
          <Heading as="h1" size="xxl" color="secondary" mb="10px">
            Airdrops
          </Heading>
        </div>
      </PageHeader>
      <Page>
        <Title>
          POLYCUB Airdrop
        </Title>
        <Text>[XXX] CUB Staked for Airdrop</Text>
        <StakedBalance />
        <Text>Pending Airdrop: [1,000,000 / XXX = YYY] POLYCUB over 60 days</Text>
      </Page>
    </>
  )
}

export default Airdrops
