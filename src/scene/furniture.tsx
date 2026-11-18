import { mats } from './materials'

type P = {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
}

export function Desk({
  position,
  rotation,
  hasMonitor = true,
  dual = false,
  plant = false,
  lamp = false,
}: P & { hasMonitor?: boolean; dual?: boolean; plant?: boolean; lamp?: boolean }) {
  const m = mats()
  return (
    <group position={position} rotation={rotation}>
      {/* thin worktop */}
      <mesh position={[0, 0.735, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.03, 0.7]} />
        <primitive object={m.woodOak} attach="material" />
      </mesh>
      {/* apron */}
      <mesh position={[0, 0.705, 0]} castShadow>
        <boxGeometry args={[1.32, 0.04, 0.58]} />
        <primitive object={m.woodDark} attach="material" />
      </mesh>
      <CLeg x={-0.64} />
      <CLeg x={0.64} />
      {hasMonitor && <Monitor x={dual ? -0.22 : 0} z={-0.12} />}
      {dual && <Monitor x={0.22} z={-0.12} />}
      {plant && <DeskPlant position={[0.55, 0.75, 0.2]} />}
      {lamp && <TaskLamp position={[-0.52, 0.75, -0.18]} />}
    </group>
  )
}

function CLeg({ x }: { x: number }) {
  const m = mats()
  const s = Math.sign(x) || 1
  return (
    <group>
      {/* upright */}
      <mesh position={[x, 0.36, 0]} castShadow>
        <boxGeometry args={[0.036, 0.72, 0.16]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
      {/* floor foot */}
      <mesh position={[x - s * 0.08, 0.015, 0]} castShadow>
        <boxGeometry args={[0.2, 0.03, 0.22]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
      {/* under-desk arm */}
      <mesh position={[x - s * 0.1, 0.685, 0]} castShadow>
        <boxGeometry args={[0.22, 0.025, 0.16]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
    </group>
  )
}

export function Monitor({ x = 0, z = 0, on = true, w = 0.48, h = 0.3 }: { x?: number; z?: number; on?: boolean; w?: number; h?: number }) {
  const m = mats()
  return (
    <group position={[x, 0.75, z]}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[w, h, 0.018]} />
        <primitive object={on ? m.screenOn : m.screen} attach="material" />
      </mesh>
      <mesh position={[0, 0.22, -0.012]} castShadow>
        <boxGeometry args={[w + 0.016, h + 0.016, 0.012]} />
        <primitive object={m.blackPlastic} attach="material" />
      </mesh>
      <mesh position={[0, 0.05, -0.01]} castShadow>
        <cylinderGeometry args={[0.012, 0.014, 0.1, 10]} />
        <primitive object={m.blackPlastic} attach="material" />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.012, 16]} />
        <primitive object={m.blackPlastic} attach="material" />
      </mesh>
    </group>
  )
}

function TaskLamp({ position }: { position: [number, number, number] }) {
  const m = mats()
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.045, 0.05, 0.01, 16]} />
        <primitive object={m.metalBlack} attach="material" />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[0.15, 0, 0.1]}>
        <cylinderGeometry args={[0.007, 0.007, 0.24, 8]} />
        <primitive object={m.metalBlack} attach="material" />
      </mesh>
      <mesh position={[0.02, 0.24, -0.04]} rotation={[1.1, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.05, 12]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
    </group>
  )
}

