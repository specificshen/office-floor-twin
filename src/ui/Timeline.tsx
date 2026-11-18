import type { TimeKey } from '../types'
import { SCENARIOS, TIME_ORDER } from '../data/scenarios'

export function Timeline({
  value,
  onChange,
}: {
  value: TimeKey
  onChange: (key: TimeKey) => void
}) {
  return (
    <div className="timeline" role="tablist" aria-label="时间轴">
      {TIME_ORDER.map((key) => {
        const s = SCENARIOS[key]
        const active = key === value
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active}
            className={`tl-btn${active ? ' active' : ''}`}
            onClick={() => onChange(key)}
          >
            <span className="lab">{s.label}</span>
            <span className="clk">{s.clock}</span>
          </button>
        )
      })}
    </div>
  )
}
