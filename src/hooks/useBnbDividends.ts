import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import useRefresh from './useRefresh'

const useBnbDividends = () => {
  const [bnbDividends, setBnbDividends] = useState<any>()
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBnbDividends = async () => {
      const res = await axios.get(`https://bnb.fbslo.net/?address=${account}`, { timeout: 7000 }).then(result => result.data).catch(() => {
        return { error: true }
      })

      setBnbDividends(res)
    }

    if (account) {
      fetchBnbDividends()
    }
  }, [account, fastRefresh])

  return bnbDividends
}

export default useBnbDividends