export function TaskChair({
  position,
  rotation,
  color = 'blue',
}: P & { color?: 'blue' | 'gray' | 'sand' | 'sage' | 'ink' }) {
  const m = mats()
  const fabric =
    color === 'gray'
      ? m.fabricGray
      : color === 'sand'
        ? m.fabricSand
        : color === 'sage'
          ? m.fabricSage
          : color === 'ink'
            ? m.fabricInk
            : m.fabricBlue
  return (
    <group position={position} rotation={rotation}>
      {/* seat */}
      <mesh position={[0, 0.46, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.05, 0.4]} />
        <primitive object={fabric} attach="material" />
      </mesh>
      {/* back, slightly reclined */}
      <mesh position={[0, 0.74, -0.18]} rotation={[0.12, 0, 0]} castShadow>
        <boxGeometry args={[0.42, 0.46, 0.04]} />
        <primitive object={fabric} attach="material" />
      </mesh>
      {/* lumbar hint */}
      <mesh position={[0, 0.58, -0.155]} rotation={[0.12, 0, 0]} castShadow>
        <boxGeometry args={[0.34, 0.08, 0.03]} />
        <primitive object={fabric} attach="material" />
      </mesh>
      {/* gas lift */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.36, 10]} />
        <primitive object={m.chrome} attach="material" />
      </mesh>
      {/* star base */}
      {([0, 1, 2, 3, 4] as const).map((i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <group key={i} rotation={[0, a, 0]}>
            <mesh position={[0.16, 0.04, 0]} castShadow>
              <boxGeometry args={[0.28, 0.022, 0.036]} />
              <primitive object={m.metalBlack} attach="material" />
            </mesh>
            <mesh position={[0.3, 0.028, 0]} castShadow>
              <cylinderGeometry args={[0.028, 0.028, 0.028, 10]} />
              <primitive object={m.blackPlastic} attach="material" />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

export function MeetChair({
  position,
  rotation,
  color = 'gray',
}: P & { color?: 'blue' | 'gray' | 'sand' | 'sage' | 'ink' }) {
  const m = mats()
  const fabric =
    color === 'blue'
      ? m.fabricBlue
      : color === 'sand'
        ? m.fabricSand
        : color === 'sage'
          ? m.fabricSage
          : color === 'ink'
            ? m.fabricInk
            : m.fabricGray
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.45, 0.01]} castShadow receiveShadow>
        <boxGeometry args={[0.44, 0.045, 0.42]} />
        <primitive object={fabric} attach="material" />
      </mesh>
      <mesh position={[0, 0.7, -0.19]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[0.44, 0.42, 0.035]} />
        <primitive object={fabric} attach="material" />
      </mesh>
      {/* sled base */}
      {([-0.18, 0.18] as const).map((z) => (
        <group key={z}>
          <mesh position={[-0.2, 0.22, z]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
            <primitive object={m.chrome} attach="material" />
          </mesh>
          <mesh position={[0.2, 0.22, z]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
            <primitive object={m.chrome} attach="material" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.02, -0.18]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.42, 8]} />
        <primitive object={m.chrome} attach="material" />
      </mesh>
      <mesh position={[0, 0.02, 0.18]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.42, 8]} />
        <primitive object={m.chrome} attach="material" />
      </mesh>
      <mesh position={[-0.2, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.36, 8]} />
        <primitive object={m.chrome} attach="material" />
      </mesh>
      <mesh position={[0.2, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.36, 8]} />
        <primitive object={m.chrome} attach="material" />
      </mesh>
    </group>
  )
}

export function MeetingTable({
  position,
  rotation,
  size = [2.4, 1.1],
}: P & { size?: [number, number] }) {
  const m = mats()
  const [w, d] = size
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.735, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.04, d]} />
        <primitive object={m.wood} attach="material" />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[w - 0.12, 0.035, d - 0.12]} />
        <primitive object={m.woodDark} attach="material" />
      </mesh>
      {/* twin pedestals */}
      {([-w * 0.32, w * 0.32] as const).map((x) => (
        <group key={x}>
          <mesh position={[x, 0.36, 0]} castShadow>
            <boxGeometry args={[0.16, 0.68, Math.min(0.7, d * 0.55)]} />
            <primitive object={m.aluminum} attach="material" />
          </mesh>
          <mesh position={[x, 0.03, 0]} castShadow>
            <boxGeometry args={[0.28, 0.04, Math.min(0.82, d * 0.65)]} />
            <primitive object={m.aluminum} attach="material" />
          </mesh>
        </group>
      ))}
      {/* cable well */}
      <mesh position={[0, 0.758, 0]}>
        <boxGeometry args={[Math.min(0.7, w * 0.28), 0.01, 0.14]} />
        <primitive object={m.blackPlastic} attach="material" />
      </mesh>
    </group>
  )
}

