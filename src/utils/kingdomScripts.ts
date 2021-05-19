import Web3 from 'web3'

const PSC_ABI = require('../config/abi/PCS.json')

const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'));

export const getCAKEamount = async () => {
  // 0x73feaa1ee314f8c655e354234017be2193c9e24e: Main staking contract
  // 0x77440f4dc7b4ef591e78d460374bd12d3d6bdad8: CAKE Kingdom vault
  const contract = new web3.eth.Contract(PSC_ABI, '0x73feaa1ee314f8c655e354234017be2193c9e24e');
  const call = await contract.methods.userInfo(0, '0x77440f4dc7b4ef591E78d460374bD12d3D6BdAD8').call();
  return call.amount
}

export const getWBNBBUSDAmount = async () => {
  // 0x73feaa1ee314f8c655e354234017be2193c9e24e: Main staking contract
  // 0x701d4f8168b00abbd948d36e11added4e1cac742: WBNB-BUSD Kingdom vault
  const contract = new web3.eth.Contract(PSC_ABI, '0x73feaa1ee314f8c655e354234017be2193c9e24e');
  const call = await contract.methods.userInfo(252, '0x701d4f8168b00abbd948d36e11added4e1cac742').call();
  return call.amount
}
