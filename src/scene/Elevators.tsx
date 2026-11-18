import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { SHAFTS } from '../data/layout'
import { mats } from './materials'

export function Elevators() {
  return (
    <group userData={{ roomId: 'elevators' }}>
      {SHAFTS.map((s, i) => (
        <Shaft key={i} x={s.x} z={s.z} w={s.w} d={s.d} phase={i * 1.9} speed={0.12 + i * 0.02} />
      ))}
    </group>
  )
}

function Shaft({
  x,
  z,
  w,
  d,
  phase,
  speed,
}: {
  x: number
  z: number
  w: number
  d: number
  phase: number
  speed: number
}) {
  const m = mats()
  const cab = useRef<Mesh>(null)
  const door = useRef<Mesh>(null)
  const light = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase
    const y = Math.sin(t) * 0.7 - 0.55
    if (cab.current) cab.current.position.y = y
    if (door.current) door.current.position.y = y
    if (light.current) light.current.position.y = y + 0.76
  })

  const curbH = 0.14
  const railH = 6.2

  return (
    <group position={[x, 0, z]}>
      {/* floor curb around the opening */}
      <mesh position={[0, curbH / 2, d / 2 + 0.03]}>
        <boxGeometry args={[w + 0.08, curbH, 0.1]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
      <mesh position={[0, curbH / 2, -d / 2 - 0.03]}>
        <boxGeometry args={[w + 0.08, curbH, 0.1]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
      <mesh position={[w / 2 + 0.03, curbH / 2, 0]}>
        <boxGeometry args={[0.1, curbH, d + 0.08]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
      <mesh position={[-w / 2 - 0.03, curbH / 2, 0]}>
        <boxGeometry args={[0.1, curbH, d + 0.08]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
      {/* a very thin back plane, short, so the well reads without becoming a tower */}
      <mesh position={[0, 1.15, d / 2 - 0.02]} receiveShadow>
        <boxGeometry args={[w - 0.08, 2.3, 0.03]} />
        <primitive object={m.shaftInner} attach="material" />
      </mesh>
      {/* rails up through the well */}
      {([-0.52, 0.52] as const).map((lx) => (
        <mesh key={lx} position={[lx, railH / 2 - 0.4, d / 2 - 0.12]}>
          <boxGeometry args={[0.03, railH, 0.03]} />
          <primitive object={m.chrome} attach="material" />
        </mesh>
      ))}
      <mesh position={[0, railH / 2 - 0.4, 0.1]}>
        <cylinderGeometry args={[0.01, 0.01, railH, 6]} />
        <primitive object={m.metalBlack} attach="material" />
      </mesh>
      {/* cab */}
      <mesh ref={cab} position={[0, -0.55, 0]} castShadow>
        <boxGeometry args={[w - 0.36, 1.55, d - 0.4]} />
        <primitive object={m.cab} attach="material" />
      </mesh>
      <mesh ref={door} position={[w / 2 - 0.22, -0.55, 0]} castShadow>
        <boxGeometry args={[0.04, 1.45, d - 0.52]} />
        <primitive object={m.cabDoor} attach="material" />
      </mesh>
      <mesh ref={light} position={[0, 0.21, 0]}>
        <boxGeometry args={[0.42, 0.03, 0.28]} />
        <primitive object={m.light} attach="material" />
      </mesh>
    </group>
  )
}