export function BoatTable({ position, rotation }: P) {
  const m = mats()
  const w = 4.6
  const d = 1.45
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.735, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.045, d]} />
        <primitive object={m.wood} attach="material" />
      </mesh>
      {/* slightly narrower ends suggestion via dark under-bevel */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[w - 0.2, 0.04, d - 0.14]} />
        <primitive object={m.woodDark} attach="material" />
      </mesh>
      {([-1.5, 0, 1.5] as const).map((x) => (
        <mesh key={x} position={[x, 0.35, 0]} castShadow>
          <boxGeometry args={[0.18, 0.7, 0.7]} />
          <primitive object={m.aluminum} attach="material" />
        </mesh>
      ))}
      <mesh position={[0, 0.76, 0]}>
        <boxGeometry args={[1.2, 0.01, 0.18]} />
        <primitive object={m.blackPlastic} attach="material" />
      </mesh>
    </group>
  )
}

export function WallScreen({
  position,
  rotation,
  width = 1.8,
  height = 1.0,
  on = false,
}: P & { width?: number; height?: number; on?: boolean }) {
  const m = mats()
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.02]} castShadow>
        <boxGeometry args={[width + 0.06, height + 0.06, 0.03]} />
        <primitive object={m.blackPlastic} attach="material" />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[width, height, 0.02]} />
        <primitive object={on ? m.screenOn : m.screen} attach="material" />
      </mesh>
      {/* thin bracket */}
      <mesh position={[0, -height * 0.35, -0.05]}>
        <boxGeometry args={[0.2, 0.08, 0.06]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
    </group>
  )
}

export function Credenza({ position, rotation, width = 1.6 }: P & { width?: number }) {
  const m = mats()
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.64, 0.4]} />
        <primitive object={m.woodDark} attach="material" />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[width + 0.04, 0.03, 0.44]} />
        <primitive object={m.woodLight} attach="material" />
      </mesh>
      {([-width * 0.22, width * 0.22] as const).map((x) => (
        <mesh key={x} position={[x, 0.34, 0.205]}>
          <boxGeometry args={[0.08, 0.01, 0.01]} />
          <primitive object={m.aluminum} attach="material" />
        </mesh>
      ))}
    </group>
  )
}

export function DeskPlant({ position, rotation, scale = 1 }: P) {
  const m = mats()
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.045, 0.1, 12]} />
        <primitive object={m.pot} attach="material" />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.02, 12]} />
        <primitive object={m.soil} attach="material" />
      </mesh>
      <mesh position={[0.0, 0.2, 0]} rotation={[0.2, 0.3, 0.1]} castShadow>
        <sphereGeometry args={[0.08, 10, 8]} />
        <primitive object={m.leaf} attach="material" />
      </mesh>
      <mesh position={[0.05, 0.18, 0.03]} rotation={[-0.2, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.06, 10, 8]} />
        <primitive object={m.leafLight} attach="material" />
      </mesh>
    </group>
  )
}

