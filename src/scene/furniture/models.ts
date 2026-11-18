import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import { mats } from '../materials'

export const MODEL = {
  taskChair: '/models/task-chair.glb',
  meetChair: '/models/meet-chair.glb',
  workDesk: '/models/work-desk.glb',
  monitor: '/models/monitor.glb',
  meetingTableS: '/models/meeting-table-s.glb',
  meetingTableM: '/models/meeting-table-m.glb',
  meetingTableL: '/models/meeting-table-l.glb',
  credenza: '/models/credenza.glb',
  floorPlantA: '/models/floor-plant-a.glb',
  floorPlantB: '/models/floor-plant-b.glb',
  deskPlant: '/models/desk-plant.glb',
  personStanding: '/models/person-standing.glb',
  personSeated: '/models/person-seated.glb',
  receptionDesk: '/models/reception-desk.glb',
  wallScreen: '/models/wall-screen.glb',
  elevatorCab: '/models/elevator-cab.glb',
} as const

export const MODEL_SIZE = {
  wallScreen: { w: 1.84, h: 1.04 },
  credenza: { w: 1.64 },
  meetingTableS: { w: 2.0, d: 0.95 },
  meetingTableM: { w: 2.7, d: 1.2 },
  monitor: { w: 0.476, h: 0.393 },
} as const

function cloneScene(scene: THREE.Object3D, uniqueMaterials: boolean) {
  const root = SkeletonUtils.clone(scene)
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return
    obj.castShadow = true
    obj.receiveShadow = true
    if (!uniqueMaterials) return
    if (Array.isArray(obj.material)) {
      obj.material = obj.material.map((m) => m.clone())
    } else if (obj.material) {
      obj.material = obj.material.clone()
    }
  })
  return root
}

export function tintSlot(
  root: THREE.Object3D,
  slot: string,
  color: THREE.Color,
  opaque = false,
) {
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return
    const list = Array.isArray(obj.material) ? obj.material : [obj.material]
    for (const mat of list) {
      if (mat?.name !== slot || !(mat instanceof THREE.MeshStandardMaterial)) continue
      mat.color.copy(color)
      if (opaque) {
        mat.transparent = false
        mat.opacity = 1
        mat.depthWrite = true
      }
    }
  })
}

export function tintScreen(root: THREE.Object3D, on: boolean) {
  const src = on ? mats().screenOn : mats().screen
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return
    const list = Array.isArray(obj.material) ? obj.material : [obj.material]
    for (const mat of list) {
      if (mat?.name !== 'Screen' || !(mat instanceof THREE.MeshStandardMaterial)) continue
      mat.color.copy(src.color)
      mat.emissive.copy(src.emissive)
      mat.emissiveIntensity = src.emissiveIntensity
      mat.roughness = src.roughness
      mat.metalness = src.metalness
    }
  })
}

/**
 * Clone a preloaded office glTF so many instances can
 * move independently and, when uniqueMaterials is set,
 * recolor a named slot without leaking to siblings.
 */
export function useOfficeModel(url: string, uniqueMaterials = false) {
  const { scene } = useGLTF(url)
  return useMemo(() => cloneScene(scene, uniqueMaterials), [scene, uniqueMaterials])
}

for (const url of Object.values(MODEL)) useGLTF.preload(url)
