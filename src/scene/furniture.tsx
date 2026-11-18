import { useLayoutEffect } from 'react'
import { mats } from './materials'
import {
  MODEL,
  MODEL_SIZE,
  tintScreen,
  tintSlot,
  useOfficeModel,
} from './furniture/models'

type P = {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
}

type ChairColor = 'blue' | 'gray' | 'sand' | 'sage' | 'ink'

function chairFabric(color: ChairColor) {
  const m = mats()
  if (color === 'gray') return m.fabricGray
  if (color === 'sand') return m.fabricSand
  if (color === 'sage') return m.fabricSage
  if (color === 'ink') return m.fabricInk
  return m.fabricBlue
}

export function Desk({
  position,
  rotation,
  hasMonitor = true,
  dual = false,
  plant = false,
  lamp = false,
}: P & { hasMonitor?: boolean; dual?: boolean; plant?: boolean; lamp?: boolean }) {
  const desk = useOfficeModel(MODEL.workDesk)
  return (
    <group position={position} rotation={rotation}>
      <primitive object={desk} />
      {hasMonitor && <Monitor x={dual ? -0.22 : 0} z={-0.12} />}
      {dual && <Monitor x={0.22} z={-0.12} />}
      {plant && <DeskPlant position={[0.55, 0.75, 0.2]} />}
      {lamp && <TaskLamp position={[-0.52, 0.75, -0.18]} />}
    </group>
  )
}

export function Monitor({
  x = 0,
  z = 0,
  on = true,
  w = 0.48,
  h = 0.3,
  y = 0.75,
}: {
  x?: number
  z?: number
  y?: number
  on?: boolean
  w?: number
  h?: number
}) {
  const root = useOfficeModel(MODEL.monitor, true)
  useLayoutEffect(() => {
    tintScreen(root, on)
  }, [root, on])
  const sx = w === 0.48 ? 1 : w / MODEL_SIZE.monitor.w
  const sy = h === 0.3 ? 1 : h / MODEL_SIZE.monitor.h
  return (
    <group position={[x, y, z]} scale={[sx, sy, 1]}>
      <primitive object={root} />
    </group>
  )
}

function TaskLamp({ position }: { position: [number, number, number] }) {
  const m = mats()
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.045, 0.05, 0.01, 16]} />
        <primitive object={m.metalBlack} attach="material" />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[0.15, 0, 0.1]}>
        <cylinderGeometry args={[0.007, 0.007, 0.24, 8]} />
        <primitive object={m.metalBlack} attach="material" />
      </mesh>
      <mesh position={[0.02, 0.24, -0.04]} rotation={[1.1, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.05, 12]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
    </group>
  )
}

export function TaskChair({
  position,
  rotation,
  color = 'blue',
}: P & { color?: ChairColor }) {
  const fabric = chairFabric(color)
  const root = useOfficeModel(MODEL.taskChair, true)
  useLayoutEffect(() => {
    tintSlot(root, 'Fabric', fabric.color)
  }, [root, fabric])
  return (
    <group position={position} rotation={rotation}>
      <primitive object={root} />
    </group>
  )
}

export function MeetChair({
  position,
  rotation,
  color = 'gray',
}: P & { color?: ChairColor }) {
  const fabric = chairFabric(color)
  const root = useOfficeModel(MODEL.meetChair, true)
  useLayoutEffect(() => {
    tintSlot(root, 'Fabric', fabric.color)
  }, [root, fabric])
  return (
    <group position={position} rotation={rotation}>
      <primitive object={root} />
    </group>
  )
}

export function MeetingTable({
  position,
  rotation,
  size = [2.4, 1.1],
}: P & { size?: [number, number] }) {
  const [w, d] = size
  const errS = Math.hypot(w - MODEL_SIZE.meetingTableS.w, d - MODEL_SIZE.meetingTableS.d)
  const errM = Math.hypot(w - MODEL_SIZE.meetingTableM.w, d - MODEL_SIZE.meetingTableM.d)
  const src = errS <= errM ? MODEL_SIZE.meetingTableS : MODEL_SIZE.meetingTableM
  const url = errS <= errM ? MODEL.meetingTableS : MODEL.meetingTableM
  const root = useOfficeModel(url)
  return (
    <group position={position} rotation={rotation} scale={[w / src.w, 1, d / src.d]}>
      <primitive object={root} />
    </group>
  )
}

