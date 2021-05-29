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
    const fetchBalances = async () => {
      let calls = farmsConfig.map((farm) => {
        if (!farm.isKingdom) {
          return {
            address: getMasterChefAddress(),
            name: 'pendingCub',
            params: [farm.pid, account],
          }
        }
        return null
      })

      calls = calls.filter(call => call)

      const rawResults = await multicall(masterChefABI, calls)
      const results = farmsConfig.map((farm, index) => ({ ...farm, balance: new BigNumber(rawResults[index]) }))

      let callsK = farmsConfig.map((farm) => {
        if (farm.isKingdom) {
          return {
            address: getKingdomsAddress(),
            name: 'pendingCUB',
            params: [farm.pid, account],
          }
        }
        return null
      })

      callsK = callsK.filter(call => call)

      const rawResultsK = await multicall(kingdomsABI, callsK)
      const resultsK = farmsConfig.map((farm, index) => ({ ...farm, balance: new BigNumber(rawResultsK[index]) }))

      setFarmsWithBalances([...results, ...resultsK])
    }

    if (account) {
      fetchBalances()
    }
  }, [account, fastRefresh])

  return farmsWithBalances
}

export default useFarmsWithBalance
