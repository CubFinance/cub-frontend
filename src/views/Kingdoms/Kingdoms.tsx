import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { Route, useRouteMatch, useLocation } from 'react-router-dom'
import { Heading, Flex, Text } from '@pancakeswap-libs/uikit'
import { useAppDispatch } from 'state'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
// import { Image, Heading, RowType, Toggle, Text, Button, Flex } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
// import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
// import { MigrationV2 } from 'components/Banner'
import { useFarms, usePriceCakeBusd, useGetApiPrices, useTotalValueKingdoms } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
// import usePersistState from 'hooks/usePersistState'
import { Farm } from 'state/types'
// import useI18n from 'hooks/useI18n'
// import { getBalanceNumber } from 'utils/formatBalance'
import { getFarmApr } from 'utils/apr'
// import { orderBy } from 'lodash'
import { getAddress } from 'utils/addressHelpers'
import isArchivedPid from 'utils/farmHelpers'
// import PageHeader from 'components/PageHeader'
// import { fetchFarmsPublicDataAsync, setLoadArchivedFarmsData } from 'state/farms'
// import { DEFAULT_TOKEN_DECIMAL } from 'config'

// import styled from 'styled-components'
// import FlexLayout from 'components/layout/Flex'

import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import Kingdom from './components/Kingdom'
import CardValue from './components/CardValue'
import './Kingdoms.css'

const FeeWrapper = styled.div`
  max-width: 400px;
`

const NUMBER_OF_FARMS_VISIBLE = 12

const Kingdoms: React.FC = () => {
  const totalValue = useTotalValueKingdoms();
  // const { path } = useRouteMatch()
  const { pathname } = useLocation()
  // const TranslateString = useI18n()
  const { data: farmsLP, userDataLoaded } = useFarms()
  const cakePrice = usePriceCakeBusd()
  // const [query, setQuery] = useState('')
  const { account } = useWeb3React()
  const prices = useGetApiPrices()

  const dispatch = useAppDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded)

  const activeFarms = farmsLP.filter((farm) => farm.isKingdom && farm.multiplier !== '0X' && !isArchivedPid(farm.pid))

  const farmsList = useCallback(
    (farmsToDisplay: Farm[]): FarmWithStakedValue[] => {
      const farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !prices) {
          return farm
        }

        const quoteTokenPriceUsd = prices[getAddress(farm.quoteToken.address).toLowerCase()]
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(quoteTokenPriceUsd)
        const apr = isActive ? getFarmApr(farm.poolWeight, cakePrice, totalLiquidity) : 0

        return { ...farm, apr, liquidity: totalLiquidity }
      })

      return farmsToDisplayWithAPR
    },
    [cakePrice, prices, isActive],
  )

  const farmsStakedMemoized = useMemo(() => {
    let farmsStaked = []

    if (isActive) {
      farmsStaked = farmsList(activeFarms)
    }
    return farmsStaked
  }, [
    activeFarms,
    farmsList,
    isActive,
  ])

  return (
    <>
      <PageHeader>
        <div className='k-header'>
          <Heading as="h1" size="xxl" color="secondary" mb="10px">
            Kingdoms
          </Heading>
          <div className='tvl-header'>
            <div>TVL</div>
            <CardValue value={totalValue.toNumber()} prefix="$" decimals={2}/>
          </div>
        </div>
        <Heading as="h1" size="lg" color="primary" mb="10px" style={{ textAlign: 'left' }}>
          Kingdoms: Composable Auto-Compounding
        </Heading>
        <Heading as="h2" color="secondary" mb="10px" style={{ textAlign: 'left' }}>
          Stake tokens for cross-platform farming plus CUB rewards
        </Heading>
        <Heading as="h2" color="warning" mb="10px" style={{ textAlign: 'left' }}>
          IMPORTANT: Must use <a target="_blank" rel="noreferrer" href="https://exchange.pancakeswap.finance/#/pool">Pancakeswap V2 Exchange</a> for V2 Kingdom LP tokens until we add a V2 exchange for Cub Finance
        </Heading>
        <Heading as="h2" color="warning" mb="10px" style={{ textAlign: 'left' }}>
          CertiK Audit is Pending: Our other contracts have been audited by CertiK and Kingdoms are currently under review. Please use at your own discretion until the audit has been published
        </Heading>
        <FeeWrapper>
          <Heading as="h2" color="secondary" mb="5px" style={{ textAlign: 'left' }}>
            Fees
          </Heading>
          <Flex justifyContent="space-between">
            <Text>Management Fee:</Text>
            <Text>0.9%</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Withdrawal Fee:</Text>
            <Text>None</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Fee to CUB Staking Kingdom:</Text>
            <Text>1%</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>CUB Burn Rate:</Text>
            <Text>100% of Fees Buyback and Burn CUB</Text>
          </Flex>
        </FeeWrapper>
      </PageHeader>
      <Page className="k-container">
        <div id="kingdoms">
          <div id="content-header" className="k-content">
            <div className="flex-grid k-grid">
              <div className="col">
                <div>Token</div>
                <div>Farm</div>
                <div>TVL</div>
              </div>
              <div className="col">
                <div>Total APY</div>
                <div>Daily APR</div>
                <div>Multiplier</div>
              </div>
              <div className="col">
                <div>Balance</div>
                <div>Deposit</div>
                <div>Rewards</div>
              </div>
              <div className="col" />
            </div>
          </div>
          {farmsStakedMemoized.map((farm) => (
            <Kingdom key={farm.pid} farm={farm} cakePrice={cakePrice} account={account} removed={false} />
          ))}
        </div>
      </Page>
    </>
  )
}

export default Kingdoms
