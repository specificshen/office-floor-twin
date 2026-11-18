import { Text } from '@react-three/drei'
import type { RoomDef, RoomStatus } from '../types'
import { FLOOR, ROOMS } from '../data/layout'
import {
  BoatTable,
  CafeTable,
  CoffeeTable,
  Credenza,
  Desk,
  DeskPlant,
  FloorPlant,
  LinearLight,
  LogoWall,
  MeetChair,
  MeetingTable,
  OccupancyDot,
  PantryCounter,
  ReceptionDesk,
  Stool,
  TaskChair,
  WaitingSeat,
  WallScreen,
} from './furniture'
import { mats } from './materials'

const WALL_T = 0.07
const DOOR_W = 0.96
const DOOR_H = 2.15

export function Rooms({
  statusOf,
  screenOn,
}: {
  statusOf: (id: string) => RoomStatus
  screenOn: (id: string) => boolean
}) {
  return (
    <group>
      {ROOMS.map((room) => (
        <RoomUnit
          key={room.id}
          room={room}
          status={statusOf(room.id)}
          screenOn={screenOn(room.id)}
        />
      ))}
    </group>
  )
}

function RoomUnit({
  room,
  status,
  screenOn,
}: {
  room: RoomDef
  status: RoomStatus
  screenOn: boolean
}) {
  const { x, z } = room.bounds
  return (
    <group position={[x, 0, z]} userData={{ roomId: room.id }}>
      <RoomShell room={room} status={status} />
      <RoomFitout room={room} screenOn={screenOn} />
    </group>
  )
}

function carpetMaterial(kind: RoomDef['kind']) {
  const m = mats()
  if (kind === 'desks') return m.floorOffice
  if (kind === 'core') return m.floorCore
  if (kind === 'pantry') return m.floorPantry
  if (kind === 'reception') return m.floorCore
  if (kind === 'meeting' || kind === 'huddle') return m.floorCarpetBlue
  if (kind === 'focus' || kind === 'booth') return m.floorCarpetWarm
  return m.floorCarpet
}

function RoomShell({ room, status }: { room: RoomDef; status: RoomStatus }) {
  const m = mats()
  const { kind, door, name, id } = room
  const { w, d } = room.bounds
  const h = kind === 'desks' ? 0 : FLOOR.wallH
  const floorY = 0.012

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, floorY, 0]}
        receiveShadow
        userData={{ roomId: room.id }}
      >
        <planeGeometry args={[w - 0.08, d - 0.08]} />
        <primitive object={carpetMaterial(kind)} attach="material" />
      </mesh>

      {kind !== 'desks' && kind !== 'core' && (
        <Walls
          w={w}
          d={d}
          h={h}
          door={door}
          solid={kind === 'booth'}
          skip={exteriorSides(room)}
        />
      )}

      {(status === 'busy' || status === 'soon') && kind !== 'desks' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} userData={{ kind: 'ignore' }}>
          <planeGeometry args={[Math.max(0.6, w - 0.3), Math.max(0.6, d - 0.3)]} />
          <primitive object={status === 'busy' ? m.glowBusy : m.glowSoon} attach="material" />
        </mesh>
      )}

      {(status === 'busy' || status === 'soon') && kind !== 'desks' && kind !== 'core' && (
        <pointLight
          position={[0, 2.3, 0]}
          color={status === 'busy' ? '#ffc27a' : '#ffe09a'}
          intensity={status === 'busy' ? 3.2 : 1.6}
          distance={Math.max(w, d) * 1.35}
          decay={2}
        />
      )}

      {kind !== 'desks' && kind !== 'core' && (
        <LinearLight position={[0, 3.0, 0]} length={Math.min(w, d) * 0.7} />
      )}

      {kind !== 'desks' && kind !== 'core' && (
        <Text
          position={[0, 0.03, door === 'n' ? d * 0.32 : door === 's' ? -d * 0.32 : 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.28}
          color="#6a7380"
          anchorX="center"
          anchorY="middle"
          userData={{ kind: 'ignore' }}
        >
          {shortLabel(id, name)}
        </Text>
      )}
    </group>
  )
}

function shortLabel(id: string, name: string) {
  if (id === 'pantry') return 'TEA'
  if (id === 'reception') return 'LOBBY'
  const code = name.split(' ').pop()
  return code ?? id.toUpperCase()
}

function exteriorSides(room: RoomDef): RoomDef['door'][] {
  const { x, z, w, d } = room.bounds
  const sides: RoomDef['door'][] = []
  if (Math.abs(x - w / 2 - FLOOR.minX) < 0.25) sides.push('w')
  if (Math.abs(x + w / 2 - FLOOR.maxX) < 0.25) sides.push('e')
  if (Math.abs(z - d / 2 - FLOOR.minZ) < 0.25) sides.push('s')
  if (Math.abs(z + d / 2 - FLOOR.maxZ) < 0.25) sides.push('n')
  return sides
}

