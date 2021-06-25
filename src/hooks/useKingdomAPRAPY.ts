// import { useCallback } from 'react'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { getPoolApr, getFarmApr } from 'utils/apr'
import { getBalanceNumber } from 'utils/formatBalance'
import { useBusdPriceFromPid, useFarmFromPid } from 'state/hooks'
// import Balance from 'components/Balance'
import BigNumber from 'bignumber.js'

const useKingdomAPRAPY = (
  isKingdom: boolean,
  isKingdomToken: boolean,
  tokenPriceVsQuote: number,
  poolWeightPCS: any,
  compounding: number,
  cubAPR: number,
  lpTokenBalanceMC: number,
  lpTotalInQuoteTokenPCS: number,
  quoteTokenPriceUsd: number,
  altPid?: number,
) => {
  const cakePrice = useBusdPriceFromPid(0)
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

  if (isKingdomToken)
    apr = getPoolApr(
      tokenPriceVsQuote,
      tokenPriceVsQuote,
      getBalanceNumber(new BigNumber(lpTokenBalanceMC).times(DEFAULT_TOKEN_DECIMAL), 18),
      parseFloat('10'),
    )
  else {
    const totalLiquidity = new BigNumber(lpTotalInQuoteTokenPCS).times(quoteTokenPriceUsd)

    apr = getFarmApr(poolWeightPCS, cakePrice, totalLiquidity, isKingdom)
  }

  const dailyAPR = apr ? new BigNumber(apr).div(new BigNumber(365)).toNumber() : new BigNumber(0)

  const farmAPY = ((((apr / 100 / compounding) + 1) ** compounding) - 1) * 100
  const totalAPY = cubAPR ? cubAPR + farmAPY : farmAPY
  const totalAPYString = totalAPY && totalAPY.toLocaleString('en-US', { maximumFractionDigits: 2 })

  data = { pcsApr: apr, dailyAPR, farmAPY, totalAPY, totalAPYString }

  return data
}

export default useKingdomAPRAPY
