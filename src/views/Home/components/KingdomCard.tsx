import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Flex, ArrowForwardIcon } from '@pancakeswap-libs/uikit'
import { NavLink } from 'react-router-dom'

const StyledFarmStakingCard = styled(Card)`
  /*background: linear-gradient(#53dee9, #4576d9);*/
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }
`
const CardMidContent = styled(Heading).attrs({ size: 'xl' })`
  line-height: 44px;
`
const KingdomCard = () => {
  return (
    <StyledFarmStakingCard>
      <CardBody>
        <CardMidContent color="primary">Kingdoms</CardMidContent>
        <Heading color="contrast" size="lg">
          CUB&apos;s First Composable Yield Farming Contract
        </Heading>
        <Flex justifyContent="space-between">
          <CardMidContent color="primary">LIVE</CardMidContent>
          <NavLink exact activeClassName="active" to="/kingdoms">
            <ArrowForwardIcon mt={30} color="primary" />
          </NavLink>
        </Flex>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default KingdomCard
