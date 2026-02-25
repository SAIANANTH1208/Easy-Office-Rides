export function normalizePhone(input: string) {
  const raw = input.trim()
  if (!raw) return ''
  if (raw.startsWith('+')) return raw
  // Default to India country code if not provided
  return `+91${raw}`
}
