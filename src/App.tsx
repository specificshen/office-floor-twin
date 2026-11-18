import { useCallback, useEffect, useState } from 'react'
import type { TimeKey } from './types'
import { SCENARIOS } from './data/scenarios'
import { Experience } from './scene/Experience'
import { SidePanel } from './ui/SidePanel'
import { Timeline } from './ui/Timeline'
import { Toast } from './ui/Toast'
import { TopBar } from './ui/TopBar'
import { BuildingSectionCard } from './ui/BuildingSectionCard'

export default function App() {
  const [timeKey, setTimeKey] = useState<TimeKey>('now')
  const [selected, setSelected] = useState('overview')
  const [toast, setToast] = useState<string | null>(null)
  const scenario = SCENARIOS[timeKey]

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(t)
  }, [toast])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected('overview')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onSelect = useCallback((id: string) => setSelected(id), [])
  const onBackground = useCallback(() => setSelected('overview'), [])
  const onSection = useCallback(() => setToast('换层后续再做'), [])

  return (
    <div className="app">
      <Experience
        selected={selected}
        scenario={scenario}
        onSelect={onSelect}
        onBackground={onBackground}
        onSection={onSection}
      />
      <TopBar scenario={scenario} onTitleClick={onBackground} />
      <SidePanel selected={selected} scenario={scenario} onSelectRoom={onSelect} />
      <Timeline value={timeKey} onChange={setTimeKey} />
      <BuildingSectionCard onClick={onSection} />
      {toast && <Toast text={toast} />}
    </div>
  )
}
