import { absoluteUrl, publishedPaths } from '../libs/seo'

export const getServerSideProps = ({ res }) => {
  const urls = publishedPaths
    .map(path => `  <url><loc>${absoluteUrl(path)}</loc></url>`)
    .join('\n')
  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600')
  res.end(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  )
  return { props: {} }
}

export default function Sitemap() {
  return null
}
