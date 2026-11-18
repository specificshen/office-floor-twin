import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { SHAFTS } from '../data/layout'
import { MODEL, useOfficeModel } from './furniture/models'
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
  const cabGroup = useRef<Group>(null)
  const cab = useOfficeModel(MODEL.elevatorCab)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase
    // Hover around this floor, dipping into the well and rising a little past the slab.
    if (cabGroup.current) cabGroup.current.position.y = Math.sin(t) * 0.85 - 0.15
  })
  const pitBottom = -1.45
  const pitH = Math.abs(pitBottom)
  const wallT = 0.07

  return (
    <group position={[x, 0, z]}>
      {/* well floor — hides the campus ground so the opening does not read as a pit */}
      <mesh position={[0, pitBottom + 0.02, 0]} receiveShadow>
        <boxGeometry args={[w - 0.04, 0.06, d - 0.04]} />
        <primitive object={m.shaftFloor} attach="material" />
      </mesh>

      <mesh position={[0, pitBottom / 2, d / 2 - wallT / 2]} receiveShadow>
        <boxGeometry args={[w, pitH, wallT]} />
        <primitive object={m.shaftInner} attach="material" />
      </mesh>
      <mesh position={[0, pitBottom / 2, -d / 2 + wallT / 2]} receiveShadow>
        <boxGeometry args={[w, pitH, wallT]} />
        <primitive object={m.shaftInner} attach="material" />
      </mesh>
      <mesh position={[w / 2 - wallT / 2, pitBottom / 2, 0]} receiveShadow>
        <boxGeometry args={[wallT, pitH, d - wallT * 2]} />
        <primitive object={m.shaftInner} attach="material" />
      </mesh>
      <mesh position={[-w / 2 + wallT / 2, pitBottom / 2, 0]} receiveShadow>
        <boxGeometry args={[wallT, pitH, d - wallT * 2]} />
        <primitive object={m.shaftInner} attach="material" />
      </mesh>

      <Curb w={w} d={d} />
      <Balustrade w={w} d={d} />

      {([-0.48, 0.48] as const).map((lx) => (
        <mesh key={lx} position={[lx, 1.6, d / 2 - 0.16]}>
          <boxGeometry args={[0.03, 4.4, 0.03]} />
          <primitive object={m.chrome} attach="material" />
        </mesh>
      ))}

      <group ref={cabGroup} position={[0, -0.15, 0]}>
        <primitive object={cab} />
      </group>
    </group>
  )
}

function Curb({ w, d }: { w: number; d: number }) {
  const m = mats()
  const h = 0.08
  const t = 0.1
  return (
    <group>
      <mesh position={[0, h / 2, d / 2 + t / 2]}>
        <boxGeometry args={[w + t * 2, h, t]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
      <mesh position={[0, h / 2, -d / 2 - t / 2]}>
        <boxGeometry args={[w + t * 2, h, t]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
      <mesh position={[w / 2 + t / 2, h / 2, 0]}>
        <boxGeometry args={[t, h, d]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
      <mesh position={[-w / 2 - t / 2, h / 2, 0]}>
        <boxGeometry args={[t, h, d]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
    </group>
  )
}

function Balustrade({ w, d }: { w: number; d: number }) {
  const m = mats()
  const h = 1.05
  const glassH = 0.86
  const post = 0.045
  const hw = w / 2 + 0.1
  const hd = d / 2 + 0.1
  const posts: Array<[number, number]> = [
    [-hw, -hd],
    [hw, -hd],
    [-hw, hd],
    [hw, hd],
  ]

  const sides: Array<{ pos: [number, number, number]; size: [number, number, number] }> = [
    { pos: [0, h, hd], size: [w + 0.2, 0.03, 0.045] },
    { pos: [0, h, -hd], size: [w + 0.2, 0.03, 0.045] },
    { pos: [hw, h, 0], size: [0.045, 0.03, d + 0.2] },
    { pos: [-hw, h, 0], size: [0.045, 0.03, d + 0.2] },
  ]

  const glasses: Array<{ pos: [number, number, number]; size: [number, number, number] }> = [
    { pos: [0, 0.08 + glassH / 2, hd], size: [w + 0.12, glassH, 0.012] },
    { pos: [0, 0.08 + glassH / 2, -hd], size: [w + 0.12, glassH, 0.012] },
    { pos: [hw, 0.08 + glassH / 2, 0], size: [0.012, glassH, d + 0.12] },
    { pos: [-hw, 0.08 + glassH / 2, 0], size: [0.012, glassH, d + 0.12] },
  ]

  return (
    <group>
      {posts.map(([px, pz], i) => (
        <mesh key={`p${i}`} position={[px, h / 2, pz]} castShadow>
          <boxGeometry args={[post, h, post]} />
          <primitive object={m.aluminum} attach="material" />
        </mesh>
      ))}
      {sides.map((s, i) => (
        <mesh key={`r${i}`} position={s.pos}>
          <boxGeometry args={s.size} />
          <primitive object={m.aluminum} attach="material" />
        </mesh>
      ))}
      {glasses.map((g, i) => (
        <mesh key={`g${i}`} position={g.pos} userData={{ kind: 'glass' }}>
          <boxGeometry args={g.size} />
          <primitive object={m.glassDoor} attach="material" />
        </mesh>
      ))}
    </group>
  )
}
