'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-2">Page Not Found</p>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>

        <Link href="/">
          <Button className="bg-green-600 hover:bg-green-700">Go Home</Button>
        </Link>
      </div>
    </div>
  )
}