export function BoatTable({ position, rotation }: P) {
  const root = useOfficeModel(MODEL.meetingTableL)
  return (
    <group position={position} rotation={rotation}>
      <primitive object={root} />
    </group>
  )
}

export function WallScreen({
  position,
  rotation,
  width = 1.8,
  height = 1.0,
  on = false,
}: P & { width?: number; height?: number; on?: boolean }) {
  const root = useOfficeModel(MODEL.wallScreen, true)
  useLayoutEffect(() => {
    tintScreen(root, on)
  }, [root, on])
  return (
    <group
      position={position}
      rotation={rotation}
      scale={[width / MODEL_SIZE.wallScreen.w, height / MODEL_SIZE.wallScreen.h, 1]}
    >
      <primitive object={root} />
    </group>
  )
}

export function Credenza({ position, rotation, width = 1.6 }: P & { width?: number }) {
  const root = useOfficeModel(MODEL.credenza)
  return (
    <group position={position} rotation={rotation} scale={[width / MODEL_SIZE.credenza.w, 1, 1]}>
      <primitive object={root} />
    </group>
  )
}

/**
 * Origin is the pot bottom. Call sites should pass the
 * world position of the supporting surface, not a point
 * at ground level with a later height offset.
 */
export function DeskPlant({ position, rotation, scale = 1 }: P) {
  const root = useOfficeModel(MODEL.deskPlant)
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={root} />
    </group>
  )
}

export function FloorPlant({ position, rotation, scale = 1, variant = 0 }: P & { variant?: number }) {
  const slim = variant % 2 === 1
  const root = useOfficeModel(slim ? MODEL.floorPlantB : MODEL.floorPlantA)
  const applied =
    slim && typeof scale === 'number'
      ? Math.max(scale, 1)
      : scale
  return (
    <group position={position} rotation={rotation} scale={applied}>
      <primitive object={root} />
    </group>
  )
}

export function LinearLight({
  position,
  rotation,
  length = 2.4,
}: P & { length?: number }) {
  const m = mats()
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[length, 0.04, 0.08]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
      <mesh position={[0, -0.025, 0]}>
        <boxGeometry args={[length - 0.06, 0.02, 0.06]} />
        <primitive object={m.light} attach="material" />
      </mesh>
    </group>
  )
}

/**
 * High transaction top sits on local +Z at y=1.1;
 * the staff work surface is on -Z at y=0.74. The monitor
 * faces the staff; the plant sits on the visitor top.
 */
export function ReceptionDesk({ position, rotation }: P) {
  const root = useOfficeModel(MODEL.receptionDesk)
  return (
    <group position={position} rotation={rotation}>
      <primitive object={root} />
      <group position={[-0.35, 0, -0.12]} rotation={[0, Math.PI, 0]}>
        <Monitor x={0} z={0} y={0.74} />
      </group>
      <DeskPlant position={[0.95, 1.1, 0.24]} />
    </group>
  )
}

export function WaitingSeat({ position, rotation }: P) {
  const m = mats()
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.1, 0.62]} />
        <primitive object={m.fabricSand} attach="material" />
      </mesh>
      <mesh position={[0, 0.62, -0.26]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[0.7, 0.42, 0.08]} />
        <primitive object={m.fabricSand} attach="material" />
      </mesh>
      {([-0.3, 0.3] as const).map((x) => (
        <mesh key={x} position={[x, 0.18, 0.18]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.36, 8]} />
          <primitive object={m.chrome} attach="material" />
        </mesh>
      ))}
      {([-0.3, 0.3] as const).map((x) => (
        <mesh key={`b${x}`} position={[x, 0.18, -0.22]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.36, 8]} />
          <primitive object={m.chrome} attach="material" />
        </mesh>
      ))}
    </group>
  )
}

export function CoffeeTable({ position, rotation }: P) {
  const m = mats()
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[0.8, 0.03, 0.5]} />
        <primitive object={m.woodLight} attach="material" />
      </mesh>
      {([-0.32, 0.32] as const).map((x) =>
        ([-0.18, 0.18] as const).map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.19, z]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.38, 8]} />
            <primitive object={m.chrome} attach="material" />
          </mesh>
        )),
      )}
    </group>
  )
}

