import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function Picker({
  onSelect,
  onBackground,
  onSection,
}: {
  onSelect: (id: string) => void
  onBackground: () => void
  onSection: () => void
}) {
  const { camera, gl, scene } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const ndc = useRef(new THREE.Vector2())
  const pointer = useRef({ x: 0, y: 0, moved: false, down: false })

  useEffect(() => {
    const el = gl.domElement
    const down = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY, moved: false, down: true }
    }
    const move = (e: PointerEvent) => {
      if (!pointer.current.down) return
      const dx = e.clientX - pointer.current.x
      const dy = e.clientY - pointer.current.y
      if (dx * dx + dy * dy > 25) pointer.current.moved = true
    }
    const up = (e: PointerEvent) => {
      const wasMoved = pointer.current.moved
      pointer.current.down = false
      if (wasMoved) return
      const rect = el.getBoundingClientRect()
      ndc.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      ndc.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.current.setFromCamera(ndc.current, camera)
      const hits = raycaster.current.intersectObjects(scene.children, true)
      for (const hit of hits) {
        let obj: THREE.Object3D | null = hit.object
        while (obj) {
          const data = obj.userData as { kind?: string; roomId?: string }
          if (data.kind === 'ignore' || data.kind === 'glass') {
            obj = obj.parent
            continue
          }
          if (data.kind === 'section') {
            onSection()
            return
          }
          if (data.roomId) {
            onSelect(data.roomId)
            return
          }
          if (data.kind === 'floor' || data.kind === 'ground') {
            onBackground()
            return
          }
          obj = obj.parent
        }
      }
      onBackground()
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
    }
  }, [camera, gl, scene, onSelect, onBackground, onSection])

  return null
}
