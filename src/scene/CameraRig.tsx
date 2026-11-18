import { useEffect, useRef } from 'react'
import { CameraControls } from '@react-three/drei'
import { OVERVIEW_CAM, ROOM_MAP } from '../data/layout'

export function CameraRig({ selected }: { selected: string }) {
  const ref = useRef<CameraControls>(null)
  const booted = useRef(false)
  useEffect(() => {
    let raf = 0
    const apply = () => {
      const controls = ref.current
      if (!controls) {
        raf = requestAnimationFrame(apply)
        return
      }
      const room = selected === 'overview' ? null : ROOM_MAP[selected]
      const pos = room ? room.camPos : OVERVIEW_CAM.pos
      const target = room ? room.camTarget : OVERVIEW_CAM.target
      void controls.setLookAt(
        pos[0],
        pos[1],
        pos[2],
        target[0],
        target[1],
        target[2],
        booted.current,
      )
      booted.current = true
    }
    apply()
    return () => cancelAnimationFrame(raf)
  }, [selected])

  return (
    <CameraControls
      ref={ref}
      makeDefault
      minDistance={7}
      maxDistance={50}
      minPolarAngle={0.5}
      maxPolarAngle={1.22}
      smoothTime={0.7}
      draggingSmoothTime={0.18}
      truckSpeed={0.55}
      dollySpeed={0.55}
      azimuthRotateSpeed={0.4}
      polarRotateSpeed={0.35}
    />
  )
}
