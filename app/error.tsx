'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
        <p className="text-gray-600 mb-2">Something went wrong</p>
        <p className="text-sm text-gray-500 mb-8">{error.message || 'An unexpected error occurred'}</p>

        <div className="flex gap-4 justify-center">
          <Button onClick={reset} className="bg-green-600 hover:bg-green-700">
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
