import type { Scenario } from '../types'

export function TopBar({ scenario, onTitleClick }: { scenario: Scenario; onTitleClick?: () => void }) {
  const energyWarn = scenario.energy === '偏高'
  return (
    <header className="topbar">
      <div className="brand" onClick={onTitleClick} style={{ cursor: onTitleClick ? 'pointer' : 'default' }}>
        <i className="brand-mark" />
        <h1>12F · 办公层</h1>
        <span>CBD</span>
      </div>
      <div className="kpis">
        <Kpi label="整层占用" value={`${scenario.occupancy}%`} />
        <Kpi label="会议室" value={`${scenario.meetingUsed}/${scenario.meetingTotal}`} />
        <Kpi
          label="能耗"
          value={scenario.energy}
          delta={energyWarn ? '偏高' : '正常'}
          warn={energyWarn}
        />
        <Kpi label="空气质量" value={scenario.air} delta="实时" good={scenario.air === '优'} />
        <Kpi label="前台访客" value={String(scenario.visitors)} />
      </div>
      <div className="live">
        <i className="dot" />
        <span>
          {scenario.label} <b>{scenario.clock}</b>
        </span>
      </div>
    </header>
  )
}

function Kpi({
  label,
  value,
  delta,
  warn,
  good,
}: {
  label: string
  value: string
  delta?: string
  warn?: boolean
  good?: boolean
}) {
  return (
    <div className="kpi">
      <div className="label">{label}</div>
      <div className="value">
        {value}
        {delta && !['正常', '实时'].includes(delta) && (
          <span className={`delta ${warn ? 'warn' : good ? 'good' : ''}`}>{delta}</span>
        )}
      </div>
    </div>
  )
}
