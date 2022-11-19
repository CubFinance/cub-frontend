import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import {Button, Modal, LinkExternal, Flex, Text} from '@pancakeswap-libs/uikit'
import ModalActions from 'components/ModalActions'
import ModalInput from 'components/ModalInput'
import useI18n from 'hooks/useI18n'
import { getFullDisplayBalance } from 'utils/formatBalance'
import Message from "../../Kingdoms/LockedKingdom/components/Message";
import {updatePoolsUserData} from "../../../state/pools";

interface DepositModalProps {
  max: BigNumber
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  addLiquidityUrl?: string
  isTokenOnly?: boolean
  isKingdomToken?: boolean
  showConvertToLocked?: boolean
  onConvertToLocked?: () => void
  maxLockedApy?: string
}

const DepositModal: React.FC<DepositModalProps> = ({ max, onConfirm, onDismiss, tokenName = '', addLiquidityUrl, isTokenOnly, isKingdomToken, showConvertToLocked, onConvertToLocked, maxLockedApy }) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
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
      {showConvertToLocked ? <>
          <Message
          style={{marginTop: "10px", flexShrink: "1", display: "block", width: "auto"}}
          variant="warning"
          actionInline
          action={
              <Flex style={{justifyContent: "flex-end", marginLeft: "10px"}}>
                  <Button
                      variant="primary"
                      onClick={() => {onDismiss(); onConvertToLocked()}}
                  >Convert to Locked
                  </Button>
              </Flex>
          }
      >
          <Text style={{wordWrap: "break-word", overflowWrap: "break-word", wordBreak: "break-word", maxWidth: "250px"}}>
              Locked staking users are earning up to {new BigNumber(maxLockedApy).toFixed(2)}% APY.
          </Text>
      </Message>
      </> : null}
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button
          width="100%"
          disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(val)
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

export default DepositModal
