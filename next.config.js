/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-DNS-Prefetch-Control', value: 'off' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=(self)',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          "object-src 'none'",
          "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://*.stripe.com",
          "font-src 'self' https://fonts.gstatic.com data:",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://challenges.cloudflare.com https://*.i.posthog.com",
          "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.stripe.com https://*.i.posthog.com https://challenges.cloudflare.com",
          "frame-src https://js.stripe.com https://hooks.stripe.com https://challenges.cloudflare.com",
          "upgrade-insecure-requests",
        ].join('; '),
      },
    ]

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
