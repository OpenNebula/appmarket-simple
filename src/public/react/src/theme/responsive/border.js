import { scale } from '@/theme/brand'

const width = {
  none: scale[0],
  sm: scale[25],
  md: scale[50],
  lg: scale[100],
  xlg: scale[200],
}

const radius = {
  none: scale[0],
  xs: scale[25],
  md: scale[50],
  lg: scale[100],
  xlg: scale[150],
  '2xl': scale[200],
  '3xl': scale[400],
  '4xl': scale[500],
  '5xl': scale[600],
  round: scale[1500],
}

export const border = {
  width,
  radius,
}