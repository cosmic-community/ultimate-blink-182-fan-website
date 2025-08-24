import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CosmicBadge from '@/components/CosmicBadge'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ultimate blink-182 Fan Website',
  description: 'The ultimate destination for blink-182 fans! Explore the complete discography, band history, member profiles, and tour archive of the iconic pop-punk band.',
  keywords: 'blink-182, blink 182, pop punk, Tom DeLonge, Mark Hoppus, Travis Barker, Enema of the State, All the Small Things',
  authors: [{ name: 'blink-182 Fans' }],
  openGraph: {
    title: 'Ultimate blink-182 Fan Website',
    description: 'The ultimate destination for blink-182 fans! Explore the complete discography, band history, member profiles, and tour archive.',
    type: 'website',
    images: [
      {
        url: 'https://imgix.cosmicjs.com/ea0fc640-8104-11f0-8dcc-651091f6a7c0-photo-1493225457124-a3eb161ffa5f-1756051855378.jpg?w=1200&h=630&fit=crop&auto=format,compress',
        width: 1200,
        height: 630,
        alt: 'blink-182 Fan Website'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ultimate blink-182 Fan Website',
    description: 'The ultimate destination for blink-182 fans!',
    images: ['https://imgix.cosmicjs.com/ea0fc640-8104-11f0-8dcc-651091f6a7c0-photo-1493225457124-a3eb161ffa5f-1756051855378.jpg?w=1200&h=630&fit=crop&auto=format,compress']
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en">
      <head>
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}