import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import {Button, Modal, LinkExternal, Card, CardBody, Text, Checkbox, Flex} from '@pancakeswap-libs/uikit'
import ModalActions from 'components/ModalActions'
import ModalInput from 'components/ModalInput'
import useI18n from 'hooks/useI18n'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useVaultApy from "../../../hooks/useVaultApy";
import Message from "../../Kingdoms/LockedKingdom/components/Message";

interface DepositModalProps {
  max: BigNumber
  onConfirm: (amount: string, lockDuration: number) => void
  onDismiss?: () => void
  tokenName?: string
  addLiquidityUrl?: string
  isTokenOnly?: boolean
  isKingdomToken?: boolean
  isAddAdditional?: boolean
  currentStartTime?: number
  currentEndTime?: number
}

const DepositModalLocked: React.FC<DepositModalProps> = ({ max, onConfirm, onDismiss, tokenName = '', addLiquidityUrl, isTokenOnly, isKingdomToken, isAddAdditional, currentEndTime, currentStartTime }) => {
  const [val, setVal] = useState('')
  const [duration, setDuration] = useState(Math.floor((currentEndTime - currentStartTime) / 604800) || 1);
  const [pendingTx, setPendingTx] = useState(false)
  const [extend, setExtend] = useState(false);
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

    let inferredWeeks = 0;

  if (isAddAdditional) {
    inferredWeeks = Math.floor((currentEndTime - currentStartTime) / 604800);
  }


    // takes a number of weeks and gets the date at that time in the format MMM DD, YYYY HH:mm (i.e. Jan 01, 2021 00:00)
    function weeksToFutureDate(weeks = 0) {
        const date = new Date();
        date.setDate(date.getDate() + (weeks * 7));
        return date.toLocaleString('en-US', {month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
    }

  function epochToFutureDate(epoch = 0) {
    const date = new Date(epoch * 1000);
    return date.toLocaleString('en-US', {month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
  }

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const secondsDuration = useMemo(() => Math.max(isAddAdditional && !extend ? 0 : duration * 604800 - (currentStartTime || 0) + (currentEndTime || 0), 0), [currentStartTime, currentEndTime, duration, extend, isAddAdditional]);
  const secondsDurationForContract = useMemo(() => Math.max(isAddAdditional && !extend ? 0 : (new BigNumber(duration * 604800).minus(currentEndTime || 0).plus(currentStartTime || 0).toNumber()), 0), [duration, extend, isAddAdditional, currentEndTime, currentStartTime]);
  const actualWeeks = isAddAdditional && !extend ? inferredWeeks : duration;
  const futureDate = isAddAdditional && !extend ? epochToFutureDate(currentEndTime) : weeksToFutureDate(actualWeeks);

    const youWillEarn = useMemo(() => {
        return new BigNumber(val).times(new BigNumber(getLockedApy(secondsDuration)).div(100)).toFixed(3)
    }, [val, getLockedApy, secondsDuration]);

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
        {isAddAdditional ? null : <ModalInput max="52" symbol="Weeks" onChange={(e) => e.currentTarget.validity.valid && setDuration(Number(e.currentTarget.value))} onSelectMax={() => setDuration(52)} value={duration.toString()} inputTitle="Stake for" showMaxInstead />}
        {/* extend checkbox */}
        {isAddAdditional ? <>
            <Message
                style={{marginBottom: "10px", flexShrink: "1", display: "block", width: "auto"}}
                variant="warning"
                actionInline
            >
                <Text style={{wordWrap: "break-word", overflowWrap: "break-word", wordBreak: "break-word", maxWidth: "450px"}}>
                    Adding more CUB will renew your lock, setting it to remaining duration. Due to shorter lock period, benefits decrease. To keep similar benefits, extend your lock.
                </Text>
            </Message>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <Checkbox key="extend" checked={extend} onChange={() => setExtend(!extend)} />
            <Text fontSize="1.1em" style={{textAlign: "left", flexGrow: "1", marginLeft: "10px"}}>Renew and extend your lock to keep similar benefits.</Text>
        </div></> : null}
        {/* Show APY information for currently selected weeks value */}
        <div style={{marginBottom: "20px"}} />
        <Text><strong>APY:</strong> {lockedApy ? new BigNumber(getLockedApy(secondsDuration)).toFixed(2) : "0.00"}%</Text>
        <Text><strong>You will earn:</strong> {youWillEarn && !Number.isNaN(Number(youWillEarn)) ? youWillEarn : "0.000"} CUB</Text>
        <Text><strong>Duration:</strong> {actualWeeks} Week{actualWeeks === 1 ? "" : "s"}</Text>
        <Text><strong>Unlocks at:</strong> {futureDate}</Text>

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
            await onConfirm(val, secondsDurationForContract)
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