export function FloorPlant({ position, rotation, scale = 1, variant = 0 }: P & { variant?: number }) {
  const m = mats()
  const lean = variant % 2 === 0 ? 1 : -1
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.12, 0.32, 14]} />
        <primitive object={variant % 2 ? m.potTerracotta : m.pot} attach="material" />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.04, 14]} />
        <primitive object={m.soil} attach="material" />
      </mesh>
      {/* stems */}
      {[0.0, 0.35, -0.4, 0.7].map((a, i) => (
        <mesh
          key={a}
          position={[Math.sin(a) * 0.04, 0.7 + i * 0.05, Math.cos(a) * 0.03]}
          rotation={[0.15 * lean, a, 0.08]}
          castShadow
        >
          <cylinderGeometry args={[0.012, 0.018, 0.7, 6]} />
          <primitive object={m.leafDark} attach="material" />
        </mesh>
      ))}
      {/* leaves as flattened spheres / cards */}
      {[
        [0.08, 1.05, 0.02, 0.16],
        [-0.1, 0.95, 0.08, 0.14],
        [0.12, 0.85, -0.08, 0.15],
        [-0.06, 1.15, -0.06, 0.13],
        [0.02, 1.22, 0.1, 0.12],
        [-0.14, 0.78, -0.04, 0.13],
      ].map(([x, y, z, r], i) => (
        <mesh
          key={i}
          position={[x, y, z]}
          rotation={[0.4, i * 0.7, 0.2 * lean]}
          scale={[1, 0.35, 0.8]}
          castShadow
        >
          <sphereGeometry args={[r, 10, 8]} />
          <primitive object={i % 2 ? m.leaf : m.leafLight} attach="material" />
        </mesh>
      ))}
    </group>
  )
}

export function LinearLight({
  position,
  rotation,
  length = 2.4,
}: P & { length?: number }) {
  const m = mats()
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[length, 0.04, 0.08]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
      <mesh position={[0, -0.025, 0]}>
        <boxGeometry args={[length - 0.06, 0.02, 0.06]} />
        <primitive object={m.light} attach="material" />
      </mesh>
    </group>
  )
}

export function ReceptionDesk({ position, rotation }: P) {
  const m = mats()
  return (
    <group position={position} rotation={rotation}>
      {/* main run */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 1.1, 0.7]} />
        <primitive object={m.stone} attach="material" />
      </mesh>
      {/* transaction top */}
      <mesh position={[0, 1.12, 0.06]} castShadow>
        <boxGeometry args={[3.28, 0.04, 0.82]} />
        <primitive object={m.counter} attach="material" />
      </mesh>
      {/* return / L wing */}
      <mesh position={[1.35, 0.45, 0.85]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.9, 1.2]} />
        <primitive object={m.wood} attach="material" />
      </mesh>
      <mesh position={[1.35, 0.92, 0.85]} castShadow>
        <boxGeometry args={[0.76, 0.04, 1.26]} />
        <primitive object={m.counter} attach="material" />
      </mesh>
      {/* kick */}
      <mesh position={[0, 0.06, 0.32]}>
        <boxGeometry args={[3.1, 0.12, 0.08]} />
        <primitive object={m.woodDark} attach="material" />
      </mesh>
      {/* front wood veneer band */}
      <mesh position={[0, 0.7, 0.36]}>
        <boxGeometry args={[3.18, 0.16, 0.02]} />
        <primitive object={m.woodDark} attach="material" />
      </mesh>
      <Monitor x={-0.4} z={-0.1} />
      <DeskPlant position={[1.1, 1.16, 0.1]} />
    </group>
  )
}

export function WaitingSeat({ position, rotation }: P) {
  const m = mats()
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.1, 0.62]} />
        <primitive object={m.fabricSand} attach="material" />
      </mesh>
      <mesh position={[0, 0.62, -0.26]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[0.7, 0.42, 0.08]} />
        <primitive object={m.fabricSand} attach="material" />
      </mesh>
      {([-0.3, 0.3] as const).map((x) => (
        <mesh key={x} position={[x, 0.18, 0.18]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.36, 8]} />
          <primitive object={m.chrome} attach="material" />
        </mesh>
      ))}
      {([-0.3, 0.3] as const).map((x) => (
        <mesh key={`b${x}`} position={[x, 0.18, -0.22]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.36, 8]} />
          <primitive object={m.chrome} attach="material" />
        </mesh>
      ))}
    </group>
  )
}

export function CoffeeTable({ position, rotation }: P) {
  const m = mats()
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[0.8, 0.03, 0.5]} />
        <primitive object={m.woodLight} attach="material" />
      </mesh>
      {([-0.32, 0.32] as const).map((x) =>
        ([-0.18, 0.18] as const).map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.19, z]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.38, 8]} />
            <primitive object={m.chrome} attach="material" />
          </mesh>
        )),
      )}
    </group>
  )
}

