import type { RoomDef, Vec3 } from '../types'

/** Floor plate in meters. Origin at slab center. +Z = north, +X = east. */
export const FLOOR = {
  width: 40,
  depth: 28,
  minX: -20,
  maxX: 20,
  minZ: -14,
  maxZ: 14,
  wallH: 3.15,
  slabT: 0.42,
  glassSill: 0.12,
} as const

export const OVERVIEW_CAM = {
  pos: [10.5, 22.0, -26.5] as Vec3,
  target: [-8.5, 0.2, -0.8] as Vec3,
  fov: 30,
}

/**
 * West rooms fill the west curtain wall, north to south:
 * S1, S2, M1, M2, L.
 * North desks sit along the north windows, east of the west wing.
 * East desks along the east windows.
 * Core: three elevator shafts + reception.
 * South strip: huddle, phone booths, focus rooms, pantry.
 */
export const ROOMS: RoomDef[] = [
  {
    id: 's1',
    name: '小会议室 S1',
    kind: 'meeting',
    bookable: true,
    bounds: { x: -15.6, z: 12.0, w: 8.8, d: 4.0 },
    door: 'e',
    camPos: [-7.2, 6.8, 9.4],
    camTarget: [-15.2, 1.05, 12.0],
    accent: '#7a8ea3',
  },
  {
    id: 's2',
    name: '小会议室 S2',
    kind: 'meeting',
    bookable: true,
    bounds: { x: -15.6, z: 8.0, w: 8.8, d: 4.0 },
    door: 'e',
    camPos: [-7.2, 6.8, 5.6],
    camTarget: [-15.2, 1.05, 8.0],
    accent: '#7a8ea3',
  },
  {
    id: 'm1',
    name: '中型会议室 M1',
    kind: 'meeting',
    bookable: true,
    bounds: { x: -15.6, z: 3.3, w: 8.8, d: 5.4 },
    door: 'e',
    camPos: [-6.6, 7.4, 0.4],
    camTarget: [-15.2, 1.1, 3.3],
    accent: '#6d8b9c',
  },
  {
    id: 'm2',
    name: '中型会议室 M2',
    kind: 'meeting',
    bookable: true,
    bounds: { x: -15.6, z: -2.1, w: 8.8, d: 5.4 },
    door: 'e',
    camPos: [-7.4, 5.5, -5.6],
    camTarget: [-15.0, 0.9, -2.0],
    accent: '#6d8b9c',
  },
  {
    id: 'l',
    name: '大会议室 L',
    kind: 'meeting',
    bookable: true,
    bounds: { x: -15.25, z: -9.4, w: 9.5, d: 9.2 },
    door: 'e',
    camPos: [-5.2, 8.0, -16.4],
    camTarget: [-14.6, 1.0, -9.0],
    accent: '#5d7a8c',
  },
  {
    id: 'h1',
    name: '洽谈间 H1',
    kind: 'huddle',
    bookable: true,
    bounds: { x: -7.85, z: -10.6, w: 5.3, d: 6.8 },
    door: 'n',
    camPos: [-7.6, 6.8, -3.6],
    camTarget: [-7.85, 1.0, -10.2],
    accent: '#8a7b6a',
  },
  {
    id: 'h2',
    name: '洽谈间 H2',
    kind: 'huddle',
    bookable: true,
    bounds: { x: -2.45, z: -10.6, w: 5.5, d: 6.8 },
    door: 'n',
    camPos: [-2.3, 6.8, -3.6],
    camTarget: [-2.45, 1.0, -10.2],
    accent: '#8a7b6a',
  },
  {
    id: 'b1',
    name: '电话间 B1',
    kind: 'booth',
    bookable: true,
    bounds: { x: 1.3, z: -12.15, w: 2.4, d: 3.7 },
    door: 'n',
    camPos: [1.4, 5.2, -7.2],
    camTarget: [1.3, 1.15, -11.8],
    accent: '#6e7c70',
  },
  {
    id: 'b2',
    name: '电话间 B2',
    kind: 'booth',
    bookable: true,
    bounds: { x: 3.8, z: -12.15, w: 2.4, d: 3.7 },
    door: 'n',
    camPos: [3.9, 5.2, -7.2],
    camTarget: [3.8, 1.15, -11.8],
    accent: '#6e7c70',
  },
  {
    id: 'f1',
    name: '专注室 F1',
    kind: 'focus',
    bookable: true,
    bounds: { x: 6.95, z: -10.6, w: 3.9, d: 6.8 },
    door: 'n',
    camPos: [7.0, 6.6, -3.8],
    camTarget: [6.95, 1.0, -10.3],
    accent: '#7b6e8a',
  },
  {
    id: 'f2',
    name: '专注室 F2',
    kind: 'focus',
    bookable: true,
    bounds: { x: 10.95, z: -10.6, w: 4.1, d: 6.8 },
    door: 'n',
    camPos: [11.0, 6.6, -3.8],
    camTarget: [10.95, 1.0, -10.3],
    accent: '#7b6e8a',
  },
  {
    id: 'pantry',
    name: '茶水间',
    kind: 'pantry',
    bookable: false,
    bounds: { x: 16.55, z: -10.6, w: 6.9, d: 6.8 },
    door: 'n',
    camPos: [13.4, 7.4, -4.0],
    camTarget: [16.4, 1.0, -10.2],
  },
  {
    id: 'reception',
    name: '前台',
    kind: 'reception',
    bookable: false,
    bounds: { x: 5.55, z: 2.15, w: 5.9, d: 8.1 },
    door: 's',
    camPos: [10.6, 8.2, -7.4],
    camTarget: [5.2, 1.0, 1.8],
  },
  {
    id: 'elevators',
    name: '电梯厅',
    kind: 'core',
    bookable: false,
    bounds: { x: -3.15, z: 2.4, w: 8.1, d: 5.4 },
    door: 'e',
    camPos: [6.2, 8.0, -4.8],
    camTarget: [-3.0, 1.4, 2.2],
  },
  {
    id: 'north-desks',
    name: '北侧工位区',
    kind: 'desks',
    bookable: false,
    bounds: { x: -1.35, z: 10.05, w: 19.7, d: 7.9 },
    door: 's',
    camPos: [-1.2, 9.6, 2.2],
    camTarget: [-1.35, 0.7, 11.2],
  },
  {
    id: 'east-desks',
    name: '东侧工位区',
    kind: 'desks',
    bookable: false,
    bounds: { x: 14.25, z: 4.55, w: 11.5, d: 18.9 },
    door: 'w',
    camPos: [5.6, 10.2, -8.8],
    camTarget: [14.6, 0.7, 5.0],
  },
]

export const ROOM_MAP: Record<string, RoomDef> = Object.fromEntries(
  ROOMS.map((r) => [r.id, r]),
)

export const BOOKABLE_IDS = ROOMS.filter((r) => r.bookable).map((r) => r.id)

/** Elevator shaft footprints (world centers), cut out of the slab. */
export const SHAFTS = [
  { x: -6.15, z: 2.55, w: 2.15, d: 2.5 },
  { x: -3.7, z: 2.55, w: 2.15, d: 2.5 },
  { x: -1.25, z: 2.55, w: 2.15, d: 2.5 },
] as const

/** Structural grid columns (centers). */
export const COLUMNS: Vec3[] = [
  [-11.2, 0, 6.2],
  [-11.2, 0, -4.6],
  [0.4, 0, 6.2],
  [8.5, 0, 6.2],
  [8.5, 0, -4.6],
  [8.5, 0, 13.55],
]

export function boundsOf(id: string): RoomDef {
  const room = ROOM_MAP[id]
  if (!room) throw new Error(`Unknown room: ${id}`)
  return room
}
