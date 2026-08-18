export const formatLKR = (value: number) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(value)

export const formatNumber = (value: number) => new Intl.NumberFormat('en-LK').format(value)
