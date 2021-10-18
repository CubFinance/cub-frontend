import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { Route, useRouteMatch, useLocation } from 'react-router-dom'
import { useAppDispatch } from 'state'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Toggle, Text, Flex } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
// import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useFarms, usePriceCakeBusd, useGetApiPrices, useTotalValueKingdoms, useBusdPriceFromLpSymbol, useFarmFromPid } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
// import usePersistState from 'hooks/usePersistState'
import { Farm } from 'state/types'
// import { getBalanceNumber } from 'utils/formatBalance'
import { getFarmApr } from 'utils/apr'
import { orderBy } from 'lodash'
import { getAddress } from 'utils/addressHelpers'
import isArchivedPid from 'utils/farmHelpers'
import PageHeader from 'components/PageHeader'
import { fetchFarmsPublicDataAsync, setLoadArchivedFarmsData } from 'state/farms'
import Select, { OptionProps } from 'components/Select/Select'
// import { DEFAULT_TOKEN_DECIMAL } from 'config'
import SearchInput from 'views/Farms/components/SearchInput'
// import { ViewMode } from 'views/Farms/components/types'
import useBnbDividends from 'hooks/useBnbDividends'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import Kingdom from './components/Kingdom'
import CardValue from './components/CardValue'
import TotalStaked from './components/TotalStaked'
import FarmTabButtons from './components/FarmTabButtons'
import './Kingdoms.css'

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const ViewControls = styled.div`
  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const FeeWrapper = styled.div`
  max-width: 400px;
