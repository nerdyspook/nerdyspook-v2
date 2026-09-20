import siteConfig from '../site.config'

export const SITE_URL = siteConfig.siteUrl
export const SITE_NAME = 'NerdySpook'
export const absoluteUrl = path => new URL(path, `${SITE_URL}/`).href

// Only published pages belong here. This is also the sitemap's source of truth.
export const pageMetadata = {
  '/': {
    title: 'Susanto Mahato — Frontend Engineer | NerdySpook',
    description:
      'Susanto Mahato is a frontend engineer in Bengaluru, India, building web and mobile experiences with React, Next.js, and TypeScript. Explore his work and writing.',
    name: 'Susanto Mahato',
    type: 'ProfilePage',
    image: '/og/home.png',
    imageAlt:
      'Susanto Mahato — Frontend Engineer. Design. Build. Refine. NerdySpook.'
  },
  '/projects': {
    title: 'Frontend Projects by Susanto Mahato | NerdySpook',
    description:
      'Explore frontend projects by Susanto Mahato: Volt ecommerce, Frontend-Prep, Kal-UI components, Revisit video library, and Noter.',
    name: 'Projects',
    type: 'CollectionPage',
    image: '/og/projects.png',
    imageAlt:
      'Frontend projects by Susanto Mahato — interfaces, components, and applications.'
  },
  '/blogs': {
    title: 'Writing on Git and CSS by Susanto Mahato | NerdySpook',
    description:
      'Read articles by Susanto Mahato on semantic Git commit messages and CSS pseudo-elements, with links to the full articles on Hashnode.',
    name: 'Writing',
    type: 'CollectionPage',
    image: '/og/writing.png',
    imageAlt:
      'Writing by Susanto Mahato — notes on Git, CSS, and frontend development.'
  },
  '/projects/volt': {
    title: 'Volt — Shoe Ecommerce Project | NerdySpook',
    description:
      'Volt is a shoe ecommerce app by Susanto Mahato with search, filters, and user authentication, built with React, React Router, Kal-UI, and SASS.',
    name: 'Volt',
    type: 'WebPage',
    image: '/og/volt.png',
    imageAlt:
      'Volt — a shoe ecommerce project by Susanto Mahato. Search, filters, and authentication.'
  }
}

export const publishedPaths = Object.keys(pageMetadata)

export const getStructuredData = path => {
  const page = pageMetadata[path]
  if (!page) return null
  const url = absoluteUrl(path)
  const personId = absoluteUrl('/#person')
  const websiteId = absoluteUrl('/#website')
  const graph = [
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: absoluteUrl('/'),
      name: SITE_NAME,
      alternateName: 'Susanto Mahato',
      inLanguage: 'en',
      publisher: { '@id': personId }
    },
    {
      '@type': 'Person',
      '@id': personId,
      name: 'Susanto Mahato',
      alternateName: 'NerdySpook',
      url: absoluteUrl('/'),
      image: absoluteUrl('/images/susanto.jpg'),
      jobTitle: 'Frontend Engineer',
      homeLocation: { '@type': 'Place', name: 'Bengaluru, India' },
      knowsAbout: ['React', 'Next.js', 'TypeScript', 'Frontend development'],
      sameAs: [
        'https://github.com/nerdyspook',
        'https://www.linkedin.com/in/susanto-mahato-761118168/',
        'https://x.com/nerdyspook101'
      ]
    },
    {
      '@type': page.type,
      '@id': `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      inLanguage: 'en',
      isPartOf: { '@id': websiteId },
      about: { '@id': personId },
      ...(path === '/' ? { mainEntity: { '@id': personId } } : {}),
      ...(path !== '/' ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {})
    }
  ]

  if (path !== '/') {
    const crumbs = [{ name: 'Home', path: '/' }]
    if (path.startsWith('/projects/'))
      crumbs.push({ name: 'Projects', path: '/projects' })
    crumbs.push({ name: page.name, path })
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: absoluteUrl(crumb.path)
      }))
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}
