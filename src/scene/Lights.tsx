import { useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { applyStudioEnvironment } from './materials'

export function Lights() {
  const { gl, scene } = useThree()

  useLayoutEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 0.92
    gl.outputColorSpace = THREE.SRGBColorSpace
    gl.shadowMap.enabled = true
    gl.shadowMap.type = THREE.PCFShadowMap
    const tex = applyStudioEnvironment(gl, scene, 0.32)
    return () => {
      if (scene.environment === tex) scene.environment = null
      tex.dispose()
    }
  }, [gl, scene])

  return (
    <>
      <color attach="background" args={['#c5d2df']} />
      <fog attach="fog" args={['#c5d2df', 48, 90]} />
      <hemisphereLight args={['#dce8f2', '#b7aa96', 0.36]} />
      <ambientLight intensity={0.12} color="#eef1f4" />
      {/* key — soft NE sun through the windows */}
      <directionalLight
        position={[22, 30, 16]}
        intensity={1.25}
        color="#fff3e0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={4}
        shadow-camera-far={90}
        shadow-camera-left={-32}
        shadow-camera-right={32}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
        shadow-bias={-0.0006}
        shadow-normalBias={0.04}
        shadow-radius={3}
      />
      {/* fill from west / south so meeting rooms stay readable */}
      <directionalLight position={[-20, 16, -10]} intensity={0.48} color="#e8dfd2" />
      {/* cool rim / north sky */}
      <directionalLight position={[2, 10, 26]} intensity={0.34} color="#d4e4f5" />
      {/* east window wash */}
      <directionalLight position={[30, 8, 2]} intensity={0.2} color="#dfeaf5" />
      <ContactShadows
        position={[0, 0.002, 0]}
        opacity={0.42}
        scale={52}
        blur={2.0}
        far={9}
        color="#4a433c"
      />
    </>
  )
}
