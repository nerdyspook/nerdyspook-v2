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

// Add a local public path (for example, /audio/background.mp3) or an HTTPS
// audio URL to show the player. An empty source keeps it hidden.
const music = {
  src: '/audio/background.mp3',
  volume: 0.2
}

module.exports = { siteUrl: parsedUrl.origin, defaultUrl, music }
