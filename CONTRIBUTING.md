# Local development

Use Node.js **24.x** and **pnpm 11.23.0**. The Node version is declared in
`.nvmrc` and `package.json`; the pnpm version is pinned in `packageManager`.

With nvm and Corepack installed:

```sh
nvm install
nvm use
corepack enable pnpm
pnpm install --frozen-lockfile
pnpm dev
```

If Corepack is unavailable, install the pinned pnpm version with
`npm install --global pnpm@11.23.0` first.

## Commands

- `pnpm dev` starts the development server.
- `pnpm lint` runs ESLint.
- `pnpm build` runs lint and creates the production build.
- `pnpm start` serves the production build.
- `pnpm prettier` formats the project.

Use `pnpm add <package>` for runtime dependencies and `pnpm add -D <package>`
for development dependencies. Commit `pnpm-lock.yaml` with dependency changes.

The pnpm lockfile was imported from the npm lockfile. Use pnpm for project
installs and do not regenerate `package-lock.json` or `yarn.lock`. Restart any
running development server after switching package managers.

## CI and hosting

Use Node 24 and the pnpm version pinned in `package.json`, then run:

```sh
pnpm install --frozen-lockfile
pnpm build
```

Update any manually configured install/build commands in the hosting dashboard
to match these commands. Clear old npm dependency caches on the first build.

On Vercel, set `ENABLE_EXPERIMENTAL_COREPACK=1` in the project's environment
variables so builds use the exact `packageManager` version. Remove any old npm
install override. See [Vercel's Corepack setup](https://vercel.com/docs/builds/configure-a-build#corepack).

`pnpm-workspace.yaml` allows the install script for `unrs-resolver`, the native
resolver used by ESLint. Review any additional dependency build scripts when
updating packages and record the decision in that file.

`styled-jsx` is an explicit dependency because Next.js generates imports for it
that must resolve from the project root with pnpm's isolated dependency layout.
