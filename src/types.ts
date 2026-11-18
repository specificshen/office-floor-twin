export type TimeKey = 'now' | 'morning' | 'typical'

export type RoomStatus = 'idle' | 'busy' | 'soon'

export type RoomKind =
  | 'meeting'
  | 'focus'
  | 'huddle'
  | 'booth'
  | 'pantry'
  | 'reception'
  | 'desks'
  | 'core'

export type EnergyLevel = '正常' | '偏高'
export type AirLevel = '优' | '良'

export type Vec3 = [number, number, number]

export interface Bounds {
  /** center X */
  x: number
  /** center Z */
  z: number
  w: number
  d: number
}

export interface RoomDef {
  id: string
  name: string
  kind: RoomKind
  /** counts toward the 11 bookable meeting-type rooms */
  bookable: boolean
  bounds: Bounds
  /** corridor-facing door side */
  door: 'n' | 's' | 'e' | 'w'
  camPos: Vec3
  camTarget: Vec3
  accent?: string
}

export interface RoomState {
  status: RoomStatus
  until?: string
  next?: string
  equipment?: string[]
  note?: string
}

export interface Scenario {
  key: TimeKey
  label: string
  clock: string
  occupancy: number
  meetingUsed: number
  meetingTotal: number
  energy: EnergyLevel
  air: AirLevel
  visitors: number
  deskDensity: number
  walkers: number
  rooms: Record<string, RoomState>
}
