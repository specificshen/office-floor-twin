import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import type { Scenario } from '../types'
import { OVERVIEW_CAM } from '../data/layout'
import { CameraRig } from './CameraRig'
import { Elevators } from './Elevators'
import { FloorPlate } from './FloorPlate'
import { Lights } from './Lights'
import { Occupants } from './Occupants'
import { Picker } from './Picker'
import { Rooms } from './Rooms'

export function Experience({
  selected,
  scenario,
  onSelect,
  onBackground,
  onSection,
}: {
  selected: string
  scenario: Scenario
  onSelect: (id: string) => void
  onBackground: () => void
  onSection: () => void
}) {
  const statusOf = (id: string) => scenario.rooms[id]?.status ?? 'idle'
  const screenOn = (id: string) => {
    const st = scenario.rooms[id]?.status
    return st === 'busy' || st === 'soon'
  }

  return (
    <Canvas
      className="canvas-wrap"
      shadows
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.92,
        outputColorSpace: THREE.SRGBColorSpace,
        powerPreference: 'high-performance',
        alpha: false,
      }}
      camera={{
        fov: OVERVIEW_CAM.fov,
        near: 0.15,
        far: 160,
        position: OVERVIEW_CAM.pos,
      }}
    >
      <Lights />
      <CameraRig selected={selected} />
      <Picker onSelect={onSelect} onBackground={onBackground} onSection={onSection} />
      <FloorPlate />
      <Rooms statusOf={statusOf} screenOn={screenOn} />
      <Elevators />
      <Occupants scenario={scenario} />
    </Canvas>
  )
}
