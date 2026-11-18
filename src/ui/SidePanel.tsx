import type { Scenario } from '../types'
import { ROOMS, ROOM_MAP } from '../data/layout'
import { STATUS_LABEL } from '../data/scenarios'

export function SidePanel({
  selected,
  scenario,
  onSelectRoom,
}: {
  selected: string
  scenario: Scenario
  onSelectRoom: (id: string) => void
}) {
  if (selected === 'overview' || !ROOM_MAP[selected]) {
    return <FloorSummary scenario={scenario} onSelectRoom={onSelectRoom} />
  }
  return <RoomDetail id={selected} scenario={scenario} />
}

function FloorSummary({
  scenario,
  onSelectRoom,
}: {
  scenario: Scenario
  onSelectRoom: (id: string) => void
}) {
  const bookable = ROOMS.filter((r) => r.bookable)
  const busy = bookable.filter((r) => scenario.rooms[r.id]?.status === 'busy')
  const soon = bookable.filter((r) => scenario.rooms[r.id]?.status === 'soon')
  const energyWarn = scenario.energy === '偏高'

  return (
    <aside className="side">
      <h2>整层摘要</h2>
      <div className="sub">12F · 当下这一层的使用情况</div>

      <div className="stat-grid">
        <div className="stat">
          <div className="k">整层占用</div>
          <div className="v">{scenario.occupancy}%</div>
          <div className={`bar${energyWarn && scenario.occupancy > 75 ? ' warn' : ''}`}>
            <i style={{ width: `${scenario.occupancy}%` }} />
          </div>
        </div>
        <div className="stat">
          <div className="k">会议室</div>
          <div className="v">
            {scenario.meetingUsed}/{scenario.meetingTotal}
          </div>
          <div className="bar">
            <i style={{ width: `${(scenario.meetingUsed / scenario.meetingTotal) * 100}%` }} />
          </div>
        </div>
        <div className="stat">
          <div className="k">前台访客</div>
          <div className="v">{scenario.visitors}</div>
        </div>
        <div className="stat">
          <div className="k">能耗 / 空气</div>
          <div className="v" style={{ fontSize: 16 }}>
            {scenario.energy} · {scenario.air}
          </div>
        </div>
      </div>

      <div className="section-title">使用中</div>
      <ul className="room-list">
        {busy.map((r) => {
          const st = scenario.rooms[r.id]
          return (
            <li key={r.id} onClick={() => onSelectRoom(r.id)}>
              <span className="name">{r.name}</span>
              <span className="meta">{st?.until ? `至 ${st.until}` : STATUS_LABEL.busy}</span>
            </li>
          )
        })}
        {soon.map((r) => (
          <li key={r.id} onClick={() => onSelectRoom(r.id)}>
            <span className="name">{r.name}</span>
            <span className="meta">{STATUS_LABEL.soon}</span>
          </li>
        ))}
        {busy.length === 0 && soon.length === 0 && (
          <li>
            <span className="meta">此刻没有进行中的会议</span>
          </li>
        )}
      </ul>

      <p className="hint">点击房间飞入查看详情，点击走道或楼板回到总览。人只以匿名色块表示，不显示姓名。</p>
    </aside>
  )
}

function RoomDetail({ id, scenario }: { id: string; scenario: Scenario }) {
  const room = ROOM_MAP[id]
  const st = scenario.rooms[id]
  const status = st?.status ?? 'idle'
  return (
    <aside className="side">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <h2>{room.name}</h2>
        <span className={`badge ${status}`}>
          <i className="pip" />
          {STATUS_LABEL[status] ?? status}
        </span>
      </div>
      <div className="sub">{kindLabel(room.kind)}</div>

      <div className="kv">
        {st?.until && (
          <>
            <div className="k">{status === 'soon' ? '开始' : '至'}</div>
            <div className="v">{st.until}</div>
          </>
        )}
        <div className="k">下一场</div>
        <div className="v">{st?.next ?? '暂无预留'}</div>
        {st?.note && (
          <>
            <div className="k">状态</div>
            <div className="v">{st.note}</div>
          </>
        )}
      </div>

      {st?.equipment && st.equipment.length > 0 && (
        <>
          <div className="section-title">设备</div>
          <div className="chips">
            {st.equipment.map((eq) => (
              <span key={eq} className="chip">
                {eq}
              </span>
            ))}
          </div>
        </>
      )}

      <p className="hint">
        {room.bookable
          ? '仅显示房间状态与档期，不展示与会者姓名。点击空白处返回整层摘要。'
          : '点击走道或楼板返回整层摘要。'}
      </p>
    </aside>
  )
}

function kindLabel(kind: string) {
  switch (kind) {
    case 'meeting':
      return '会议室'
    case 'huddle':
      return '洽谈间'
    case 'focus':
      return '专注室'
    case 'booth':
      return '电话间'
    case 'pantry':
      return '生活服务'
    case 'reception':
      return '楼层服务'
    case 'desks':
      return '开放工位'
    case 'core':
      return '垂直交通'
    default:
      return ''
  }
}
