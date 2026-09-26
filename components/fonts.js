import localFont from 'next/font/local'

// Both fonts are served locally; no runtime request to a font provider.
const body = localFont({
  src: '../public/fonts/dm-sans-latin-variable.woff2',
  weight: '400 700',
  style: 'normal',
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Arial'
})

const heading = localFont({
  src: '../public/fonts/m-plus-rounded-1c-latin-700.woff2',
  weight: '700',
  style: 'normal',
  display: 'optional',
  preload: true,
  adjustFontFallback: 'Arial'
})

const Fonts = () => (
  <style jsx global>{`
    :root {
      --font-body: ${body.style.fontFamily};
      --font-heading: ${heading.style.fontFamily};
    }
  `}</style>
)
export default Fonts
