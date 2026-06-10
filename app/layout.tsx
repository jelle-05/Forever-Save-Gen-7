import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Forever Save',
  description: 'Volg je Pokémon Ultra Sun/Ultra Moon "forever save" — shiny dex, living dex, hunts en meer.',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/icon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Forever Save',
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${geist.variable} h-full`} style={{ backgroundColor: '#ffffff', colorScheme: 'light' }}>
      <body className="h-full overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
        {children}
      </body>
    </html>
  )
}
