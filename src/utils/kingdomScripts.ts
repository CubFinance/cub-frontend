import Web3 from 'web3'
import erc20 from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import BigNumber from 'bignumber.js'

const PCS_ABI = require('config/abi/PCS.json')

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

export const getKingdomPCSBalance = async (address, contract) => {
  /* const calls = [
    {
      address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', // Cake
      name: 'balanceOf',
      params: ['0x73feaa1eE314F8c655E354234017bE2193C9E24E'], // PCSv2 masterchef
    },
    {
      address: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16', // BNB-BUSD LP
      name: 'balanceOf',
      params: ['0x73feaa1eE314F8c655E354234017bE2193C9E24E'], // PCSv2 masterchef
    },
  ] */
  const calls = [
    {
      address,
      name: 'balanceOf',
      params: [contract],
    }
  ]

  const [lpTokenBalanceMC] = await multicall(erc20, calls)

  console.log('lpTokenBalanceMC', new BigNumber(lpTokenBalanceMC).div(DEFAULT_TOKEN_DECIMAL).toNumber())
}