export function PantryCounter({ position, rotation }: P) {
  const m = mats()
  return (
    <group position={position} rotation={rotation}>
      {/* L counter along south + east */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.9, 0.65]} />
        <primitive object={m.appliance} attach="material" />
      </mesh>
      <mesh position={[0, 0.91, 0]} castShadow>
        <boxGeometry args={[4.28, 0.04, 0.7]} />
        <primitive object={m.counter} attach="material" />
      </mesh>
      {/* fridge */}
      <mesh position={[-2.35, 0.95, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 1.9, 0.7]} />
        <primitive object={m.appliance} attach="material" />
      </mesh>
      <mesh position={[-2.02, 1.05, 0.05]}>
        <boxGeometry args={[0.02, 0.4, 0.08]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
      {/* coffee machine block */}
      <mesh position={[0.3, 1.08, 0]} castShadow>
        <boxGeometry args={[0.36, 0.32, 0.32]} />
        <primitive object={m.metalBlack} attach="material" />
      </mesh>
      <mesh position={[0.3, 1.26, 0.02]}>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 12]} />
        <primitive object={m.blackPlastic} attach="material" />
      </mesh>
      {/* sink suggestion */}
      <mesh position={[1.3, 0.94, 0]}>
        <boxGeometry args={[0.42, 0.04, 0.32]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
      {/* upper shelf */}
      <mesh position={[0.6, 1.7, -0.18]} castShadow>
        <boxGeometry args={[2.2, 0.03, 0.28]} />
        <primitive object={m.wood} attach="material" />
      </mesh>
    </group>
  )
}

export function Stool({ position, rotation }: P) {
  const m = mats()
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.04, 16]} />
        <primitive object={m.wood} attach="material" />
      </mesh>
      <mesh position={[0, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.022, 0.6, 8]} />
        <primitive object={m.chrome} attach="material" />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 16]} />
        <primitive object={m.chrome} attach="material" />
      </mesh>
    </group>
  )
}

export function CafeTable({ position, rotation }: P) {
  const m = mats()
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.74, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.03, 24]} />
        <primitive object={m.woodLight} attach="material" />
      </mesh>
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.72, 10]} />
        <primitive object={m.chrome} attach="material" />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.025, 20]} />
        <primitive object={m.chrome} attach="material" />
      </mesh>
    </group>
  )
}

export function LogoWall({ position, rotation }: P) {
  const m = mats()
  return (
    <group position={position} rotation={rotation}>
      <mesh receiveShadow>
        <boxGeometry args={[3.2, 2.4, 0.08]} />
        <primitive object={m.wallBlue} attach="material" />
      </mesh>
      {/* abstract mark — not a brand wordmark */}
      <mesh position={[0, 0.25, 0.05]}>
        <boxGeometry args={[0.42, 0.42, 0.04]} />
        <primitive object={m.aluminum} attach="material" />
      </mesh>
      <mesh position={[0.18, 0.08, 0.07]}>
        <boxGeometry args={[0.42, 0.12, 0.03]} />
        <primitive object={m.frame} attach="material" />
      </mesh>
    </group>
  )
}

export function OccupancyDot({ position }: { position: [number, number, number] }) {
  const m = mats()
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.09, 16]} />
      <primitive object={m.dot} attach="material" />
    </mesh>
  )
}

export function PersonCapsule({
  position,
  rotation,
  seated = false,
  variant = 0,
}: P & { seated?: boolean; variant?: number }) {
  const m = mats()
  const mat = variant % 3 === 0 ? m.person : variant % 3 === 1 ? m.personAlt : m.personWarm
  const h = seated ? 0.78 : 1.2
  const y = seated ? 0.92 : 0.72
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, y, 0]} castShadow>
        <capsuleGeometry args={[0.175, h - 0.34, 6, 12]} />
        <primitive object={mat} attach="material" />
      </mesh>
    </group>
  )
}
