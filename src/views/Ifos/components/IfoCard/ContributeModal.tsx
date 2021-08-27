import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { Modal, Button, Flex, LinkExternal } from '@pancakeswap-libs/uikit'
import BalanceInput from 'components/Input/BalanceInput'
import useTokenBalance from 'hooks/useTokenBalance'
import { getFullDisplayBalance } from 'utils/formatBalance'

interface Props {
  currency: string
  contract: any
  currencyAddress: string
  onDismiss?: () => void
}

const ContributeModal: React.FC<Props> = ({ currency, contract, currencyAddress, onDismiss }) => {
  const [value, setValue] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const { account } = useWeb3React()
  const balance = getFullDisplayBalance(useTokenBalance(currencyAddress))

  return (
    <Modal title={`Contribute ${currency}`} onDismiss={onDismiss}>
      <BalanceInput
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        symbol={currency}
        max={balance}
        onSelectMax={() => setValue(balance.toString())}
      />
      <Flex justifyContent="space-between" mb="24px">
        <Button variant="secondary" onClick={onDismiss} mr="8px">
          Cancel
        </Button>
        <Button
          disabled={pendingTx}
          onClick={async () => {
            setPendingTx(true)
            await contract.methods
              .deposit(new BigNumber(value).times(new BigNumber(10).pow(18)).toString())
              .send({ from: account })
            setPendingTx(false)
            onDismiss()
          }}
        >
          Confirm
        </Button>
      </Flex>
      <LinkExternal
        href="https://pancakeswap.finance/add/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/0x50D809c74e0B8e49e7B4c65BB3109AbE3Ff4C1C1"
        style={{ margin: 'auto' }}
      >
        {`Get ${currency}`}
      </LinkExternal>
    </Modal>
  )
}

export default ContributeModal
