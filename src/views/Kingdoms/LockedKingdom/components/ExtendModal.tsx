import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import {Button, Modal, LinkExternal, Card, CardBody, Text, Checkbox, Flex} from '@pancakeswap-libs/uikit'
import ModalActions from 'components/ModalActions'
import ModalInput from 'components/ModalInput'
import useI18n from 'hooks/useI18n'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useVaultApy from "../../../../hooks/useVaultApy";
import Message from "./Message";

interface DepositModalProps {
    amount: string,
    onConfirm: (amount: string, lockDuration: number) => void
    onDismiss?: () => void
    tokenName?: string
    existingStakeDuration?: number
    existingStakeSecondsRemain?: number
    addLiquidityUrl?: string
    title?: string
}

const ExtendModal: React.FC<DepositModalProps> = ({ amount, onConfirm, onDismiss, tokenName = '', addLiquidityUrl, title, existingStakeDuration , existingStakeSecondsRemain}) => {
    const [duration, setDuration] = useState(1);
    const [pendingTx, setPendingTx] = useState(false)
    const TranslateString = useI18n()
    const {lockedApy, getLockedApy} = useVaultApy();

    const alreadyStakingDuration = Math.round(existingStakeDuration || 0);

    let warningMessage = '';

    if (title === 'Convert to Lock' || title === 'Renew') {
        warningMessage = 'You will be able to withdraw the staked CUB and profit only when the staking position is unlocked.';
    }

    // takes a number of weeks and gets the date at that time in the format MMM DD, YYYY HH:mm (i.e. Jan 01, 2021 00:00)
    function secondsToFutureDate(seconds = 0) {
        const date = new Date();
        date.setSeconds(date.getSeconds() + seconds);
        return date.toLocaleString('en-US', {month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
    }

    const secondsDuration = duration * 604800;
    const futureDate = secondsToFutureDate(new BigNumber(duration).times(604800).toNumber() + Math.max(existingStakeSecondsRemain || 0, 0));

    const youWillEarn = useMemo(() => {
        return new BigNumber(amount).times(new BigNumber(getLockedApy(secondsDuration)).div(100)).toFixed(3)
    }, [amount, getLockedApy, secondsDuration]);

    let modalInputText = "Stake for";

    if (title === "Extend" || title === "Renew") {
        modalInputText = "Extend for";
    }

    const maxAddWeeks = (52 - alreadyStakingDuration).toString();

    if (maxAddWeeks === "0") {
        warningMessage = "You have reached the maximum locked staking time, please convert your stake to flex and then extend it in order to continue earning locked rewards."
    }

    return (
        <Modal title={title} onDismiss={onDismiss}>
            <Text>Amount: {Number(amount).toFixed(3)} CUB</Text>
            <div style={{marginBottom: "20px"}} />
            <ModalInput max={maxAddWeeks} symbol="Weeks" onChange={(e) => e.currentTarget.validity.valid && setDuration(Number(e.currentTarget.value))} onSelectMax={() => setDuration(Number(maxAddWeeks))} value={duration.toString()} inputTitle={modalInputText} showMaxInstead />
            {/* extend checkbox */}
            {warningMessage !== "" ? <>
                <Message
                    style={{marginBottom: "10px", flexShrink: "1", display: "block", width: "auto"}}
                    variant="warning"
                    actionInline
                >
                    <Text style={{wordWrap: "break-word", overflowWrap: "break-word", wordBreak: "break-word", maxWidth: "450px"}}>
                        {warningMessage}
                    </Text>
                </Message>
                </> : null}
            {/* Show APY information for currently selected weeks value */}
            <div style={{marginBottom: "20px"}} />
            <Text><strong>APY:</strong> {lockedApy ? new BigNumber(getLockedApy(secondsDuration)).toFixed(2) : "0.00"}%</Text>
            <Text><strong>You will earn:</strong> {youWillEarn && !Number.isNaN(Number(youWillEarn)) ? youWillEarn : "0.000"} CUB</Text>
            <Text><strong>Duration:</strong> {duration} Week{duration === 1 ? "" : "s"}</Text>
            <Text><strong>Unlocks at:</strong> {futureDate}</Text>

            <ModalActions>
                <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
                    {TranslateString(462, 'Cancel')}
                </Button>
                <Button
                    width="100%"
                    disabled={pendingTx}
                    onClick={async () => {
                        setPendingTx(true)
                        await onConfirm("0", secondsDuration)
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

export default ExtendModal
