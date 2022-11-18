import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import multicall from 'utils/multicall'
import { getMasterChefAddress, getKingdomsAddress } from 'utils/addressHelpers'
import masterChefABI from 'config/abi/masterchef.json'
import kingdomsABI from 'config/abi/kingdoms.json'
import { farmsConfig } from 'config/constants'
import { FarmConfig } from 'config/constants/types'
import useRefresh from './useRefresh'

export interface FarmWithBalance extends FarmConfig {
  balance: BigNumber
}

const useFarmsWithBalance = () => {
  const [farmsWithBalances, setFarmsWithBalances] = useState<FarmWithBalance[]>([])
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const nonKingdomFarms = farmsConfig.filter(farm => !farm.isKingdom)
    const kingdomFarms = farmsConfig.filter(farm => farm.isKingdom && !farm.isKingdomLocked)
    const fetchBalances = async () => {
      const calls = nonKingdomFarms.map((farm) => ({
        address: getMasterChefAddress(),
        name: 'pendingCub',
        params: [farm.pid, account],
      }))

      const rawResults = await multicall(masterChefABI, calls)
      const results = nonKingdomFarms.map((farm, index) => ({ ...farm, balance: new BigNumber(rawResults[index]) }))

      const callsK = kingdomFarms.map((farm) => ({
        address: getKingdomsAddress(),
        name: 'pendingCUB',
        params: [farm.pid, account],
      }))

      const rawResultsK = await multicall(kingdomsABI, callsK)
      const resultsK = kingdomFarms.map((farm, index) => ({ ...farm, balance: new BigNumber(rawResultsK[index]) }))

      const resultsLK = farmsConfig.filter(farm => farm.isKingdomLocked).map(farm => ({ ...farm, balance: new BigNumber(0) }))

      setFarmsWithBalances([...results, ...resultsLK, ...resultsK])
    }

    if (account) {
      fetchBalances()
    }
  }, [account, fastRefresh])

  return farmsWithBalances
}

export default useFarmsWithBalance
