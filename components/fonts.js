import localFont from 'next/font/local'

// Only headings and the wordmark use this weight. Keep font loading first-party.
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
      --font-heading: ${heading.style.fontFamily};
    }
  `}</style>
)
export default Fonts
