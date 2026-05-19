/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(), microphone=(), camera=(), payment=()'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
]

const nextConfig = {
  // Production optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  
  // ESLint and TypeScript
  eslint: {
    // Only run ESLint in development, not during builds
    dirs: ['pages', 'components', 'lib', 'app'],
  },
  typescript: {
    // TypeScript should be checked, not ignored
    tsconfigPath: './tsconfig.json',
  },

  // Image optimization
  images: {
    // Support for modern image formats
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Additional headers for API routes
      {
        source: '/api/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
    ]
  },

  // Compression
  compress: true,

  // Generate ETags for cache validation
  generateEtags: true,

  // Experimental optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
