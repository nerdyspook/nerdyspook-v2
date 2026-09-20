import { useState, useEffect, useRef } from 'react'
import { Box, Image, Spinner, VisuallyHidden } from '@chakra-ui/react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { loadGLTFModel } from '../libs/model'
import { useReducedMotionPreference } from './motion-preferences'

const VoxelDog = () => {
  const refContainer = useRef(null)
  const controller = useRef(null)
  const reducedMotion = useReducedMotionPreference()
  const reducedMotionRef = useRef(reducedMotion)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    reducedMotionRef.current = reducedMotion
    controller.current?.sync()
  }, [reducedMotion])

  useEffect(() => {
    const container = refContainer.current
    if (!container) return
    let disposed = false
    let visible = false
    let loaded = false
    let interacting = false
    const introDuration = (100 / 60) * 1000
    let introElapsed = 0
    let lastTime = null
    let frame = null
    let renderer
    const scene = new THREE.Scene()
    const target = new THREE.Vector3(-0.5, 1.2, 0)

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      // WebGL availability is only known after initializing the browser renderer.
      /* eslint-disable react-hooks/set-state-in-effect */
      setLoading(false)
      setFailed(true)
      /* eslint-enable react-hooks/set-state-in-effect */
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputEncoding = THREE.sRGBEncoding
    const canvas = renderer.domElement
    canvas.tabIndex = 0
    canvas.style.outline = 'none'
    canvas.style.boxShadow = 'none'
    canvas.setAttribute('role', 'img')
    canvas.setAttribute('aria-label', 'Interactive 3D desk scene')
    canvas.setAttribute('aria-describedby', 'scene-instructions')
    container.appendChild(canvas)

    const camera = new THREE.OrthographicCamera(-8, 8, 8, -8, 0.01, 50000)
    const initialCameraPosition = new THREE.Vector3(
      20 * Math.sin(0.2 * Math.PI),
      10,
      20 * Math.cos(0.2 * Math.PI)
    )
    camera.position.copy(initialCameraPosition)
    camera.lookAt(target)
    scene.add(new THREE.AmbientLight(0xcccccc, 1))
    const controls = new OrbitControls(camera, canvas)
    controls.target.copy(target)
    controls.autoRotateSpeed = 2

    const render = () => {
      if (loaded && !disposed) renderer.render(scene, camera)
    }
    const canAnimate = () =>
      loaded &&
      visible &&
      !document.hidden &&
      !reducedMotionRef.current &&
      !interacting &&
      !disposed
    const tick = now => {
      frame = null
      if (!canAnimate()) return
      const delta = lastTime === null ? 1000 / 60 : Math.min(now - lastTime, 50)
      lastTime = now
      if (introElapsed < introDuration) {
        introElapsed = Math.min(introElapsed + delta, introDuration)
        const progress = introElapsed / 2000
        const angle = -Math.sqrt(1 - Math.pow(1 - progress, 4)) * Math.PI * 20
        const origin = initialCameraPosition
        camera.position.set(
          origin.x * Math.cos(angle) + origin.z * Math.sin(angle),
          origin.y,
          origin.z * Math.cos(angle) - origin.x * Math.sin(angle)
        )
        camera.lookAt(target)
        render()
      } else {
        // This OrbitControls version rotates per update; normalize to elapsed time.
        controls.autoRotateSpeed = 2 * (delta / (1000 / 60))
        controls.update()
      }
      frame = requestAnimationFrame(tick)
    }
    const sync = () => {
      cancelAnimationFrame(frame)
      frame = null
      lastTime = null
      controls.autoRotate = canAnimate()
      render()
      if (canAnimate()) frame = requestAnimationFrame(tick)
    }
    controller.current = { sync }

    const resize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      const scale = height * 0.005 + 4.8
      camera.left = (-scale * width) / height
      camera.right = (scale * width) / height
      camera.top = scale
      camera.bottom = -scale
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      render()
    }
    const rotateWithKeys = event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return
      event.preventDefault()
      introElapsed = introDuration
      const offset = camera.position.clone().sub(target)
      offset.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        event.key === 'ArrowLeft' ? -0.15 : 0.15
      )
      camera.position.copy(target).add(offset)
      controls.update()
      render()
    }
    const start = () => {
      introElapsed = introDuration
      interacting = true
      sync()
    }
    const end = () => {
      interacting = false
      sync()
    }
    controls.addEventListener('change', render)
    controls.addEventListener('start', start)
    controls.addEventListener('end', end)
    canvas.addEventListener('keydown', rotateWithKeys)
    // Permit normal vertical scrolling on touchscreens over the illustration.
    canvas.style.touchAction = 'pan-y'
    const sizeObserver = new ResizeObserver(resize)
    sizeObserver.observe(container)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    visibilityObserver.observe(container)
    document.addEventListener('visibilitychange', sync)
    resize()

    const disposeScene = () => {
      scene.traverse(object => {
        object.geometry?.dispose()
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material]
        materials.filter(Boolean).forEach(material => {
          Object.values(material).forEach(value => {
            if (value?.isTexture) value.dispose()
          })
          material.dispose()
        })
      })
      scene.clear()
    }

    loadGLTFModel(scene, '/dog.glb', {
      receiveShadow: false,
      castShadow: false
    })
      .then(() => {
        if (disposed) {
          disposeScene()
          return
        }
        loaded = true
        setLoading(false)
        controls.update()
        sync()
      })
      .catch(() => {
        if (!disposed) {
          setLoading(false)
          setFailed(true)
          canvas.tabIndex = -1
        }
      })

    return () => {
      disposed = true
      controller.current = null
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', sync)
      sizeObserver.disconnect()
      visibilityObserver.disconnect()
      canvas.removeEventListener('keydown', rotateWithKeys)
      controls.removeEventListener('change', render)
      controls.removeEventListener('start', start)
      controls.removeEventListener('end', end)
      controls.dispose()
      disposeScene()
      renderer.dispose()
      canvas.remove()
    }
  }, [])

  return (
    <Box
      ref={refContainer}
      className="voxel-dog"
      w="100%"
      h="100%"
      position="relative"
    >
      <VisuallyHidden id="scene-instructions">
        Drag or use the left and right arrow keys to rotate the scene.
      </VisuallyHidden>
      {loading && (
        <Spinner
          animation={reducedMotion ? 'none' : undefined}
          size="lg"
          position="absolute"
          left="50%"
          top="45%"
          label="Loading illustration"
        />
      )}
      {failed && (
        <Image
          src="/favicon.svg"
          alt=""
          position="absolute"
          boxSize="64px"
          left="calc(50% - 32px)"
          top="calc(45% - 32px)"
        />
      )}
    </Box>
  )
}

export default VoxelDog
