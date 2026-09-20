import { absoluteUrl } from '../libs/seo'

export const getServerSideProps = ({ res }) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600')
  res.end(
    `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`
  )
  return { props: {} }
}

export default function Robots() {
  return null
}