function Walls({
  w,
  d,
  h,
  door,
  solid,
  skip,
}: {
  w: number
  d: number
  h: number
  door: RoomDef['door']
  solid?: boolean
  skip: RoomDef['door'][]
}) {
  const t = WALL_T
  const sides: Array<{ side: RoomDef['door']; len: number; pos: [number, number, number]; rot: number }> = [
    { side: 'n', len: w, pos: [0, h / 2, d / 2 - t / 2], rot: 0 },
    { side: 's', len: w, pos: [0, h / 2, -d / 2 + t / 2], rot: 0 },
    { side: 'e', len: d, pos: [w / 2 - t / 2, h / 2, 0], rot: Math.PI / 2 },
    { side: 'w', len: d, pos: [-w / 2 + t / 2, h / 2, 0], rot: Math.PI / 2 },
  ]

  return (
    <group>
      {sides.map((s) => {
        if (skip.includes(s.side)) return null
        if (s.side === door) {
          return (
            <DoorWall
              key={s.side}
              length={s.len}
              height={h}
              thickness={t}
              position={s.pos}
              rotation={s.rot}
              solid={solid}
            />
          )
        }
        // Demising walls are solid so stacked glass doesn't turn into a grey fog
        return (
          <SolidWall
            key={s.side}
            length={s.len}
            height={h}
            thickness={t}
            position={s.pos}
            rotation={s.rot}
            booth={solid}
          />
        )
      })}
    </group>
  )
}

function SolidWall({
  length,
  height,
  thickness,
  position,
  rotation,
  booth,
}: {
  length: number
  height: number
  thickness: number
  position: [number, number, number]
  rotation: number
  booth?: boolean
}) {
  const m = mats()
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[length, height, thickness]} />
        <primitive object={booth ? m.wallSage : m.wall} attach="material" />
      </mesh>
      <mesh position={[0, height / 2 - 0.03, 0]}>
        <boxGeometry args={[length, 0.04, thickness + 0.015]} />
        <primitive object={m.frame} attach="material" />
      </mesh>
    </group>
  )
}

function DoorWall({
  length,
  height,
  thickness,
  position,
  rotation,
}: {
  length: number
  height: number
  thickness: number
  position: [number, number, number]
  rotation: number
  solid?: boolean
}) {
  const m = mats()
  const side = (length - DOOR_W) / 2
  const header = height - DOOR_H
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[-(DOOR_W / 2 + side / 2), 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[side, height, thickness]} />
        <primitive object={m.wall} attach="material" />
      </mesh>
      <mesh position={[DOOR_W / 2 + side / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[side, height, thickness]} />
        <primitive object={m.wall} attach="material" />
      </mesh>
      <mesh position={[0, height / 2 - header / 2, 0]} castShadow>
        <boxGeometry args={[DOOR_W, header, thickness]} />
        <primitive object={m.wall} attach="material" />
      </mesh>
      {/* door leaf */}
      <mesh position={[0, -height / 2 + DOOR_H / 2, 0]} userData={{ kind: 'glass' }}>
        <boxGeometry args={[DOOR_W - 0.06, DOOR_H - 0.04, 0.03]} />
        <primitive object={m.glassDoor} attach="material" />
      </mesh>
      <mesh position={[DOOR_W * 0.28, -height / 2 + 1.0, 0.03]}>
        <boxGeometry args={[0.08, 0.012, 0.03]} />
        <primitive object={m.chrome} attach="material" />
      </mesh>
      {/* frames */}
      {([-DOOR_W / 2, DOOR_W / 2] as const).map((x) => (
        <mesh key={x} position={[x, -height / 2 + DOOR_H / 2, 0]} castShadow>
          <boxGeometry args={[0.04, DOOR_H, thickness + 0.02]} />
          <primitive object={m.frame} attach="material" />
        </mesh>
      ))}
    </group>
  )
}


function RoomFitout({ room, screenOn }: { room: RoomDef; screenOn: boolean }) {
  switch (room.id) {
    case 's1':
    case 's2':
      return <SmallMeeting screenOn={screenOn} />
    case 'm1':
    case 'm2':
      return <MediumMeeting screenOn={screenOn} />
    case 'l':
      return <LargeMeeting screenOn={screenOn} />
    case 'h1':
    case 'h2':
      return <Huddle />
    case 'b1':
    case 'b2':
      return <Booth screenOn={screenOn} />
    case 'f1':
    case 'f2':
      return <FocusRoom />
    case 'pantry':
      return <Pantry />
    case 'reception':
      return <Reception />
    case 'elevators':
      return null
    case 'north-desks':
      return <NorthDesks />
    case 'east-desks':
      return <EastDesks />
    default:
      return null
  }
}

