import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal } from '@pancakeswap-libs/uikit'
import ModalActions from 'components/ModalActions'
import ModalInput from 'components/ModalInput'
import useI18n from 'hooks/useI18n'
import { getFullDisplayBalance } from 'utils/formatBalance'
import {DEFAULT_TOKEN_DECIMAL} from "../../../../config";

interface WithdrawModalProps {
  onConfirm: (shares: string) => void
  onDismiss?: () => void
  tokenName?: string
  isTokenOnly?: boolean
  isKingdomToken?: boolean
  shares?: BigNumber
  performanceFee?: BigNumber
  hasWithdrawFee?: boolean
  pricePerFullShare?: BigNumber
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onConfirm, onDismiss, tokenName = '', isTokenOnly, isKingdomToken, hasWithdrawFee, performanceFee, shares, pricePerFullShare }) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()

  const fullBalance = useMemo(() => {
    return new BigNumber(shares?.minus(performanceFee).multipliedBy(pricePerFullShare.div(DEFAULT_TOKEN_DECIMAL)).dividedBy(DEFAULT_TOKEN_DECIMAL).toFixed(18)) || new BigNumber(0);
  }, [shares, performanceFee, pricePerFullShare]);

  function balanceToShares(balance: string) {
        const balanceBigNumber = new BigNumber(balance);
        const sharesToWithdraw = balanceBigNumber.multipliedBy(DEFAULT_TOKEN_DECIMAL).dividedBy(pricePerFullShare).multipliedBy(DEFAULT_TOKEN_DECIMAL);
        const sharesToWithdrawWithFee = sharesToWithdraw.plus(performanceFee.times(balanceBigNumber.div(fullBalance)));

        if (sharesToWithdrawWithFee.isGreaterThan(shares.times(0.999))) {
            return shares.toString();
        }

        return sharesToWithdrawWithFee.toFixed(0);
  }

  const valNumber = new BigNumber(val)

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance.toString())
  }, [fullBalance, setVal])

  return (
    <Modal title={TranslateString(1126, isTokenOnly || isKingdomToken ? 'Unstake tokens' : 'Unstake LP tokens')} onDismiss={onDismiss}>
      <ModalInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={new BigNumber(fullBalance.toFixed(18)).toString()}
        symbol={tokenName}
        inputTitle={TranslateString(588, 'Unstake')}
      />
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button
          disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalance)}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(balanceToShares(val))
            setPendingTx(false)
            onDismiss()
          }}
          width="100%"
        >
          {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default WithdrawModal
