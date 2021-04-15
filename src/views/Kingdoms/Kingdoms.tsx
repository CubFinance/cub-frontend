/* import React, { useEffect, useCallback } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { Image, Heading } from '@pancakeswap-libs/uikit'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from 'config'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useFarms, usePriceBnbBusd, usePriceCakeBusd } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import { QuoteToken } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import FarmTabButtons from './components/FarmTabButtons'
import Divider from './components/Divider' */
import React from 'react'
import Page from 'components/layout/Page'
// import styled from 'styled-components'
// import FlexLayout from 'components/layout/Flex'

import { useTotalValue } from '../../state/hooks'
import CardValue from './components/CardValue'
// import KingdomDetail from './components/KingdomDetail'
import './Kingdoms.css'

/* const KHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  position: relative;
  text-align: center;
`
const TVLHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
` */
/* export interface KingdomsProps{
  tokenMode?: boolean
  kingdomMode?: boolean
} */

const Kingdoms: React.FC = (kingdomsPrps) => {
  const totalValue = useTotalValue();
  const { children } = kingdomsPrps;

  return (
    <Page className="k-container">
      <div className='k-header'>
        <div><h1>Kingdoms</h1></div>
        <div className='tvl-header'>
          <div>TVL</div>
          <CardValue value={totalValue.toNumber()} prefix="$" decimals={2}/>
        </div>
      </div>
      <div id="kingdoms">
        <div id="content-header" className="k-content">
          <div className="flex-grid k-grid">
            <div className="col">
              <div>Token</div>
              <div>TVL</div>
            </div>
            <div className="col">
              <div>APY</div>
              <div>Daily APR</div>
            </div>
            <div className="col">
              <div>Balance</div>
              <div>Deposit</div>
              <div>Rewards</div>
            </div>
            <div className="col" />
          </div>
        </div>
        { children }
        {/* <div className="flex-grid">
          <div className="col">
            <div>ETH</div>
            <div>12.6x TVL $81.2M</div>
          </div>
          <div className="col">
            <div>167.8%</div>
            <div>0.46%</div>
          </div>
          <div className="col">
            <div>-</div>
            <div>-</div>
            <div>-</div>
          </div>
        </div> */}
      </div>
    </Page>
  )
  /* const { path } = useRouteMatch()
  const TranslateString = useI18n()
  const farmsLP = useFarms()
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const {tokenMode} = farmsProps;

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const activeFarms = farmsLP.filter((farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier !== '0X')
  const inactiveFarms = farmsLP.filter((farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier === '0X')

  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      // const cakePriceVsBNB = new BigNumber(farmsLP.find((farm) => farm.pid === CAKE_POOL_PID)?.tokenPriceVsQuote || 0)
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        // if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
        //   return farm
        // }
        const cakeRewardPerBlock = new BigNumber(farm.cubPerBlock || 1).times(new BigNumber(farm.poolWeight)) .div(new BigNumber(10).pow(18))
        const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

        let apy = cakePrice.times(cakeRewardPerYear);

        let totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0);

        if (farm.quoteTokenSymbol === QuoteToken.BNB) {
          totalValue = totalValue.times(bnbPrice);
        }

        if(totalValue.comparedTo(0) > 0){
          apy = apy.div(totalValue);
        }

        return { ...farm, apy }
      })
      return farmsToDisplayWithAPY.map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          removed={removed}
          bnbPrice={bnbPrice}
          cakePrice={cakePrice}
          ethereum={ethereum}
          account={account}
        />
      ))
    },
    [bnbPrice, account, cakePrice, ethereum],
  )

  return (
    <Page>
      <Heading as="h1" size="lg" color="primary" mb="50px" style={{ textAlign: 'center' }}>
        {
          tokenMode ?
            TranslateString(10002, 'Stake tokens to earn CUB')
            :
          TranslateString(320, 'Stake LP tokens to earn CUB')
        }
      </Heading>
      <Heading as="h2" color="secondary" mb="50px" style={{ textAlign: 'center' }}>
        {TranslateString(10000, 'Deposit Fee will be used to buyback CUB and bLEO')}
      </Heading>
      <FarmTabButtons />
      <div>
        <Divider />
        <FlexLayout>
          <Route exact path={`${path}`}>
            {farmsList(activeFarms, false)}
          </Route>
          <Route exact path={`${path}/history`}>
            {farmsList(inactiveFarms, true)}
          </Route>
        </FlexLayout>
      </div>
      <Image src="/images/cub/wide.svg" alt="illustration" width={1352} height={587} responsive />
    </Page>
  ) */
}

export default Kingdoms