function SmallMeeting({ screenOn }: { screenOn: boolean }) {
  return (
    <group>
      <MeetingTable position={[0.2, 0, 0]} size={[2.0, 0.95]} />
      <MeetChair position={[0.3, 0, 0.72]} rotation={[0, Math.PI, 0]} color="gray" />
      <MeetChair position={[-0.3, 0, 0.72]} rotation={[0, Math.PI, 0]} color="gray" />
      <MeetChair position={[0.3, 0, -0.72]} color="gray" />
      <MeetChair position={[-0.3, 0, -0.72]} color="gray" />
      <WallScreen position={[-4.15, 1.45, 0]} rotation={[0, Math.PI / 2, 0]} width={1.4} height={0.8} on={screenOn} />
      <DeskPlant position={[0.9, 0.75, 0.2]} />
      <FloorPlant position={[3.5, 0, 1.4]} scale={0.85} />
    </group>
  )
}

function MediumMeeting({ screenOn }: { screenOn: boolean }) {
  return (
    <group>
      <MeetingTable position={[0.15, 0, 0]} size={[2.7, 1.2]} />
      {([-0.9, -0.3, 0.3, 0.9] as const).map((x) => (
        <group key={x}>
          <MeetChair position={[x, 0, 0.88]} rotation={[0, Math.PI, 0]} color="blue" />
          <MeetChair position={[x, 0, -0.88]} color="blue" />
        </group>
      ))}
      <WallScreen position={[-4.15, 1.55, 0]} rotation={[0, Math.PI / 2, 0]} width={2.0} height={1.1} on={screenOn} />
      <Credenza position={[-1.2, 0, 2.25]} width={1.6} />
      <FloorPlant position={[3.55, 0, 2.1]} variant={1} scale={0.9} />
    </group>
  )
}

