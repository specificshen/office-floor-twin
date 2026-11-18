import type { RoomState, Scenario, TimeKey } from '../types'

const MEETING_GEAR = ['投屏', '视频会议']
const SMALL_GEAR = ['投屏']
const FOCUS_GEAR = ['显示器', '降噪']
const HUDDLE_GEAR = ['白板']
const BOOTH_GEAR = ['视频电话']

function busy(until: string, next: string, equipment: string[] = []): RoomState {
  return { status: 'busy', until, next, equipment: equipment.length ? equipment : undefined }
}
function idle(next?: string, equipment?: string[]): RoomState {
  return { status: 'idle', next, equipment }
}
function soon(until: string, next?: string, equipment?: string[]): RoomState {
  return { status: 'soon', until, next, equipment }
}

const nowRooms: Record<string, RoomState> = {
  s1: busy('15:10', '16:00 已预留', SMALL_GEAR),
  s2: idle('16:30 已预留', SMALL_GEAR),
  m1: idle('15:30 已预留', MEETING_GEAR),
  m2: busy('15:00', '15:30 已预留', MEETING_GEAR),
  l: busy('16:00', '17:00 已预留', ['投屏', '视频会议', '无线传屏']),
  h1: busy('14:45', '之后空闲', HUDDLE_GEAR),
  h2: idle('15:00 已预留', HUDDLE_GEAR),
  b1: busy('14:35', '之后空闲', BOOTH_GEAR),
  b2: idle(undefined, BOOTH_GEAR),
  f1: busy('17:00', '之后空闲', FOCUS_GEAR),
  f2: idle(undefined, FOCUS_GEAR),
  pantry: soon('14:35', '14:35 下午茶'),
  reception: { status: 'busy', note: '访客办理中' },
  elevators: { status: 'idle', note: '3 台运行正常' },
  'north-desks': { status: 'busy', note: '中等偏忙' },
  'east-desks': { status: 'busy', note: '中等偏忙' },
}

const morningRooms: Record<string, RoomState> = {
  s1: busy('10:30', '11:00 已预留', SMALL_GEAR),
  s2: busy('11:00', '13:30 已预留', SMALL_GEAR),
  m1: busy('10:30', '11:00 已预留', MEETING_GEAR),
  m2: busy('11:00', '11:30 已预留', MEETING_GEAR),
  l: busy('12:00', '14:00 已预留', ['投屏', '视频会议', '无线传屏']),
  h1: busy('10:20', '10:40 已预留', HUDDLE_GEAR),
  h2: busy('10:30', '之后空闲', HUDDLE_GEAR),
  b1: busy('10:15', '10:30 已预留', BOOTH_GEAR),
  b2: idle('10:45 已预留', BOOTH_GEAR),
  f1: busy('12:00', '之后空闲', FOCUS_GEAR),
  f2: idle(undefined, FOCUS_GEAR),
  pantry: busy('10:30', '持续使用'),
  reception: { status: 'busy', note: '早间访客高峰' },
  elevators: { status: 'busy', note: '早间使用较密' },
  'north-desks': { status: 'busy', note: '几乎坐满' },
  'east-desks': { status: 'busy', note: '几乎坐满' },
}

const typicalRooms: Record<string, RoomState> = {
  s1: busy('15:00', '之后空闲', SMALL_GEAR),
  s2: idle(undefined, SMALL_GEAR),
  m1: idle('16:00 已预留', MEETING_GEAR),
  m2: busy('15:00', '之后空闲', MEETING_GEAR),
  l: idle('16:30 已预留', ['投屏', '视频会议', '无线传屏']),
  h1: busy('14:40', '之后空闲', HUDDLE_GEAR),
  h2: idle(undefined, HUDDLE_GEAR),
  b1: busy('14:30', '之后空闲', BOOTH_GEAR),
  b2: idle(undefined, BOOTH_GEAR),
  f1: busy('17:30', '之后空闲', FOCUS_GEAR),
  f2: idle(undefined, FOCUS_GEAR),
  pantry: idle(),
  reception: { status: 'idle', note: '访客较少' },
  elevators: { status: 'idle', note: '3 台运行正常' },
  'north-desks': { status: 'idle', note: '偏安静' },
  'east-desks': { status: 'idle', note: '偏安静' },
}

export const SCENARIOS: Record<TimeKey, Scenario> = {
  now: {
    key: 'now',
    label: '现在',
    clock: '14:20',
    occupancy: 62,
    meetingUsed: 6,
    meetingTotal: 11,
    energy: '正常',
    air: '良',
    visitors: 3,
    deskDensity: 0.52,
    walkers: 3,
    rooms: nowRooms,
  },
  morning: {
    key: 'morning',
    label: '今天',
    clock: '10:00',
    occupancy: 81,
    meetingUsed: 9,
    meetingTotal: 11,
    energy: '偏高',
    air: '良',
    visitors: 7,
    deskDensity: 0.78,
    walkers: 5,
    rooms: morningRooms,
  },
  typical: {
    key: 'typical',
    label: '典型周二',
    clock: '14:20',
    occupancy: 58,
    meetingUsed: 5,
    meetingTotal: 11,
    energy: '正常',
    air: '优',
    visitors: 2,
    deskDensity: 0.44,
    walkers: 2,
    rooms: typicalRooms,
  },
}

export const TIME_ORDER: TimeKey[] = ['now', 'morning', 'typical']

export const STATUS_LABEL: Record<string, string> = {
  idle: '空闲',
  busy: '使用中',
  soon: '即将开始',
}
