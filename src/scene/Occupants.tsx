import { useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Scenario } from '../types'
import { ROOM_MAP } from '../data/layout'
import { PersonCapsule } from './furniture'
import { DeskDots } from './Rooms'
import { mats } from './materials'

export function Occupants({ scenario }: { scenario: Scenario }) {
  return (
    <group userData={{ kind: 'ignore' }}>
      <SeatedPeople scenario={scenario} />
      <ReceptionVisitors count={scenario.visitors} />
      <Walkers count={scenario.walkers} seed={scenario.key} />
      <DeskDots density={scenario.deskDensity} />
    </group>
  )
}

const SEAT_OFFSETS: Record<string, Array<[number, number, number]>> = {
  // x, z, rotY, — local to room
  s1: [
    [0.3, 0.72, Math.PI],
    [-0.3, 0.72, Math.PI],
    [0.3, -0.72, 0],
  ],
  s2: [
    [0.3, 0.72, Math.PI],
    [-0.3, -0.72, 0],
  ],
  m1: [
    [-0.9, 0.88, Math.PI],
    [-0.3, 0.88, Math.PI],
    [0.3, 0.88, Math.PI],
    [0.9, -0.88, 0],
    [-0.3, -0.88, 0],
    [0.3, -0.88, 0],
  ],
  m2: [
    [-0.9, 0.88, Math.PI],
    [-0.3, 0.88, Math.PI],
    [0.3, 0.88, Math.PI],
    [0.9, 0.88, Math.PI],
    [-0.9, -0.88, 0],
    [0.3, -0.88, 0],
    [0.9, -0.88, 0],
  ],
  l: [
    [-1.8, 1.05, Math.PI],
    [-1.1, 1.05, Math.PI],
    [-0.4, 1.05, Math.PI],
    [0.4, 1.05, Math.PI],
    [1.1, 1.05, Math.PI],
    [-1.8, -1.05, 0],
    [-0.4, -1.05, 0],
    [0.4, -1.05, 0],
    [1.1, -1.05, 0],
    [1.8, -1.05, 0],
    [2.55, 0, -Math.PI / 2],
  ],
  h1: [
    [0, 0.75, Math.PI],
    [0.85, -0.2, -Math.PI / 2],
    [-0.85, -0.2, Math.PI / 2],
  ],
  h2: [
    [0, 0.75, Math.PI],
    [0, -1.05, 0],
  ],
  b1: [[0, 0.35, Math.PI]],
  b2: [[0, 0.35, Math.PI]],
  f1: [[0.15, 0.18, Math.PI]],
  f2: [[0.15, 0.18, Math.PI]],
  pantry: [
    [-1.6, 1.95, Math.PI],
  ],
}

function SeatedPeople({ scenario }: { scenario: Scenario }) {
  const nodes: ReactNode[] = []
  for (const [id, seats] of Object.entries(SEAT_OFFSETS)) {
    const st = scenario.rooms[id]
    if (!st) continue
    if (st.status === 'idle') continue
    const room = ROOM_MAP[id]
    if (!room) continue
    const take = st.status === 'soon' ? 1 : seats.length
    seats.slice(0, take).forEach((s, i) => {
      nodes.push(
        <PersonCapsule
          key={`${id}-${i}`}
          position={[room.bounds.x + s[0], 0, room.bounds.z + s[1]]}
          rotation={[0, s[2], 0]}
          seated
          variant={i + id.length}
        />,
      )
    })
  }
  return <group>{nodes}</group>
}

function ReceptionVisitors({ count }: { count: number }) {
  const room = ROOM_MAP.reception
  const slots: Array<[number, number, number]> = [
    [-1.5, -2.5, 0.4],
    [-0.65, -2.7, 0.15],
    [-2.1, -1.6, 0.9],
    [1.6, -2.8, -0.3],
    [0.2, -3.2, 0],
    [2.2, -1.4, -0.6],
    [-2.3, -3.0, 0.5],
  ]
  return (
    <group>
      {slots.slice(0, count).map((s, i) => (
        <PersonCapsule
          key={i}
          position={[room.bounds.x + s[0], 0, room.bounds.z + s[1]]}
          rotation={[0, s[2], 0]}
          seated={i < 2}
          variant={i}
        />
      ))}
    </group>
  )
}

