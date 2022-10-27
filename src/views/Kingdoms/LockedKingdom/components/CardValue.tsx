import React, { useEffect, useRef } from 'react'
import { useCountUp } from 'react-countup'
import { Text } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'

interface CardValueProps {
  value: number
  decimals?: number
  fontSize?: string
  prefix?: string
}

const StyledText = styled(Text)`
  line-height: 1.5;

`

const CardValue: React.FC<CardValueProps> = ({ value, decimals, prefix, fontSize = '16px', }) => {
  const { countUp, update } = useCountUp({
    start: 0,
    end: value,
    duration: 1,
    separator: ',',
    decimals:
      // eslint-disable-next-line no-nested-ternary
      decimals !== undefined ? decimals : value < 0 ? 4 : value > 1e5 ? 0 : 3,
  })

  const updateValue = useRef(update)

  useEffect(() => {
    updateValue.current(value)
  }, [value, updateValue])

  return (
    <StyledText fontSize={fontSize} >
      {prefix}{countUp}
    </StyledText>
  )
}

export default CardValue
