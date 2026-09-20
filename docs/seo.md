# SEO and domain migration

The production origin defaults to `https://nerdyspook-v2.vercel.app`. All canonical URLs, Open Graph URLs, structured-data identifiers, and sitemap entries use `site.config.js`. `libs/seo.js` defines the four published pages. Add new public routes there when you publish them.

## Current implementation

- Unique titles and descriptions in the server-rendered HTML for Home, Projects, Blogs, and Volt.
- Canonical URLs omit tracking parameters. Unknown routes return HTTP 404 with `noindex` and no canonical link.
- Open Graph and Twitter large-image cards, using page-specific 1200×630 PNGs under `public/og/`. Editable SVG source files sit beside the PNGs; regenerate the PNG after editing its SVG.
- Branded SVG, ICO (16/32/48), 96px PNG, 180px Apple touch icon, and 192/512px manifest icons. The 96px PNG provides a crawler-friendly favicon. Keep favicon URLs stable.
- `WebSite`, `Person`, `ProfilePage`/`CollectionPage`/`WebPage`, and breadcrumb JSON-LD based on content already on the site. This describes the site; it does not promise rich results or rankings.
- `/robots.txt` permits crawlers, including Googlebot, Bingbot, and OAI-SearchBot through its wildcard rule, and advertises `/sitemap.xml`. There was no previous robots policy; no separate training opt-out has been introduced. Search and AI training controls are separate decisions.
- `/sitemap.xml` lists only the four working public pages, with no invented modification dates. Both discovery endpoints have a one-hour shared cache.
- Content is visible before JavaScript executes. Navigation and footer sit outside the main landmark, and each page has its own primary heading.
- Volt's missing image path is fixed. Cards for Frontend-Prep, Kal-UI, Revisit, and Noter remain visible without links until their detail pages exist.

## Publish and verify

1. Deploy the reviewed source through the normal Vercel workflow. Changes on disk do not change the live site.
2. Confirm the homepage, `/projects`, `/blogs`, `/projects/volt`, `/robots.txt`, and `/sitemap.xml` return 200; an unknown path must return 404. Check metadata in View Source, not only DevTools after JavaScript has executed.
3. Inspect a link with [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) and [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/). Sharing services cache previews, so request a fresh scrape after deployment.
4. Verify ownership in [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters/). Submit `/sitemap.xml`, inspect the important URLs, and request indexing where appropriate. An absent robots file did not itself block indexing; the new file makes the policy and sitemap explicit.
5. Validate the deployed JSON-LD with [Schema Markup Validator](https://validator.schema.org/) and Google's [Rich Results Test](https://search.google.com/test/rich-results). Valid generic schema does not necessarily produce a Google rich result.
6. Confirm public pages and preview images are not protected by authentication or bot challenges. Check Vercel preview deployments remain excluded from indexing; do not apply `noindex` to production.

## Later: connect nerdyspook.dev

Do not change the canonical origin before the new domain is owned, connected, and serving this site over HTTPS.

1. Add `nerdyspook.dev` to the same Vercel project and complete DNS/TLS setup. Verify it serves the expected pages.
2. Set the Production environment variable `NEXT_PUBLIC_SITE_URL=https://nerdyspook.dev` in Vercel, and redeploy. This is a build-time value; changing it without rebuilding leaves old metadata in generated pages.
3. The code automatically enables a permanent **308 redirect** from `nerdyspook-v2.vercel.app/:path*` to the same path on `nerdyspook.dev`. Query parameters are retained. It does not redirect localhost or unrelated preview hosts. Keep the old Vercel domain attached so old links continue to work.
4. Test `/`, `/projects`, `/blogs`, `/projects/volt`, icons, and preview image URLs on both hosts. Old URLs should redirect once; new URLs should serve 200. Check every canonical and sitemap URL uses the new origin. Ensure any Vercel dashboard domain redirect agrees with this direction and does not create a loop.
5. Verify both properties in Search Console, submit the new sitemap, and use Change of Address if available for the old property. Keep the old redirects for at least a year, ideally indefinitely. Update profile links on GitHub, LinkedIn, X, and Hashnode.

Both addresses remain useful to visitors, while one primary domain accumulates search signals. A move can cause temporary search fluctuations.

## Remaining work with the highest value

- Publish substantive project case studies: the problem, your contribution, implementation decisions, screenshots, live/source links, and measured outcomes you can substantiate. Restore each project card's `href` only when its page exists, then add metadata and a sitemap entry.
- Expand Volt beyond a short description. It currently has too little detail to demonstrate the engineering behind the project.
- Publish useful firsthand technical writing. The Blogs page currently links to two Hashnode articles; the full content lives on Hashnode. If moving or republishing articles on this domain, choose and configure the canonical source deliberately.
- Keep your role, biography, public profiles, and article author identity consistent. Update structured data and previews when the corresponding visible information changes.
- Measure actual Core Web Vitals and search impressions after deployment. The 3D model, fonts, and large images are candidates for a separate performance audit; this change does not claim measured performance improvements.
- Check search indexing, sitemap processing, crawler failures, referrals, and queries periodically. No Search Console, Bing, or hosting analytics account was inspected in this audit.

`llms.txt` is optional and is not required by Google for AI search eligibility. Prioritize accessible, useful, indexable content and accurate structured data. A portfolio does not need an MCP server or agent-commerce integration just to be discoverable.

## Official references

- [Google: AI features and websites](https://developers.google.com/search/docs/appearance/ai-features)
- [OpenAI: crawler documentation](https://developers.openai.com/api/docs/bots)
- [Open Graph protocol](https://ogp.me/)
- [Google: favicon guidelines](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [Google: moving a site to a new URL](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Next.js: redirects](https://nextjs.org/docs/pages/api-reference/config/next-config-js/redirects)
