export const formatNumber = (phone: string, countryCode: string): string => {
  return `${countryCode}${phone}`
}

export const generateOTP = (): string => {
  return Math.floor(Math.random() * 900000).toString();
}
