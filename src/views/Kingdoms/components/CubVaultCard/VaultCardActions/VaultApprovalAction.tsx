import { Button, AutoRenewIcon, Skeleton } from '@pancakeswap-libs/uikit'
import React from 'react'

interface ApprovalActionProps {
  setLastUpdated: () => void
  isLoading?: boolean
}

const VaultApprovalAction: React.FC<React.PropsWithChildren<ApprovalActionProps>> = ({
  isLoading = false,
  setLastUpdated,
}) => {
  // const { t } = useTranslation()

  // const { handleApprove, pendingTx } = useVaultApprove(vaultKey, setLastUpdated)

  return null;

  /* return (
    <>
      {isLoading ? (
        <Skeleton width="100%" height="52px" />
      ) : (
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          disabled={pendingTx}
          onClick={handleApprove}
          width="100%"
        >
          {t('Enable')}
        </Button>
      )}
    </>
  ) */
}

export default VaultApprovalAction
