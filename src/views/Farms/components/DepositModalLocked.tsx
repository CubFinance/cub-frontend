import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import {Button, Modal, LinkExternal, Card, CardBody, Text} from '@pancakeswap-libs/uikit'
import ModalActions from 'components/ModalActions'
import ModalInput from 'components/ModalInput'
import useI18n from 'hooks/useI18n'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useVaultApy from "../../../hooks/useVaultApy";

interface DepositModalProps {
  max: BigNumber
  onConfirm: (amount: string, lockDuration: number) => void
  onDismiss?: () => void
  tokenName?: string
  addLiquidityUrl?: string
  isTokenOnly?: boolean
  isKingdomToken?: boolean
}

const DepositModalLocked: React.FC<DepositModalProps> = ({ max, onConfirm, onDismiss, tokenName = '', addLiquidityUrl, isTokenOnly, isKingdomToken }) => {
  const [val, setVal] = useState('')
  const [duration, setDuration] = useState(1);
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  const {lockedApy, getLockedApy} = useVaultApy();
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const valNumber = new BigNumber(val)
  const fullBalanceNumber = new BigNumber(fullBalance)

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <Modal title={TranslateString(1068, isTokenOnly || isKingdomToken ? 'Stake tokens' : 'Stake LP tokens')} onDismiss={onDismiss}>
      <ModalInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
        addLiquidityUrl={addLiquidityUrl}
        inputTitle={TranslateString(1070, 'Stake')}
      />
        <div style={{marginBottom: "20px"}} />
        {/* add number of weeks input here */}
        <ModalInput max="52" symbol="Weeks" onChange={(e) => e.currentTarget.validity.valid && setDuration(Number(e.currentTarget.value))} onSelectMax={() => setDuration(52)} value={duration.toString()} inputTitle="Stake for" showMaxInstead />
        <div style={{marginBottom: "20px"}} />
        {/* Show APY information for currently selected weeks value */}
        <div style={{marginBottom: "20px"}} />
        <Text>APR: {lockedApy ? getLockedApy(duration) : "0.00"}%</Text>
        <Text>Duration: {duration} Weeks</Text>

        {/* Locked warning */}
        <div style={{marginBottom: "20px"}} />
        <Text color="failure">
            <span role="img" aria-label="warning">
                ⚠️
            </span>
            &nbsp;Locked funds cannot be withdrawn until the end of the lock period.
        </Text>

        <ModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button
          width="100%"
          disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(val, new BigNumber(duration).multipliedBy(86400).toNumber())
            setPendingTx(false)
            onDismiss()
          }}
        >
          {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
        </Button>
      </ModalActions>
      <LinkExternal href={addLiquidityUrl} style={{ alignSelf: 'center' }}>
        {TranslateString(999, 'Get')} {tokenName}
      </LinkExternal>
    </Modal>
  )
}

export default DepositModalLocked
