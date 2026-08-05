"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Text } from "@react-three/drei"
import * as THREE from "three"

interface TechIcons3DProps {
  speed?: number
}

const TECH_NODES = [
  { label: "React", color: "#61dafb", pos: [-4.2, 0.2, 1.5] as [number, number, number] },
  { label: "Next.js", color: "#ffffff", pos: [4.2, 0.5, 1.2] as [number, number, number] },
  { label: "TypeScript", color: "#3178c6", pos: [-1.8, -2.4, 0.8] as [number, number, number] },
  { label: "Supabase", color: "#3ecf8e", pos: [2.0, -2.6, 0.6] as [number, number, number] },
  { label: "AI/ML", color: "#a855f7", pos: [0, 3.2, -1.0] as [number, number, number] },
]

export function TechIcons3D({ speed = 1 }: TechIcons3DProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2 * speed) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {TECH_NODES.map((node, i) => (
        <Float
          key={node.label}
          speed={(1.8 + i * 0.3) * speed}
          rotationIntensity={0.5}
          floatIntensity={0.7}
          position={node.pos}
        >
          <mesh>
            <cylinderGeometry args={[0.45, 0.45, 0.08, 24]} />
            <meshStandardMaterial
              color="#030712"
              roughness={0.2}
              metalness={0.8}
              emissive={node.color}
              emissiveIntensity={0.3}
            />
          </mesh>
          <Text
            position={[0, 0, 0.05]}
            fontSize={0.13}
            color={node.color}
            anchorX="center"
            anchorY="middle"
          >
            {node.label}
          </Text>
        </Float>
      ))}
    </group>
  )
}
