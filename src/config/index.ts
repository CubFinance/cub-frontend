import BigNumber from 'bignumber.js/bignumber'
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'
import { BIG_TEN } from 'utils/bigNumber'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const BSC_BLOCK_TIME = 3

// CAKE_PER_BLOCK details
// 40 CAKE is minted per block
// 18 CAKE per block is sent to Burn pool (A farm just for burning cake)
// 10 CAKE per block goes to CAKE syrup pool
// 12 CAKE per block goes to Yield farms and lottery
// CAKE_PER_BLOCK in config/index.ts = 40 as we only change the amount sent to the burn pool which is effectively a farm.
// CAKE/Block in components/CakeStats.tsx = 22 (40 - Amount sent to burn pool)

export const CAKE_PER_BLOCK = new BigNumber(1)
export const BLOCKS_PER_YEAR = new BigNumber(10512000)
export const ETHERSBIGNUMBER_BLOCKS_PER_YEAR = EthersBigNumber.from(BLOCKS_PER_YEAR.toNumber())
export const PCSCAKE_PER_BLOCK = new BigNumber(40)
export const PCSBLOCKS_PER_YEAR = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24 * 365) // 10512000
export const PCSCAKE_PER_YEAR = PCSCAKE_PER_BLOCK.times(PCSBLOCKS_PER_YEAR)
export const BAKE_PER_BLOCK = new BigNumber(22)
export const BAKE_PER_YEAR = BAKE_PER_BLOCK.times(BLOCKS_PER_YEAR)
export const BELT_PER_BLOCK = new BigNumber(1.178)
export const BELT_PER_YEAR = BELT_PER_BLOCK.times(BLOCKS_PER_YEAR)

// export const PCS_BLOCKS_PER_YEAR = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24 * 365) // 10512000
export const BASE_URL = 'https://cubdefi.com'
export const BASE_EXCHANGE_URL = 'https://exchange.cubdefi.com'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_EXCHANGE_URL}/#/add`
export const BASE_LIQUIDITY_POOL_URL = `${BASE_EXCHANGE_URL}/#/pool`
export const PCS_EXCHANGE_URL = 'https://pancakeswap.finance'
export const PCS_ADD_LIQUIDITY_URL = `${PCS_EXCHANGE_URL}/add`
export const PCS_LIQUIDITY_POOL_URL = `${PCS_EXCHANGE_URL}/pool`
export const BAKERY_EXCHANGE_URL = 'https://www.bakeryswap.org'
export const BAKERY_ADD_LIQUIDITY_URL = `${BAKERY_EXCHANGE_URL}/#/add`
export const BAKERY_LIQUIDITY_POOL_URL = `${BAKERY_EXCHANGE_URL}/#/pool`
export const BELT_EXCHANGE = 'https://belt.fi/bsc'
export const BASE_BSC_SCAN_URL = 'https://bscscan.com'
export const LOTTERY_MAX_NUMBER_OF_TICKETS = 50
export const LOTTERY_TICKET_PRICE = 1
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)
