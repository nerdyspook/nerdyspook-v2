import Head from 'next/head'
import {
  absoluteUrl,
  getStructuredData,
  pageMetadata,
  SITE_NAME
} from '../libs/seo'

const Seo = ({ path }) => {
  const page = pageMetadata[path]
  const title = page?.title || `Page not found | ${SITE_NAME}`
  const structuredData = getStructuredData(path)

  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="robots"
        content={
          page ? 'index, follow, max-image-preview:large' : 'noindex, follow'
        }
      />
      <meta name="theme-color" content="#202023" />
      <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link
        rel="icon"
        href="/favicon-96x96.png"
        type="image/png"
        sizes="96x96"
      />
      <link
        rel="apple-touch-icon"
        href="/apple-touch-icon.png"
        sizes="180x180"
      />
      <link rel="manifest" href="/site.webmanifest" />
      {page && <meta name="description" content={page.description} />}
      {page && <link rel="canonical" href={absoluteUrl(path)} />}
      {page && <meta property="og:type" content="website" />}
      {page && <meta property="og:site_name" content={SITE_NAME} />}
      {page && <meta property="og:locale" content="en_IN" />}
      {page && <meta property="og:title" content={page.title} />}
      {page && <meta property="og:description" content={page.description} />}
      {page && <meta property="og:url" content={absoluteUrl(path)} />}
      {page && <meta property="og:image" content={absoluteUrl(page.image)} />}
      {page && <meta property="og:image:type" content="image/png" />}
      {page && <meta property="og:image:width" content="1200" />}
      {page && <meta property="og:image:height" content="630" />}
      {page && <meta property="og:image:alt" content={page.imageAlt} />}
      {page && <meta name="twitter:card" content="summary_large_image" />}
      {page && <meta name="twitter:creator" content="@nerdyspook101" />}
      {page && <meta name="twitter:title" content={page.title} />}
      {page && <meta name="twitter:description" content={page.description} />}
      {page && <meta name="twitter:image" content={absoluteUrl(page.image)} />}
      {page && <meta name="twitter:image:alt" content={page.imageAlt} />}
      {structuredData && (
        <script
          type="application/ld+json"
          key="structured-data"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, '\\u003c')
          }}
        />
      )}
    </Head>
  )
}

export default Seo
