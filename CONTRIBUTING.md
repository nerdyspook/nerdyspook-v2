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

## Background music

The floating music button uses the browser's audio player; no music service or
extra dependency is required. The track is stored in `public/audio/background.mp3`
and served by this site at `/audio/background.mp3`, without an external audio host.
To replace the track:

1. Put your audio file in `public/audio/background.mp3` (create the `audio`
   directory if needed). Use a track you own or have permission to use.
2. Set `music.src` in `site.config.js` to `/audio/background.mp3`. A direct HTTPS
   audio URL also works; a Spotify or YouTube page URL does not.
3. Optionally change `music.volume` from `0.2` (20%) to a value between `0` and `1`.

An empty `music.src` hides the control. The player sets its volume and attempts
to play automatically when the page loads. If the browser blocks audible
autoplay, it retries on a click, tap, or keypress; the play button also starts it.
Playback loops and continues during navigation between site pages. Pausing keeps
it paused during navigation; reloading makes a new autoplay attempt.

The name pronunciation control plays `public/audio/susanto-calm.wav`. While the
name plays, background music fades down and returns afterward. Pronunciation
does not start paused music, and clicking it cancels pending automatic retries.
The shared audio focus provider keeps this behavior consistent across pages.

The audio uses `preload="none"`; the playback attempt starts the download when
allowed. The animated bars respect reduced-motion preferences. Some mobile
browsers use the device's volume setting instead of the configured volume.

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
