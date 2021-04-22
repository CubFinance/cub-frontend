import React, { useEffect, useCallback } from 'react'
import { Route, useRouteMatch, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { Image, Heading, Button } from '@pancakeswap-libs/uikit'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from 'config'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useFarms, usePriceBnbBusd, usePriceCakeBusd } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import { QuoteToken } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import KingdomCard from './components/KingdomCard/FarmCard'
import FarmTabButtons from './components/FarmTabButtons'
import Divider from './components/Divider'
import CardValue from './components/CardValue'
import { useTotalValue } from '../../state/hooks'
// import Kingdom from '../Kingdoms/components/Kingdom'
// import Kingdoms from '../Kingdoms'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
`

export interface FarmsProps{
  tokenMode?: boolean
  kingdomMode?: boolean
}

const Farms: React.FC<FarmsProps> = (farmsProps) => {
  const { path } = useRouteMatch()
  const TranslateString = useI18n()
  const farmsLP = useFarms()
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const { tokenMode, kingdomMode } = farmsProps;

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const activeFarms = farmsLP.filter(farm => {
    if (kingdomMode) {
      return !!farm.isKingdom === !!kingdomMode && farm.multiplier !== '0X'
    }
    return !!farm.isTokenOnly === !!tokenMode && !!farm.isKingdom === !!kingdomMode && farm.multiplier !== '0X'
  })

  const inactiveFarms = farmsLP.filter(farm => {
    if (kingdomMode) {
      return !!farm.isKingdom === !!kingdomMode && farm.multiplier === '0X'
    }
    return !!farm.isTokenOnly === !!tokenMode && !!farm.isKingdom === !!kingdomMode && farm.multiplier === '0X'
  })

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
      return farmsToDisplayWithAPY.map((farm) => {
        /* if (kingdomMode) return (
          <KingdomCard
            key={farm.pid}
            farm={farm}
            removed={removed}
            bnbPrice={bnbPrice}
            cakePrice={cakePrice}
            ethereum={ethereum}
            account={account}
          />
        ) */

        return (
          <FarmCard
            key={farm.pid}
            farm={farm}
            removed={removed}
            bnbPrice={bnbPrice}
            cakePrice={cakePrice}
            ethereum={ethereum}
            account={account}
          />
        )
      })
    },
    [bnbPrice, account, cakePrice, ethereum],
    // [bnbPrice, account, cakePrice, ethereum, kingdomMode],
  )

  // if (kingdomMode)
  //   return (
  //     <Kingdoms>
  //       {farmsList(activeFarms, false)}
  //     </Kingdoms>
  //   )

  let heading = TranslateString(320, 'Stake LP tokens to earn CUB')
  let subHeading = TranslateString(10000, 'Deposit Fee will be used to buyback CUB and bLEO')
  let extra = null
  const totalValue = useTotalValue();

  if (tokenMode) heading = TranslateString(10002, 'Stake tokens to earn CUB')
  else if (kingdomMode) {
    heading = TranslateString(null, 'Kingdoms: Composable Auto-Compounding')
    subHeading = TranslateString(null, 'Stake tokens for cross-platform farming plus CUB rewards')
    extra = (
      <Heading as="h3" color="secondary" mb="30px" style={{ textAlign: 'center', fontSize: '1rem' }}>
        TVL <CardValue value={totalValue.toNumber()} prefix="$" decimals={2}/>
      </Heading>
    )
  }

  const tlvSpacing = kingdomMode ? '10px' : '30px'

  return (
    <Page>
      <Heading as="h1" size="lg" color="primary" mb="20px" style={{ textAlign: 'center' }}>
        {heading}
      </Heading>
      <Heading as="h2" color="secondary" mb={tlvSpacing} style={{ textAlign: 'center' }}>
        {subHeading}
      </Heading>
      {extra}
      <Wrapper>
        <Button size="sm" variant="subtle">
          <a href="https://docs.cubdefi.com">Learn More</a>
        </Button>
      </Wrapper>
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
  )
}

export default Farms