const PATHS: [number, number][][] = [
  [
    [-10.2, -5.7],
    [-2, -5.7],
    [6, -5.7],
    [16, -5.7],
    [16, 1.2],
    [9.2, 1.2],
    [9.2, -5.7],
    [0, -5.7],
    [-10.2, -5.7],
  ],
  [
    [-10.2, 10.5],
    [-10.2, 4],
    [-10.2, -5.7],
    [-4, -5.7],
    [-4, -3.2],
    [2, -3.2],
    [2, 5.5],
    [-10.2, 5.5],
    [-10.2, 10.5],
  ],
  [
    [9.2, 12],
    [9.2, 4],
    [9.2, -5.7],
    [16.5, -5.7],
    [16.5, 8],
    [9.2, 8],
    [9.2, 12],
  ],
  [
    [-10.2, 1],
    [2.5, 1],
    [5.4, -3],
    [9.2, -3],
    [9.2, 6],
    [2.5, 6],
    [-10.2, 6],
    [-10.2, 1],
  ],
  [
    [18, -7.8],
    [9.4, -7.8],
    [4, -7.8],
    [-2, -7.8],
    [-8, -7.8],
    [-8, -5.7],
    [9.4, -5.7],
    [18, -5.7],
    [18, -7.8],
  ],
]

function Walkers({ count, seed }: { count: number; seed: string }) {
  const seedN = seed === 'morning' ? 2 : seed === 'typical' ? 5 : 1
  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <Walker key={`${seed}-${i}`} path={PATHS[i % PATHS.length]} speed={0.55 + (i % 3) * 0.12} offset={(i * 0.23 + seedN * 0.1) % 1} />
      ))}
    </group>
  )
}

function Walker({
  path,
  speed,
  offset,
}: {
  path: [number, number][]
  speed: number
  offset: number
}) {
  const group = useRef<THREE.Group>(null)
  const trail = useRef<THREE.Mesh[]>([])
  const lengths = useMemo(() => {
    const segs: number[] = []
    let total = 0
    for (let i = 0; i < path.length - 1; i++) {
      const len = Math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1])
      segs.push(len)
      total += len
    }
    return { segs, total }
  }, [path])

  const trailMats = useMemo(() => {
    const base = mats().person
    return [0.28, 0.2, 0.14, 0.08].map((op) => {
      const mat = base.clone()
      mat.transparent = true
      mat.opacity = op
      mat.depthWrite = false
      return mat
    })
  }, [])

  useFrame(({ clock }) => {
    if (!group.current) return
    const dist = ((clock.getElapsedTime() * speed + offset * lengths.total) % lengths.total)
    let acc = 0
    let x = path[0][0]
    let z = path[0][1]
    let yaw = 0
    for (let i = 0; i < lengths.segs.length; i++) {
      const nextAcc = acc + lengths.segs[i]
      if (dist <= nextAcc || i === lengths.segs.length - 1) {
        const t = (dist - acc) / Math.max(0.0001, lengths.segs[i])
        const a = path[i]
        const b = path[i + 1]
        x = a[0] + (b[0] - a[0]) * t
        z = a[1] + (b[1] - a[1]) * t
        yaw = Math.atan2(b[0] - a[0], b[1] - a[1])
        break
      }
      acc = nextAcc
    }
    group.current.position.set(x, 0, z)
    group.current.rotation.y = yaw
    trail.current.forEach((mesh, i) => {
      const behind = 0.28 * (i + 1)
      mesh.position.set(x - Math.sin(yaw) * behind, 0.22 - i * 0.02, z - Math.cos(yaw) * behind)
    })
  })

  return (
    <group>
      <group ref={group}>
        <PersonCapsule variant={2} />
      </group>
      {trailMats.map((mat, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) trail.current[i] = el
          }}
        >
          <sphereGeometry args={[0.1 - i * 0.015, 10, 8]} />
          <primitive object={mat} attach="material" />
        </mesh>
      ))}
    </group>
  )
}