`

const NUMBER_OF_FARMS_VISIBLE = 20

const Kingdoms: React.FC = () => {
  const { path } = useRouteMatch()
  const totalValue = useTotalValueKingdoms();
  const { pathname } = useLocation()
  const { data: farmsLP } = useFarms()
  const [query, setQuery] = useState('')
  const { account } = useWeb3React()
  const [sortOption, setSortOption] = useState('hot')
  const prices = useGetApiPrices()
  const cakePrice = usePriceCakeBusd()
  const realCakePrice = useBusdPriceFromLpSymbol('CAKE') || new BigNumber(0)
  const bakePrice = useBusdPriceFromLpSymbol('BAKE-BNB LP')
  const beltPrice = useBusdPriceFromLpSymbol('BELT-BNB LP')
  const cubDen = useFarmFromPid(12)

  const bnbDividends = useBnbDividends() || {}

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
  // const userDataReady = !account || (!!account && userDataLoaded)

  const [stakedOnly, setStakedOnly] = useState(!isActive)
  useEffect(() => {
    setStakedOnly(!isActive)
  }, [isActive])

  useEffect(() => {
    // Makes the main scheduled fetching to request archived farms data
    dispatch(setLoadArchivedFarmsData(isArchived))

    // Immediately request data for archived farms so users don't have to wait
    // 60 seconds for public data and 10 seconds for user data
    if (isArchived) {
      dispatch(fetchFarmsPublicDataAsync())
      if (account) {
        dispatch(fetchFarmUserDataAsync(account))
      }
    }
  }, [isArchived, dispatch, account])

  const activeFarms = farmsLP.filter(farm => {
    return farm.isKingdom && !['0X', '0.0X'].includes(farm.multiplier) && !isArchivedPid(farm.pid)
  })

  const inactiveFarms = farmsLP.filter(farm => {
    return farm.isKingdom && ['0X', '0.0X'].includes(farm.multiplier) && !isArchivedPid(farm.pid)
  })

  const archivedFarms = farmsLP.filter((farm) => isArchivedPid(farm.pid))

  const stakedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedArchivedFarms = archivedFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const farmsList = useCallback(
    (farmsToDisplay: Farm[]): FarmWithStakedValue[] => {
      let farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !prices) {
          return farm
        }

        const quoteTokenPriceUsd = prices[getAddress(farm.quoteToken.address).toLowerCase()]
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(quoteTokenPriceUsd)
        const apr = isActive ? getFarmApr(farm.poolWeight, cakePrice, totalLiquidity) : 0

        return { ...farm, apr, liquidity: totalLiquidity }
      })

      if (query) {
        const lowercaseQuery = query.toLowerCase()
        farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter((farm: FarmWithStakedValue) => {
          return farm.lpSymbol.toLowerCase().includes(lowercaseQuery)
        })
      }
      return farmsToDisplayWithAPR
    },
    [cakePrice, prices, query, isActive],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const loadMoreRef = useRef<HTMLDivElement>(null)

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)

  const farmsStakedMemoized = useMemo(() => {
    let farmsStaked = []

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm: FarmWithStakedValue) => farm.apr, 'desc')
        case 'multiplier':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
            'desc',
          )
        case 'earned':
          return orderBy(farms, (farm: FarmWithStakedValue) => (farm.userData ? farm.userData.earnings : 0), 'desc')
        case 'liquidity':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
        default:
          return farms
      }
    }

    if (isActive) {
      farmsStaked = stakedOnly ? farmsList(stakedOnlyFarms) : farmsList(activeFarms)
    }
    if (isInactive) {
      farmsStaked = stakedOnly ? farmsList(stakedInactiveFarms) : farmsList(inactiveFarms)
    }
    if (isArchived) {
      farmsStaked = stakedOnly ? farmsList(stakedArchivedFarms) : farmsList(archivedFarms)
    }

    return sortFarms(farmsStaked).slice(0, numberOfFarmsVisible)
  }, [
    sortOption,
    activeFarms,
    farmsList,
    isActive,
    stakedOnly,
    stakedOnlyFarms,
    numberOfFarmsVisible,
    isInactive,
    stakedInactiveFarms,
    inactiveFarms,
    isArchived,
    stakedArchivedFarms,
    archivedFarms,
  ])

  useEffect(() => {
    const showMoreFarms = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfFarmsVisible((farmsCurrentlyVisible) => farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE)
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMoreFarms, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [farmsStakedMemoized, observerIsSet])

  const renderContent = (): JSX.Element => {
    return (
      <div>
          <Route exact path={`${path}`}>
            {farmsStakedMemoized.map((farm) => (
              <Kingdom key={farm.pid} farm={farm} cakePrice={cakePrice} account={account} removed={false} bakePrice={bakePrice} beltPrice={beltPrice} cubDen={cubDen} realCakePrice={realCakePrice} bnbDividends={bnbDividends} />
            ))}
          </Route>
          <Route exact path={`${path}/history`}>
            {farmsStakedMemoized.map((farm) => (
              <Kingdom key={farm.pid} farm={farm} cakePrice={cakePrice} account={account} removed bakePrice={bakePrice} beltPrice={beltPrice} cubDen={cubDen} realCakePrice={realCakePrice} bnbDividends={bnbDividends} />
            ))}
          </Route>
          <Route exact path={`${path}/archived`}>
            {farmsStakedMemoized.map((farm) => (
              <Kingdom key={farm.pid} farm={farm} cakePrice={cakePrice} account={account} removed bakePrice={bakePrice} beltPrice={beltPrice} cubDen={cubDen} realCakePrice={realCakePrice} bnbDividends={bnbDividends} />
            ))}
          </Route>
      </div>
    )
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  return (
    <>
      <PageHeader>
        <div className='k-header'>
          <Heading as="h1" size="xxl" color="secondary" mb="10px">
            Kingdoms
          </Heading>
          <Flex>
            <Text bold fontSize="24px">
              TVL&nbsp;
            </Text>
            <CardValue fontSize="24px" value={totalValue.toNumber()} prefix="$" decimals={2}/>
          </Flex>
        </div>
        <Heading as="h1" size="lg" color="primary" mb="10px" style={{ textAlign: 'left' }}>
          Composable Auto-Compounding
        </Heading>
        <Heading as="h2" color="secondary" mb="10px" style={{ textAlign: 'left' }}>
          Stake tokens for cross-platform farming plus CUB rewards
        </Heading>
        <Heading as="h2" color="warning" mb="10px" style={{ textAlign: 'left' }}>
          IMPORTANT: Must use the host farm exchange (eg. PCS, Bakery) for Kingdom LP tokens
        </Heading>
        <Heading as="h2" color="warning" mb="10px" style={{ textAlign: 'left' }}>
          CertiK Audit is Pending: Our other contracts have been audited by CertiK and Kingdoms are currently under review. Please use at your own discretion until the audit has been published
        </Heading>
        <FeeWrapper>
          <Heading as="h2" color="secondary" mb="5px" style={{ textAlign: 'left' }}>
            Fees
          </Heading>
          <Flex justifyContent="space-between">
            <Text>Fee for CUB Staking Kingdom BNB Dividends:</Text>
            <Text>3%</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Management Fee:</Text>
            <Text>7%</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>CUB Burn Rate:</Text>
            <Text>100% of Fees Buyback and Burn CUB</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Withdrawal Fee:</Text>
            <Text>None</Text>
          </Flex>
        </FeeWrapper>
      </PageHeader>
      <Page className="k-container">
        <TotalStaked farms={farmsStakedMemoized} cakePrice={cakePrice} bakePrice={bakePrice} beltPrice={beltPrice} cubDen={cubDen} />
        <ControlContainer>
          <ViewControls>
            <ToggleWrapper>
              <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} scale="sm" />
              <Text>Staked only</Text>
            </ToggleWrapper>
            <FarmTabButtons
              hasStakeInFinishedFarms={stakedInactiveFarms.length > 0}
              hasStakeInArchivedFarms={stakedArchivedFarms.length > 0}
            />
          </ViewControls>
          <FilterContainer>
            <LabelWrapper>
              <Text>SORT BY</Text>
              <Select
                options={[
                  {
                    label: 'Default',
                    value: 'default',
                  },
                  {
                    label: 'APR',
                    value: 'apr',
                  },
                  {
                    label: 'Multiplier',
                    value: 'multiplier',
                  },
                  {
                    label: 'Earned',
                    value: 'earned',
                  },
                  {
                    label: 'Liquidity',
                    value: 'liquidity',
                  },
                ]}
                onChange={handleSortOptionChange}
              />
            </LabelWrapper>
            <LabelWrapper style={{ marginLeft: 16 }}>
              <Text>SEARCH</Text>
              <SearchInput onChange={handleChangeQuery} />
            </LabelWrapper>
          </FilterContainer>
        </ControlContainer>
        <div id="kingdoms">
          {/* farmsStakedMemoized.map((farm) => (
            <Kingdom key={farm.pid} farm={farm} cakePrice={cakePrice} account={account} removed={false} bakePrice={bakePrice} beltPrice={beltPrice} cubDen={cubDen} realCakePrice={realCakePrice} bnbDividends={bnbDividends} />
          )) */}
          {renderContent()}
        </div>
        <div ref={loadMoreRef} />
      </Page>
    </>
  )
}

export default Kingdoms
