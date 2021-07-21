// import { useCallback } from 'react'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { getPoolApr, getFarmApr } from 'utils/apr'
import { getBalanceNumber } from 'utils/formatBalance'
import { useBusdPriceFromPid, useFarmFromPid, useBusdPriceFromLpSymbol } from 'state/hooks'
// import Balance from 'components/Balance'
import BigNumber from 'bignumber.js'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'

const useKingdomAPRAPY = (
  farm: FarmWithStakedValue,
) => {
  const { apr: cubAPR, isKingdom, poolWeightPCS, compounding, lpTokenBalancePCS: lpTokenBalanceMC = 0, lpTotalInQuoteTokenPCS = 0, quoteToken: { busdPrice: quoteTokenPriceUsd }, altPid, farmType, beltAPR } = farm

  const cakePrice = useBusdPriceFromPid(0)
  const bakePrice = useBusdPriceFromLpSymbol('BAKE-BNB LP')
  const beltPrice = useBusdPriceFromLpSymbol('BELT-BNB LP')

  const newFarm = useFarmFromPid(altPid)
  let apr:number
  let data = null

  if (altPid === 12) {
    const totalLiquidity = new BigNumber(newFarm.lpTotalInQuoteToken).times(newFarm.quoteToken.busdPrice)
    apr = getFarmApr(newFarm.poolWeight, newFarm.tokenPriceVsQuote, totalLiquidity)

    const dailyAPR = new BigNumber(apr).div(new BigNumber(365)).toNumber()

    const farmAPY = ((((apr / 100 / compounding) + 1) ** compounding) - 1) * 100
    const totalAPY = farmAPY
    const totalAPYString = totalAPY && totalAPY.toLocaleString('en-US', { maximumFractionDigits: 2 })

    data = { pcsApr: apr, dailyAPR, farmAPY, totalAPY, totalAPYString, newMultiplier: newFarm.multiplier }

    return data
  }

  if (farm.lpSymbol === 'CAKE') {
    apr = getPoolApr(
      Number(farm.token.busdPrice),
      Number(farm.token.busdPrice),
      getBalanceNumber(new BigNumber(lpTokenBalanceMC).times(DEFAULT_TOKEN_DECIMAL), 18),
      parseFloat('10') // CAKE is 10
    )
  } else {
    const totalLiquidity = new BigNumber(lpTotalInQuoteTokenPCS).times(quoteTokenPriceUsd)

    let farmTokenPrice = cakePrice
    if (farmType === 'Bakery') farmTokenPrice = bakePrice
    else if (farmType === 'Belt') farmTokenPrice = beltPrice

    if (farmType === 'Belt') apr = Number(beltAPR)
    else apr = getFarmApr(new BigNumber(poolWeightPCS), farmTokenPrice, totalLiquidity, isKingdom, farmType)
  }

  const dailyAPR = apr ? new BigNumber(apr).div(new BigNumber(365)).toNumber() : new BigNumber(0).toNumber()

  const farmAPY = ((((apr / 100 / compounding) + 1) ** compounding) - 1) * 100
  const totalAPY = cubAPR ? cubAPR + farmAPY : farmAPY
  const totalAPYString = totalAPY && totalAPY.toLocaleString('en-US', { maximumFractionDigits: 2 })

  data = { pcsApr: apr, dailyAPR, farmAPY, totalAPY, totalAPYString }

  return data
}

export default useKingdomAPRAPY
