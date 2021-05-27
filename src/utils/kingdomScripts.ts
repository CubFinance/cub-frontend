import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import cakeABI from 'config/abi/cake.json'
import multicall from 'utils/multicall'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { convertSharesToCake } from 'views/Pools/helpers'
import { getCakeVaultContract } from 'utils/contractHelpers'
import makeBatchRequest from 'utils/makeBatchRequest'


// import { BIG_TEN } from 'utils/bigNumber'
import { getAddress, getMasterChefAddress, getKingdomsAddress } from 'utils/addressHelpers'
// import { FarmConfig } from 'config/constants/types'

const PCS_ABI = require('../config/abi/PCS.json')
const PCS_V2_ABI = require('../config/abi/PCS-v2-masterchef.json')

const cakeVaultContract = getCakeVaultContract()

const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'));

export const getCAKEamount = async () => {
  // 0x73feaa1ee314f8c655e354234017be2193c9e24e: Main staking contract
  // 0x77440f4dc7b4ef591e78d460374bd12d3d6bdad8: CAKE Kingdom vault
  const contract = new web3.eth.Contract(PCS_ABI, '0x73feaa1ee314f8c655e354234017be2193c9e24e');
  const call = await contract.methods.userInfo(0, '0x77440f4dc7b4ef591E78d460374bD12d3D6BdAD8').call();
  return call.amount
}

export const getWBNBBUSDAmount = async () => {
  // 0x73feaa1ee314f8c655e354234017be2193c9e24e: Main staking contract
  // 0x701d4f8168b00abbd948d36e11added4e1cac742: WBNB-BUSD Kingdom vault
  const contract = new web3.eth.Contract(PCS_ABI, '0x73feaa1ee314f8c655e354234017be2193c9e24e');
  const call = await contract.methods.userInfo(252, '0x701d4f8168b00abbd948d36e11added4e1cac742').call();
  return call.amount
}

const cakeToken = {
  symbol: 'CAKE',
  address: {
    56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    97: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
  },
  decimals: 18,
  projectLink: 'https://pancakeswap.finance/',
}

const syrup = {
  symbol: 'SYRUP',
  address: {
    56: '0x009cF7bC57584b7998236eff51b98A168DceA9B0',
    97: '0xfE1e507CeB712BDe086f3579d2c03248b2dB77f9',
  },
  decimals: 18,
  projectLink: 'https://pancakeswap.finance/',
}

const busd = {
  symbol: 'BUSD',
  address: {
    56: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    97: '',
  },
  decimals: 18,
  projectLink: 'https://www.paxos.com/busd/',
}

const cakeFarm = {
  pid: 0,
  lpSymbol: 'CAKE',
  lpAddresses: {
    97: '0x9C21123D94b93361a29B2C2EFB3d5CD8B17e0A9e',
    56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
  },
  token: cakeToken,
  quoteToken: busd,
}

const lpAddress = getAddress(cakeFarm.lpAddresses)
const tokenAddress = getAddress(cakeFarm.token.address)

const calls = [
  // Balance of token in the LP contract
  {
    address: tokenAddress,
    name: 'balanceOf',
    params: [lpAddress],
  },
  // Balance of quote token on LP contract
  {
    address: getAddress(cakeFarm.quoteToken.address),
    name: 'balanceOf',
    params: [lpAddress],
  },
  // Balance of LP tokens in the master chef contract
  {
    address: tokenAddress, // ?
    name: 'balanceOf',
    params: ['0x73feaa1ee314f8c655e354234017be2193c9e24e'],
  },
  // Total supply of LP tokens
  {
    address: lpAddress,
    name: 'totalSupply',
  },
]

export const getCakeFarmValues = async () => {
  // const contract = new web3.eth.Contract(PCS_V2_ABI, cakeFarm.lpAddresses['56']);
  /* const multiResult = await multicall(erc20, calls)

  const [
    tokenBalanceLP,
    quoteTokenBalanceLP,
    lpTokenBalanceMC,
    lpTotalSupply,
  ] = multiResult

  console.log('tokenBalanceLP', new BigNumber(tokenBalanceLP).div(DEFAULT_TOKEN_DECIMAL).toNumber())
  console.log('quoteTokenBalanceLP', new BigNumber(quoteTokenBalanceLP).div(DEFAULT_TOKEN_DECIMAL).toNumber())
  console.log('lpTokenBalanceMC', new BigNumber(lpTokenBalanceMC).div(DEFAULT_TOKEN_DECIMAL).toNumber())
  console.log('lpTotalSupply', new BigNumber(lpTotalSupply).div(DEFAULT_TOKEN_DECIMAL).toNumber()) */

  // const nonBnbPools = poolsConfig.filter((p) => p.stakingToken.symbol !== 'BNB')
  //
  // const callsNonBnbPools = nonBnbPools.map((poolConfig) => {
  //   return {
  //     address: getAddress(poolConfig.stakingToken.address),
  //     name: 'balanceOf',
  //     params: [getAddress(poolConfig.contractAddress)],
  //   }
  // })


  const callsNonBnbPools = [
    {
      address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      name: 'balanceOf',
      params: ['0x73feaa1eE314F8c655E354234017bE2193C9E24E'],
    },
  ]

  const [balanceMaster] = await multicall(cakeABI, callsNonBnbPools)
  // return balanceMaster

  const [sharePrice, shares] = await makeBatchRequest([
    cakeVaultContract.methods.getPricePerFullShare().call,
    cakeVaultContract.methods.totalShares().call,
  ])

  const totalSharesAsBigNumber = new BigNumber(shares as string)
  const sharePriceAsBigNumber = new BigNumber(sharePrice as string)
  const totalCakeInVaultEstimate = convertSharesToCake(totalSharesAsBigNumber, sharePriceAsBigNumber)
  const totalCakeInVault = totalCakeInVaultEstimate.cakeAsBigNumber.toJSON()

  const totalManualCake = new BigNumber(balanceMaster).minus(new BigNumber(totalCakeInVault))

  console.log('totalManualCake', new BigNumber(totalManualCake).div(DEFAULT_TOKEN_DECIMAL).toNumber())
  // console.log('totalCakeInVault',new BigNumber(totalCakeInVault).div(DEFAULT_TOKEN_DECIMAL).toNumber())
  // console.log('balanceMaster', new BigNumber(balanceMaster).div(DEFAULT_TOKEN_DECIMAL).toNumber())
  // console.log('balanceAutoCake', new BigNumber(balanceAutoCake).div(DEFAULT_TOKEN_DECIMAL).toNumber())
  //
  // const cakeManual =  new BigNumber(balanceMaster).div(DEFAULT_TOKEN_DECIMAL).minus(new BigNumber(balanceAutoCake).div(DEFAULT_TOKEN_DECIMAL))
  //
  // console.log('cakeManual', new BigNumber(cakeManual).toNumber())
  // const tokenAmount = farmConfig.isKingdomToken ? new BigNumber(kingdomSupply).div(DEFAULT_TOKEN_DECIMAL) : new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(tokenDecimals));
  //
  // const tokenPriceVsQuote = new BigNumber(quoteTokenBalanceLP).div(new BigNumber(tokenBalanceLP))
  //
  // const lpTotalInQuoteToken = tokenAmount.times(tokenPriceVsQuote)
}
