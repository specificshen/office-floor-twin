import { useMemo } from 'react'
import * as THREE from 'three'
import { COLUMNS, FLOOR, SHAFTS } from '../data/layout'
import { FloorPlant, LinearLight } from './furniture'
import { mats } from './materials'

export function FloorPlate() {
  const m = mats()
  const slabGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(FLOOR.minX, FLOOR.minZ)
    shape.lineTo(FLOOR.maxX, FLOOR.minZ)
    shape.lineTo(FLOOR.maxX, FLOOR.maxZ)
    shape.lineTo(FLOOR.minX, FLOOR.maxZ)
    shape.closePath()
    for (const sh of SHAFTS) {
      const hole = new THREE.Path()
      const hx = sh.w / 2
      const hz = sh.d / 2
      // Shape is XY; rotateX(-PI/2) maps y -> -z, so feed -sh.z to keep holes at +Z north.
      hole.moveTo(sh.x - hx, -(sh.z - hz))
      hole.lineTo(sh.x + hx, -(sh.z - hz))
      hole.lineTo(sh.x + hx, -(sh.z + hz))
      hole.lineTo(sh.x - hx, -(sh.z + hz))
      hole.closePath()
      shape.holes.push(hole)
    }
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: FLOOR.slabT,
      bevelEnabled: false,
      steps: 1,
    })
    geo.rotateX(-Math.PI / 2)
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <group>
      <mesh geometry={slabGeo} receiveShadow userData={{ kind: 'floor' }}>
        <primitive object={m.slab} attach="material" />
      </mesh>

      {/* void ground — soft campus table */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.6, 0]}
        receiveShadow
        userData={{ kind: 'ground' }}
      >
        <planeGeometry args={[90, 80]} />
        <primitive object={m.ground} attach="material" />
      </mesh>

      <PerimeterGlazing />
      <Columns />
      <OpenOfficeLights />
      <WindowPlanters />
      <ExteriorContext />
    </group>
  )
}