export function PantryCounter({ position, rotation }: P) {
  const m = mats()
  return (
    <group position={position} rotation={rotation}>
      {/* L counter along south + east */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.9, 0.65]} />
        <primitive object={m.appliance} attach="material" />
      </mesh>
      <mesh position={[0, 0.91, 0]} castShadow>
        <boxGeometry args={[4.28, 0.04, 0.7]} />
        <primitive object={m.counter} attach="material" />
      </mesh>
      {/* fridge */}
      <mesh position={[-2.35, 0.95, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 1.9, 0.7]} />
        <primitive object={m.appliance} attach="material" />
      </mesh>
      <mesh position={[-2.02, 1.05, 0.05]}>
        <boxGeometry args={[0.02, 0.4, 0.08]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
      {/* coffee machine block */}
      <mesh position={[0.3, 1.08, 0]} castShadow>
        <boxGeometry args={[0.36, 0.32, 0.32]} />
        <primitive object={m.metalBlack} attach="material" />
      </mesh>
      <mesh position={[0.3, 1.26, 0.02]}>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 12]} />
        <primitive object={m.blackPlastic} attach="material" />
      </mesh>
      {/* sink suggestion */}
      <mesh position={[1.3, 0.94, 0]}>
        <boxGeometry args={[0.42, 0.04, 0.32]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
      {/* upper shelf */}
      <mesh position={[0.6, 1.7, -0.18]} castShadow>
        <boxGeometry args={[2.2, 0.03, 0.28]} />
        <primitive object={m.wood} attach="material" />
      </mesh>
    </group>
  )
}

export function Stool({ position, rotation }: P) {
  const m = mats()
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.04, 16]} />
        <primitive object={m.wood} attach="material" />
      </mesh>
      <mesh position={[0, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.022, 0.6, 8]} />
        <primitive object={m.chrome} attach="material" />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 16]} />
        <primitive object={m.chrome} attach="material" />
      </mesh>
    </group>
  )
}

export function CafeTable({ position, rotation }: P) {
  const m = mats()
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.74, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.03, 24]} />
        <primitive object={m.woodLight} attach="material" />
      </mesh>
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.72, 10]} />
        <primitive object={m.chrome} attach="material" />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.025, 20]} />
        <primitive object={m.chrome} attach="material" />
      </mesh>
    </group>
  )
}

export function LogoWall({ position, rotation }: P) {
  const m = mats()
  return (
    <group position={position} rotation={rotation}>
      <mesh receiveShadow>
        <boxGeometry args={[3.2, 2.4, 0.08]} />
        <primitive object={m.wallBlue} attach="material" />
      </mesh>
      {/* abstract mark — not a brand wordmark */}
      <mesh position={[0, 0.25, 0.05]}>
        <boxGeometry args={[0.42, 0.42, 0.04]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
      <mesh position={[0.18, 0.08, 0.07]}>
        <boxGeometry args={[0.42, 0.12, 0.03]} />
        <primitive object={m.frame} attach="material" />
      </mesh>
    </group>
  )
}

export function OccupancyDot({ position }: { position: [number, number, number] }) {
  const m = mats()
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.09, 16]} />
      <primitive object={m.dot} attach="material" />
    </mesh>
  )
}

/**
 * Anonymous occupant. Seated models already have hip
 * contact at about 0.46m with feet on the floor, so
 * callers should place them at ground height, not on the seat.
 */
export function PersonCapsule({
  position,
  rotation,
  seated = false,
  variant = 0,
}: P & { seated?: boolean; variant?: number }) {
  const m = mats()
  const mat = variant % 3 === 0 ? m.person : variant % 3 === 1 ? m.personAlt : m.personWarm
  const root = useOfficeModel(seated ? MODEL.personSeated : MODEL.personStanding, true)
  useLayoutEffect(() => {
    tintSlot(root, 'Body', mat.color, true)
  }, [root, mat])
  return (
    <group position={position} rotation={rotation}>
      <primitive object={root} />
    </group>
  )
}
