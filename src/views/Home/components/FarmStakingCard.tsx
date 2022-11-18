import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button, Flex } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import useI18n from 'hooks/useI18n'
import { useAllHarvest } from 'hooks/useHarvest'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import useBnbDividends from 'hooks/useBnbDividends'
import { useClaim} from 'hooks/useClaim'
import UnlockButton from 'components/UnlockButton'
import CakeHarvestBalance from './CakeHarvestBalance'
import CakeWalletBalance from './CakeWalletBalance'
import BNBHarvestBalance from './BNBHarvestBalance'

const StyledFarmStakingCard = styled(Card)`
  background-image: url('/images/cub/cub-bg.png');
  background-repeat: no-repeat;
  background-position: top right;
  min-height: 376px;
`

const Block = styled.div`
  margin-bottom: 16px;
`

const CardImage = styled.img`
  margin-bottom: 16px;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`

const Actions = styled.div`
  margin-top: 24px;
`

const FarmedStakingCard = () => {
  const [pendingTx, setPendingTx] = useState(false)
  const [pendingTxDivs, setPendingTxDivs] = useState(false)
  const { account } = useWeb3React()
  const TranslateString = useI18n()
  const farmsWithBalance = useFarmsWithBalance()
  console.log(farmsWithBalance);
  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 10000)

  const bnbDividends = useBnbDividends()
  const { onClaim } = useClaim(bnbDividends || {})
  const bnbRewards = bnbDividends && bnbDividends.amount ? bnbDividends.amount : 0

  const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => {
    const { pid, isKingdom } = farmWithBalance
    return { pid, isKingdom }
  }))

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    try {
      await onReward()
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [onReward])

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <Heading size="xl" mb="24px">
          {TranslateString(542, 'Farms & Staking')}
        </Heading>
        <CardImage src="/images/cub/token.svg" alt="cub logo" width={64} height={64} />
        <Flex justifyContent='space-between'>
          <div>
            <Block>
              <Label>{TranslateString(544, 'CUB to Harvest')}:</Label>
              <CakeHarvestBalance />
            </Block>
            <Block>
              <Label>{TranslateString(546, 'CUB in Wallet')}:</Label>
              <CakeWalletBalance />
            </Block>
            <Actions>
              {account ? (
                <Button
                  id="harvest-all"
                  disabled={balancesWithValue.length <= 0 || pendingTx}
                  onClick={harvestAllFarms}
                  width="100%"
                >
                  {pendingTx
                    ? TranslateString(548, 'Collecting CUB')
                    : TranslateString(532, `Harvest all (${balancesWithValue.length})`, {
                        count: balancesWithValue.length,
                      })}
                </Button>
              ) : (
                <UnlockButton width="100%" />
              )}
            </Actions>
          </div>
          <div>
            <Block>
              <Label>BNB Dividends <br />for Staking CUB:</Label>
              <BNBHarvestBalance bnbDividends={bnbDividends} />
            </Block>
            <Actions>
              {account ? (
                <Button
                  disabled={bnbRewards === 0 || pendingTxDivs}
                  onClick={async () => {
                    setPendingTxDivs(true)
                    await onClaim()
                    setPendingTxDivs(false)
                  }}
                >
                  Claim BNB
                </Button>
              ) : (
                <UnlockButton width="100%" />
              )}
            </Actions>
          </div>
        </Flex>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default FarmedStakingCard
