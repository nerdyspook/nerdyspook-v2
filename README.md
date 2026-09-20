# nerdyspook-v2

A portfolio website for showcasing my recent works.

Use Node.js **24.x** and its bundled npm. The runtime is declared in
`package.json` and `.nvmrc`.

```sh
nvm install
nvm use
npm ci
npm run dev
```

For a production build and local preview:

```sh
npm run build
npm start
```

`npm run build` runs ESLint before building. `npm run lint` runs it separately.
Restart any running development server after installing the upgraded dependencies.

## Node 24 migration

The original Next.js 11 build failed on Node 24 with
`ERR_OSSL_EVP_UNSUPPORTED` in webpack's hashing code. This migration upgrades to
Next.js 16, React 18, Chakra UI 2, and Framer Motion 13, retaining the Pages Router.
It does not need an OpenSSL legacy-provider flag or `--legacy-peer-deps`.

Compatibility changes addressed:

- **Build and lint:** Next.js 16 uses Turbopack by default and removes `next lint`.
  ESLint now uses `eslint.config.mjs`; the build script explicitly runs lint.
- **Dependencies:** Chakra UI 1 included React 17-only dependencies. Chakra UI 2
  resolves those conflicts with React 18. The npm lockfile was regenerated.
- **Navigation:** New Next.js links render their own anchors. Chakra links and
  buttons now compose with `NextLink`, avoiding nested anchors. The navbar uses
  the resolved page pathname so missing project routes hydrate consistently.
- **Images:** The removed `layout="responsive"` prop was replaced with responsive
  styles and `sizes`; blog thumbnails also keep their aspect ratio.
- **Animations:** Framer Motion 4 left old page content visible after navigation
  under React 18. The updated code uses `LayoutGroup`, `mode="wait"`, and
  `motion.create`, with consistent button tab indices during hydration.
- **3D model:** React 18 Strict Mode repeats effect setup in development. The dog
  now cleans up its canvas, controls, GPU resources, and animation loop, including
  model loads that finish after cleanup.

Deployment considerations:

- Build and run with Node 24. On Vercel, `engines.node: "24.x"` selects Node 24
  for the next deployment; other hosts may need their runtime setting updated.
  Reinstall dependencies and invalidate caches created with Node 16.
- Next.js 16 targets Chrome/Edge 111+, Firefox 111+, and Safari 16.4+. Older
  browsers are outside its default support range.
- Review a preview deployment for styling and animation differences after the
  UI library upgrades. Local checks do not validate the hosting environment.
- Existing project cards for Frontend-Prep, Kal-UI, Revisit, and Noter point to
  detail routes that are absent from this repository and still return 404.

Validated locally with Node 24.18.0 and npm 11.16.0: a clean `npm ci`, the full
dependency tree, lint, production build, route/image HTTP checks, and Chrome
desktop/mobile interactions. Production navigation and 404 recovery were checked
for hydration errors. The hosting environment has not been deployed or tested.

The install currently warns that ESLint 9 is deprecated. It remains on 9 because
the React lint plugin used by the Next.js configuration does not yet declare
ESLint 10 compatibility; lint and build both pass with the locked versions.

References: [Next.js upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16),
[browser support](https://nextjs.org/docs/architecture/supported-browsers),
[Motion upgrade guide](https://motion.dev/docs/react-upgrade-guide), and
[Vercel Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
