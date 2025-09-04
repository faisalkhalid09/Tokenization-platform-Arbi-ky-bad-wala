import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { ErrorProvider } from '../providers/ErrorProvider'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Blockchain Tokenization Platform',
  description: 'A premium platform for creating, managing, and trading ERC-20 tokens with sophisticated blockchain solutions.',
  keywords: ['blockchain', 'tokenization', 'ERC-20', 'DeFi', 'cryptocurrency', 'golden', 'premium'],
  authors: [{ name: 'Premium Tokenization Platform' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#fbbf24',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <Providers>
            <ErrorProvider>
              {children}
            </ErrorProvider>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
