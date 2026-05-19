import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Smart Recipe Generator - AI-Powered Recipe Creation',
  description:
    'Transform your leftover ingredients into delicious meals! Use AI to generate personalized recipes. Upload a photo or list ingredients to get started.',
  keywords: [
    'recipe generator',
    'AI recipes',
    'ingredient detection',
    'cooking assistant',
    'food waste reduction',
    'meal planning',
  ],
  authors: [{ name: 'Recipe Generator' }],
  creator: 'Recipe Generator Team',
  publisher: 'Recipe Generator',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://recipe-generator.com',
    title: 'Smart Recipe Generator',
    description: 'AI-powered recipe generation from ingredients',
    siteName: 'Recipe Generator',
    images: [
      {
        url: 'https://recipe-generator.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Recipe Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Recipe Generator',
    description: 'AI-powered recipe generation from ingredients',
    creator: '@recipegenai',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#16a34a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