function LargeMeeting({ screenOn }: { screenOn: boolean }) {
  const xs = [-1.8, -1.1, -0.4, 0.4, 1.1, 1.8]
  return (
    <group>
      <BoatTable position={[0.1, 0, 0]} />
      {xs.map((x) => (
        <group key={x}>
          <MeetChair position={[x, 0, 1.05]} rotation={[0, Math.PI, 0]} color="ink" />
          <MeetChair position={[x, 0, -1.05]} color="ink" />
        </group>
      ))}
      <MeetChair position={[-2.55, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="ink" />
      <MeetChair position={[2.55, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color="ink" />
      <WallScreen position={[-4.5, 1.65, 0]} rotation={[0, Math.PI / 2, 0]} width={2.6} height={1.35} on={screenOn} />
      <Credenza position={[0, 0, 4.1]} width={2.4} />
      <FloorPlant position={[3.8, 0, 3.7]} variant={2} />
      <FloorPlant position={[3.8, 0, -3.7]} variant={3} />
    </group>
  )
}

function Huddle() {
  return (
    <group>
      <MeetingTable position={[0, 0, -0.2]} size={[1.3, 1.3]} />
      <MeetChair position={[0, 0, 0.75]} rotation={[0, Math.PI, 0]} color="sand" />
      <MeetChair position={[0, 0, -1.05]} color="sand" />
      <MeetChair position={[-0.85, 0, -0.2]} rotation={[0, Math.PI / 2, 0]} color="sand" />
      <MeetChair position={[0.85, 0, -0.2]} rotation={[0, -Math.PI / 2, 0]} color="sand" />
      <FloorPlant position={[-1.9, 0, -2.6]} scale={0.8} variant={1} />
    </group>
  )
}

function Booth({ screenOn }: { screenOn: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.42, 0.4]}>
        <boxGeometry args={[1.5, 0.08, 0.5]} />
        <primitive object={mats().fabricSage} attach="material" />
      </mesh>
      <mesh position={[0, 0.7, 0.62]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[1.5, 0.4, 0.08]} />
        <primitive object={mats().fabricSage} attach="material" />
      </mesh>
      <WallScreen position={[0, 1.35, -1.6]} width={0.7} height={0.45} on={screenOn} />
      <DeskPlant position={[0.55, 0.46, 0.3]} />
    </group>
  )
}

function FocusRoom() {
  return (
    <group>
      <Desk position={[0.15, 0, -0.4]} rotation={[0, Math.PI, 0]} hasMonitor lamp plant />
      <TaskChair position={[0.15, 0, 0.35]} color="sage" />
      <FloorPlant position={[-1.35, 0, -2.6]} scale={0.85} variant={2} />
    </group>
  )
}

function Pantry() {
  return (
    <group>
      <PantryCounter position={[0.2, 0, -2.55]} />
      <Stool position={[-0.6, 0, -1.85]} />
      <Stool position={[0.15, 0, -1.85]} />
      <Stool position={[0.9, 0, -1.85]} />
      <CafeTable position={[-1.6, 0, 1.3]} />
      <MeetChair position={[-1.6, 0, 1.95]} rotation={[0, Math.PI, 0]} color="sand" />
      <MeetChair position={[-1.6, 0, 0.65]} color="sand" />
      <FloorPlant position={[2.6, 0, 2.4]} variant={0} scale={0.9} />
    </group>
  )
}

function Reception() {
  return (
    <group>
      <LogoWall position={[0.2, 1.2, 3.6]} />
      <ReceptionDesk position={[0.1, 0, 1.1]} rotation={[0, Math.PI, 0]} />
      <TaskChair position={[0.4, 0, 1.55]} rotation={[0, Math.PI, 0]} color="gray" />
      <WaitingSeat position={[-1.5, 0, -2.5]} rotation={[0, 0.4, 0]} />
      <WaitingSeat position={[-0.65, 0, -2.7]} rotation={[0, 0.15, 0]} />
      <CoffeeTable position={[-1.1, 0, -1.85]} />
      <FloorPlant position={[2.2, 0, 3.4]} variant={1} />
      <FloorPlant position={[-2.2, 0, 3.4]} variant={4} />
    </group>
  )
}

type DeskSpot = { pos: [number, number, number]; rot: number; id: number }

function northDeskSpots(): DeskSpot[] {
  const spots: DeskSpot[] = []
  let id = 0
  for (const z of [2.45, -0.85]) {
    for (let i = 0; i < 9; i++) {
      const x = -8.8 + i * 1.95
      spots.push({ pos: [x, 0, z], rot: z > 0 ? 0 : Math.PI, id: id++ })
    }
  }
  return spots
}

function eastDeskSpots(): DeskSpot[] {
  const spots: DeskSpot[] = []
  let id = 100
  for (const x of [3.9, 0.7, -2.5]) {
    for (let i = 0; i < 8; i++) {
      const z = -7.6 + i * 2.05
      spots.push({ pos: [x, 0, z], rot: x > 2 ? Math.PI / 2 : -Math.PI / 2, id: id++ })
    }
  }
  return spots
}

export const NORTH_SPOTS = northDeskSpots()
export const EAST_SPOTS = eastDeskSpots()

function NorthDesks() {
  return (
    <group>
      {NORTH_SPOTS.map((s, i) => (
        <group key={s.id} position={s.pos} rotation={[0, s.rot, 0]}>
          <Desk hasMonitor dual={i % 5 === 0} plant={i % 4 === 1} lamp={i % 6 === 2} />
          <TaskChair position={[0, 0, 0.72]} color={i % 3 === 0 ? 'blue' : i % 3 === 1 ? 'gray' : 'sage'} />
        </group>
      ))}
    </group>
  )
}

function EastDesks() {
  return (
    <group>
      {EAST_SPOTS.map((s, i) => (
        <group key={s.id} position={s.pos} rotation={[0, s.rot, 0]}>
          <Desk hasMonitor dual={i % 6 === 0} plant={i % 5 === 2} lamp={i % 7 === 1} />
          <TaskChair position={[0, 0, 0.72]} color={i % 3 === 0 ? 'blue' : i % 3 === 1 ? 'gray' : 'sand'} />
        </group>
      ))}
    </group>
  )
}

export function DeskDots({ density }: { density: number }) {
  const spots = [...NORTH_SPOTS.map((s) => ({ ...s, zone: 'north-desks' })), ...EAST_SPOTS.map((s) => ({ ...s, zone: 'east-desks' }))]
  return (
    <group userData={{ kind: 'ignore' }}>
      {spots.map((s) => {
        if (hash(s.id * 17.13 + density * 9.1) > density) return null
        // world position: parent room center + local
        const center =
          s.zone === 'north-desks'
            ? { x: -1.35, z: 10.05 }
            : { x: 14.25, z: 4.55 }
        const ca = Math.cos(s.rot)
        const sa = Math.sin(s.rot)
        // a point slightly above the seat (local 0,0,0.15 toward chair is +z after desk)
        const lx = 0
        const lz = 0.15
        const wx = center.x + s.pos[0] + lx * ca - lz * sa
        const wz = center.z + s.pos[2] + lx * sa + lz * ca
        return <OccupancyDot key={s.id} position={[wx, 0.78, wz]} />
      })}
    </group>
  )
}

function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}
