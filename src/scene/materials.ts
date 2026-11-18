import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

let _cache: ReturnType<typeof createMaterials> | null = null

function std(
  color: string,
  extras: ConstructorParameters<typeof THREE.MeshStandardMaterial>[0] = {},
) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.5,
    metalness: 0.04,
    ...extras,
  })
}

function createMaterials() {
  const glass = new THREE.MeshPhysicalMaterial({
    color: '#6f93a8',
    roughness: 0.06,
    metalness: 0.12,
    transparent: true,
    opacity: 0.13,
    envMapIntensity: 1.6,
    clearcoat: 0.8,
    clearcoatRoughness: 0.08,
    side: THREE.DoubleSide,
    depthWrite: false,
  })

  const glassDoor = new THREE.MeshPhysicalMaterial({
    color: '#62879c',
    roughness: 0.07,
    metalness: 0.14,
    transparent: true,
    opacity: 0.2,
    envMapIntensity: 1.4,
    clearcoat: 0.7,
    clearcoatRoughness: 0.1,
    side: THREE.DoubleSide,
    depthWrite: false,
  })

  return {
    slab: std('#d9d2c6', { roughness: 0.48, metalness: 0.02 }),
    slabEdge: std('#d5cfc4', { roughness: 0.5, metalness: 0.02 }),
    floorOffice: std('#c4a882', { roughness: 0.4, metalness: 0.04 }),
    floorCarpet: std('#c2b8aa', { roughness: 0.82, metalness: 0.0 }),
    floorCarpetBlue: std('#9aa7b3', { roughness: 0.84, metalness: 0.0 }),
    floorCarpetWarm: std('#c3ad93', { roughness: 0.84, metalness: 0.0 }),
    floorCore: std('#c8c4bc', { roughness: 0.4, metalness: 0.05 }),
    floorPantry: std('#cfc9c0', { roughness: 0.32, metalness: 0.08 }),
    ground: std('#b7c3cf', { roughness: 1, metalness: 0 }),
    wall: std('#f3f1ec', { roughness: 0.72, metalness: 0 }),
    wallWarm: std('#efe6da', { roughness: 0.74, metalness: 0 }),
    wallSage: std('#d5ddd4', { roughness: 0.78, metalness: 0 }),
    wallClay: std('#e2d0c3', { roughness: 0.78, metalness: 0 }),
    wallBlue: std('#d5dee6', { roughness: 0.78, metalness: 0 }),
    plaster: std('#eceae5', { roughness: 0.7, metalness: 0 }),
    frame: std('#dfe3e8', { roughness: 0.28, metalness: 0.62 }),
    frameDark: std('#8b949e', { roughness: 0.32, metalness: 0.55 }),
    aluminum: std('#c5ccd3', { roughness: 0.22, metalness: 0.72 }),
    wood: std('#c4a27a', { roughness: 0.32, metalness: 0.04 }),
    woodLight: std('#d2b492', { roughness: 0.34, metalness: 0.03 }),
    woodDark: std('#8d6a48', { roughness: 0.4, metalness: 0.05 }),
    woodOak: std('#c9ae8a', { roughness: 0.3, metalness: 0.04 }),
    fabricBlue: std('#6d7d90', { roughness: 0.82, metalness: 0 }),
    fabricGray: std('#8b8f93', { roughness: 0.8, metalness: 0 }),
    fabricSand: std('#c3b09a', { roughness: 0.84, metalness: 0 }),
    fabricSage: std('#7e8d82', { roughness: 0.82, metalness: 0 }),
    fabricInk: std('#4a5561', { roughness: 0.78, metalness: 0 }),
    screen: std('#1a1d22', {
      roughness: 0.18,
      metalness: 0.35,
      emissive: '#1a2836',
      emissiveIntensity: 0.35,
    }),
    screenOn: std('#15181d', {
      roughness: 0.14,
      metalness: 0.28,
      emissive: '#6ea0c8',
      emissiveIntensity: 0.55,
    }),
    blackPlastic: std('#2a2d32', { roughness: 0.45, metalness: 0.08 }),
    metalBlack: std('#2c3036', { roughness: 0.28, metalness: 0.7 }),
    chrome: std('#cfd5db', { roughness: 0.18, metalness: 0.85 }),
    pot: std('#b7aaa0', { roughness: 0.7, metalness: 0.04 }),
    potTerracotta: std('#b57866', { roughness: 0.68, metalness: 0.02 }),
    soil: std('#4a3f36', { roughness: 1, metalness: 0 }),
    leaf: std('#4f7a52', { roughness: 0.55, metalness: 0.02 }),
    leafDark: std('#35583c', { roughness: 0.58, metalness: 0.02 }),
    leafLight: std('#6b965c', { roughness: 0.52, metalness: 0.02 }),
    light: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: '#fff6e8',
      emissiveIntensity: 1.4,
      roughness: 0.35,
      metalness: 0,
    }),
    cab: std('#9aa3ad', { roughness: 0.3, metalness: 0.5 }),
    cabDoor: std('#5d6670', { roughness: 0.28, metalness: 0.55 }),
    shaft: std('#c8cdd3', { roughness: 0.48, metalness: 0.12 }),
    shaftInner: std('#aeb4bb', { roughness: 0.55, metalness: 0.08 }),
    stone: std('#d9d5ce', { roughness: 0.42, metalness: 0.06 }),
    counter: std('#ece8e2', { roughness: 0.28, metalness: 0.08 }),
    appliance: std('#e8eaed', { roughness: 0.3, metalness: 0.35 }),
    person: std('#5d8494', { roughness: 0.62, metalness: 0, transparent: true, opacity: 0.94 }),
    personAlt: std('#6a8b8c', { roughness: 0.62, metalness: 0, transparent: true, opacity: 0.94 }),
    personWarm: std('#7a8f88', { roughness: 0.62, metalness: 0, transparent: true, opacity: 0.94 }),
    dot: new THREE.MeshStandardMaterial({
      color: '#3f7f96',
      emissive: '#4d8fa6',
      emissiveIntensity: 0.7,
      roughness: 0.45,
      metalness: 0,
      transparent: true,
      opacity: 0.95,
    }),
    glass,
    glassDoor,
    glowBusy: new THREE.MeshBasicMaterial({
      color: '#e8a24a',
      transparent: true,
      opacity: 0.34,
      toneMapped: false,
      depthWrite: false,
    }),
    glowSoon: new THREE.MeshBasicMaterial({
      color: '#e8c35a',
      transparent: true,
      opacity: 0.22,
      toneMapped: false,
      depthWrite: false,
    }),
    labelPlate: std('#f4f2ee', { roughness: 0.55, metalness: 0.04 }),
  }
}

export type Mats = ReturnType<typeof createMaterials>

export function mats(): Mats {
  if (!_cache) _cache = createMaterials()
  return _cache
}

/** Call on HMR dispose if needed. */
export function disposeMats() {
  if (!_cache) return
  for (const v of Object.values(_cache)) {
    if (v instanceof THREE.Material) v.dispose()
  }
  _cache = null
}

export function applyStudioEnvironment(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  intensity = 0.42,
) {
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envScene = new RoomEnvironment()
  const tex = pmrem.fromScene(envScene, 0.04).texture
  scene.environment = tex
  scene.environmentIntensity = intensity
  envScene.dispose()
  pmrem.dispose()
  return tex
}
