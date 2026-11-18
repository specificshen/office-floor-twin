const FLOORS = [15, 14, 13, 12, 11, 10]

export function BuildingSectionCard({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="bsection" onClick={onClick} aria-label="楼栋剖面，换层后续再做">
      <div className="cap">楼栋剖面</div>
      <ol>
        {FLOORS.map((f) => (
          <li key={f} className={f === 12 ? 'on' : undefined}>
            {f}F
          </li>
        ))}
      </ol>
    </button>
  )
}
