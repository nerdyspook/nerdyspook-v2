const { siteUrl, defaultUrl } = require('./site.config')

module.exports = {
  reactStrictMode: true,
  async redirects() {
    // This activates only after the custom domain is configured and redeployed.
    // Localhost and Vercel preview hosts never match this rule.
    if (siteUrl === defaultUrl) return []
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: new URL(defaultUrl).hostname }],
        destination: `${siteUrl}/:path*`,
        permanent: true
      }
    ]
  }
}
