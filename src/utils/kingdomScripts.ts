import Web3 from 'web3'
// import erc20 from 'config/abi/erc20.json'
// import multicall from 'utils/multicall'
// import { DEFAULT_TOKEN_DECIMAL } from 'config'
// import BigNumber from 'bignumber.js'

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

export const getWBNBETHAmount = async () => {
  const contract = new web3.eth.Contract(PCS_ABI, '0x73feaa1ee314f8c655e354234017be2193c9e24e');
  const call = await contract.methods.userInfo(261, '0x3582933accc5732484138a2dd61fcdd02d0a021c').call();
  return call.amount
}

export const getWBNBDOTAmount = async () => {
  const contract = new web3.eth.Contract(PCS_ABI, '0x73feaa1ee314f8c655e354234017be2193c9e24e');
  const call = await contract.methods.userInfo(255, '0x03e48360dc132a1838492b6870c98d2bd895ea9a').call();
  return call.amount
}

export const getCUBAmount = async () => {
  const contract = new web3.eth.Contract(PCS_ABI, '0x227e79c83065edb8b954848c46ca50b96cb33e16');
  const call = await contract.methods.userInfo(12, '0xc2adf5fc4d4e6c2cc97f8190acbdf808c689117c').call();
  return call.amount
}
