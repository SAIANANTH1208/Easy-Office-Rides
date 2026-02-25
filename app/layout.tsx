import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Easy Office Rides - Premium Corporate Car Rental in Bangalore',
  description: 'Premium Corporate Car Rental Solutions in Bangalore. Reliable, comfortable, and professional transportation for your business needs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
