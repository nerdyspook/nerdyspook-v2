// One canonical origin for metadata, sharing images, sitemap, and redirects.
const defaultUrl = 'https://nerdyspook-v2.vercel.app'
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || defaultUrl
const parsedUrl = new URL(configuredUrl)

if (
  parsedUrl.protocol !== 'https:' ||
  parsedUrl.pathname !== '/' ||
  parsedUrl.search ||
  parsedUrl.hash ||
  parsedUrl.username ||
  parsedUrl.password
) {
  throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTPS origin without a path')
}

module.exports = { siteUrl: parsedUrl.origin, defaultUrl }
