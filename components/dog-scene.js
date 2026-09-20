import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Box } from '@chakra-ui/react'

const VoxelDog = dynamic(() => import('./voxel-dog'), { ssr: false })

const DogScene = () => {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let firstFrame
    let secondFrame
    let idleTask
    let timer

    // Let the initial assets load and the content paint before importing WebGL.
    // requestIdleCallback alone can run before the browser's first paint.
    const schedule = () => {
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          if ('requestIdleCallback' in window) {
            idleTask = window.requestIdleCallback(() => setReady(true), {
              timeout: 1500
            })
          } else {
            timer = window.setTimeout(() => setReady(true), 0)
          }
        })
      })
    }

    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })

    return () => {
      window.removeEventListener('load', schedule)
      window.cancelAnimationFrame(firstFrame)
      window.cancelAnimationFrame(secondFrame)
      if (idleTask !== undefined) window.cancelIdleCallback(idleTask)
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <Box
      m="auto"
      mt={['-20px', '-60px', '-120px']}
      mb={['-40px', '-140px', '-200px']}
      w={[280, 480, 640]}
      maxW="100%"
      h={[280, 480, 640]}
      position="relative"
    >
      {ready && <VoxelDog />}
    </Box>
  )
}

export default DogScene
