import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import multicall from 'utils/multicall'
import { getMasterChefAddress, getKingdomsAddress } from 'utils/addressHelpers'
import masterChefABI from 'config/abi/masterchef.json'
import kingdomsABI from 'config/abi/kingdoms.json'
import { farmsConfig } from 'config/constants'
import {BigNumber} from "@ethersproject/bignumber";
import useRefresh from './useRefresh'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([])
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const nonKingdomFarms = farmsConfig.filter(farm => !farm.isKingdom)
    const kingdomFarms = farmsConfig.filter(farm => farm.isKingdom && !farm.isKingdomLocked)
    const fetchAllBalances = async () => {
      const calls = nonKingdomFarms.map((farm) => ({
        address: getMasterChefAddress(),
        name: 'pendingCub',
        params: [farm.pid, account],
      }))

      const res = await multicall(masterChefABI, calls)

      const callsK = kingdomFarms.map((farm) => ({
        address: getKingdomsAddress(),
        name: 'pendingCUB',
        params: [farm.pid, account],
      }))

      const resK = await multicall(kingdomsABI, callsK)

      const resLK = farmsConfig.filter(farm => farm.isKingdomLocked).map(() => [BigNumber.from(0)])

      setBalance([...res, ...resLK, ...resK])
    }

    if (account) {
      fetchAllBalances()
    }
  }, [account, fastRefresh])

  return balances
}

export default useAllEarnings