function Columns() {
  const m = mats()
  const h = FLOOR.wallH
  return (
    <group>
      {COLUMNS.map((c, i) => (
        <group key={i} position={[c[0], 0, c[2]]}>
          <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.42, h, 0.42]} />
            <primitive object={m.plaster} attach="material" />
          </mesh>
          <mesh position={[0, h + 0.03, 0]}>
            <boxGeometry args={[0.48, 0.06, 0.48]} />
            <primitive object={m.aluminum} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function PerimeterGlazing() {
  const m = mats()
  const { minX, maxX, minZ, maxZ, wallH, glassSill } = FLOOR
  const module = 2.0
  const sides: Array<{
    start: [number, number]
    end: [number, number]
    inward: [number, number]
  }> = [
    { start: [minX, maxZ], end: [maxX, maxZ], inward: [0, -1] }, // north
    { start: [minX, minZ], end: [maxX, minZ], inward: [0, 1] }, // south
    { start: [minX, minZ], end: [minX, maxZ], inward: [1, 0] }, // west
    { start: [maxX, minZ], end: [maxX, maxZ], inward: [-1, 0] }, // east
  ]

  return (
    <group>
      {sides.map((side, si) => {
        const dx = side.end[0] - side.start[0]
        const dz = side.end[1] - side.start[1]
        const len = Math.hypot(dx, dz)
        const ux = dx / len
        const uz = dz / len
        const count = Math.round(len / module)
        const w = len / count
        const yaw = Math.atan2(ux, uz) + Math.PI / 2
        const panes = []
        for (let i = 0; i < count; i++) {
          const cx = side.start[0] + ux * (i + 0.5) * w + side.inward[0] * 0.04
          const cz = side.start[1] + uz * (i + 0.5) * w + side.inward[1] * 0.04
          panes.push(
            <group key={`${si}-${i}`} position={[cx, 0, cz]} rotation={[0, yaw, 0]}>
              {/* sill */}
              <mesh position={[0, glassSill / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[w, glassSill, 0.16]} />
                <primitive object={m.stone} attach="material" />
              </mesh>
              {/* head / cap */}
              <mesh position={[0, wallH - 0.05, 0]} castShadow>
                <boxGeometry args={[w + 0.02, 0.1, 0.16]} />
                <primitive object={m.aluminum} attach="material" />
              </mesh>
              {/* mullions */}
              <mesh position={[-w / 2, wallH / 2, 0]} castShadow>
                <boxGeometry args={[0.05, wallH, 0.1]} />
                <primitive object={m.aluminum} attach="material" />
              </mesh>
              {i === count - 1 && (
                <mesh position={[w / 2, wallH / 2, 0]} castShadow>
                  <boxGeometry args={[0.05, wallH, 0.1]} />
                  <primitive object={m.aluminum} attach="material" />
                </mesh>
              )}
              {/* transom bar */}
              <mesh position={[0, 1.05, 0]}>
                <boxGeometry args={[w - 0.05, 0.03, 0.06]} />
                <primitive object={m.aluminum} attach="material" />
              </mesh>
              {/* glass */}
              <mesh position={[0, (glassSill + wallH - 0.1) / 2, 0]} userData={{ kind: 'glass' }}>
                <boxGeometry args={[w - 0.06, wallH - glassSill - 0.1, 0.03]} />
                <primitive object={m.glass} attach="material" />
              </mesh>
            </group>,
          )
        }
        return <group key={si}>{panes}</group>
      })}
    </group>
  )
}

function OpenOfficeLights() {
  const lights: Array<[number, number, number, number]> = []
  // north office, along X, two rows
  for (let x = -9.5; x <= 7; x += 3.2) {
    lights.push([x, 3.02, 12.2, 2.6])
    lights.push([x, 3.02, 8.6, 2.6])
  }
  // east office, along Z, three rows
  for (let z = -2.5; z <= 12.5; z += 3.2) {
    lights.push([17.8, 3.02, z, 2.6])
    lights.push([14.6, 3.02, z, 2.6])
    lights.push([11.4, 3.02, z, 2.6])
  }
  // corridor
  for (let x = -9; x <= 16; x += 3.4) {
    lights.push([x, 3.02, -5.6, 2.4])
  }
  // lobby
  lights.push([2.2, 3.02, 2.2, 2.2])
  lights.push([5.6, 3.02, 2.2, 2.2])

  return (
    <group>
      {lights.map((l, i) => (
        <LinearLight
          key={i}
          position={[l[0], l[1], l[2]]}
          length={l[3]}
          rotation={l[2] < -4 || l[2] > 7 || Math.abs(l[0]) < 8 ? [0, 0, 0] : [0, Math.PI / 2, 0]}
        />
      ))}
    </group>
  )
}

function WindowPlanters() {
  const north: [number, number][] = [
    [-9.5, 13.55],
    [-5.5, 13.55],
    [-1.5, 13.55],
    [2.5, 13.55],
    [6.2, 13.55],
  ]
  const east: [number, number][] = [
    [19.45, 11],
    [19.45, 6.5],
    [19.45, 2],
    [19.45, -2.2],
  ]
  return (
    <group>
      {north.map(([x, z], i) => (
        <FloorPlant key={`n${i}`} position={[x, 0, z]} variant={i} scale={0.95} />
      ))}
      {east.map(([x, z], i) => (
        <FloorPlant key={`e${i}`} position={[x, 0, z]} variant={i + 2} scale={0.95} />
      ))}
    </group>
  )
}


function ExteriorContext() {
  return (
    <group userData={{ kind: 'ground' }}>
      {/* soft sky cards just outside the curtain wall so glass can read */}
      <mesh position={[0, 7, 32]}>
        <planeGeometry args={[80, 24]} />
        <meshBasicMaterial color="#8ea7bb" />
      </mesh>
      <mesh position={[32, 7, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[80, 24]} />
        <meshBasicMaterial color="#97aec0" />
      </mesh>
      <mesh position={[-32, 7, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[80, 24]} />
        <meshBasicMaterial color="#9ab0c2" />
      </mesh>
      <mesh position={[0, 7, -32]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[80, 24]} />
        <meshBasicMaterial color="#94abc0" />
      </mesh>
      {/* under-slab contact darkening */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.43, 0]}>
        <planeGeometry args={[42, 30]} />
        <meshBasicMaterial color="#8d97a2" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}
