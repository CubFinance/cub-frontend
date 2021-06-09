// import { useCallback } from 'react'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { getPoolApr, getFarmApr } from 'utils/apr'
import { getBalanceNumber } from 'utils/formatBalance'
import { useBusdPriceFromPid } from 'state/hooks'
// import Balance from 'components/Balance'
import BigNumber from 'bignumber.js'

const useKingdomAPRAPY = (
  isKingdom: boolean,
  isKingdomToken: boolean,
  tokenPriceVsQuote: number,
  poolWeightPCS: any,
  pcsCompounding: number,
  cubAPR: number,
  lpTokenBalancePCSv2: number,
  lpTotalInQuoteTokenPCS: number,
  quoteTokenPriceUsd: number
) => {
  const cakePrice = useBusdPriceFromPid(0)
  let apr:number

  let extra = null
  if (isKingdom) {
    if (isKingdomToken)
      apr = getPoolApr(
        tokenPriceVsQuote,
        tokenPriceVsQuote,
        getBalanceNumber(new BigNumber(lpTokenBalancePCSv2).times(DEFAULT_TOKEN_DECIMAL), 18),
        parseFloat('10'),
      )
    else {
      const totalLiquidity = new BigNumber(lpTotalInQuoteTokenPCS).times(quoteTokenPriceUsd)

      apr = getFarmApr(poolWeightPCS, cakePrice, totalLiquidity, isKingdom)
    }


    const dailyAPR = new BigNumber(apr).div(new BigNumber(365)).toNumber()

    const farmAPY = ((((apr / 100 / pcsCompounding) + 1) ** pcsCompounding) - 1) * 100
    const totalAPY = cubAPR ? cubAPR + farmAPY : farmAPY
    const totalAPYString = totalAPY && totalAPY.toLocaleString('en-US', { maximumFractionDigits: 2 })

    extra = { pcsApr: apr, dailyAPR, farmAPY, totalAPY, totalAPYString }
  }

  return extra
}

export default useKingdomAPRAPY
