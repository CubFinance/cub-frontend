import Web3 from 'web3'
import axios from 'axios'

const PCS_ABI = require('config/abi/PCS.json')
const BAKERY_ABI = require('config/abi/bakery.json')
const BELT_ABI = require('config/abi/belt.json')

const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'));

export const getCAKEamount = async () => {
  // 0x73feaa1ee314f8c655e354234017be2193c9e24e: Main staking contract
  // 0x77440f4dc7b4ef591e78d460374bd12d3d6bdad8: CAKE LockedKingdom vault
  const contract = new web3.eth.Contract(PCS_ABI, '0x73feaa1ee314f8c655e354234017be2193c9e24e');
  const call = await contract.methods.userInfo(0, '0x77440f4dc7b4ef591E78d460374bD12d3D6BdAD8').call();
  return call.amount
}

export const getWBNBBUSDAmount = async () => {
  // 0x73feaa1ee314f8c655e354234017be2193c9e24e: Main staking contract
  // 0x701d4f8168b00abbd948d36e11added4e1cac742: WBNB-BUSD LockedKingdom vault
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

export const getBTCBNBBakeryAmount = async () => {
  const contract = new web3.eth.Contract(BAKERY_ABI, '0x20ec291bb8459b6145317e7126532ce7ece5056f');
  const call = await contract.methods.poolUserInfoMap('0x58521373474810915b02fe968d1bcbe35fc61e09', '0xbdc40a031f6908a8203fb1c75bb2b9c4abf59e2e').call();
  return call.amount
}

export const getBTCBNBAmount = async () => {
  const contract = new web3.eth.Contract(PCS_ABI, '0x73feaa1ee314f8c655e354234017be2193c9e24e');
  const call = await contract.methods.userInfo(262, '0xcd0778d48e3aa98c91633d844d1d83c7be282d5f').call();
  return call.amount
}

export const getSPSBNBAmount = async () => {
  const contract = new web3.eth.Contract(PCS_ABI, '0x73feaa1ee314f8c655e354234017be2193c9e24e');
  const call = await contract.methods.userInfo(432, '0xc18cd88a97f39b1db91990c79227223ae6f5efb2').call();
  return call.amount
}

/*
 * BELT vaults
 */

export const getBTCAmount = async () => {
  const contract = new web3.eth.Contract(BELT_ABI, '0xD4BbC80b9B102b77B21A06cb77E954049605E6c1');
  const call = await contract.methods.userInfo(7, '0x3f1b0319E2EbeD04D5e2ce367393914bBf8f59f5').call();
  return call.shares
}

export const getETHAmount = async () => {
  const contract = new web3.eth.Contract(BELT_ABI, '0xD4BbC80b9B102b77B21A06cb77E954049605E6c1');
  const call = await contract.methods.userInfo(8, '0x3f2C7e9cf2e3a718eedf52403e0FB71b9AfC51b0').call();
  return call.shares
}

export const getUSDAmount = async () => {
  const contract = new web3.eth.Contract(BELT_ABI, '0xD4BbC80b9B102b77B21A06cb77E954049605E6c1');
  const call = await contract.methods.userInfo(3, '0x5860046Ccf3ab8D840F1ac15A547E0c2bBECA6F0').call();
  return call.shares
}

export const getBeltAPR = async () => {
  return axios.get(process.env.REACT_APP_BELT_SCRAPE, { timeout: 3000 }).then(result => result.data).catch(() => {
    return { btc: '5', eth: '5', stable: '10', stableRate: '0.97' }
  })
}
