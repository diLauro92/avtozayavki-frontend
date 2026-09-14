export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')

  if (digits.length !== 11) return phone

  const country = digits[0] === '8' ? '+7' : `+${digits[0]}`

  return `${country} ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso)

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export const isValidPhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '')

  return /^7\d{10}$/.test(digits)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
