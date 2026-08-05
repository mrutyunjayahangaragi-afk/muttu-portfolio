"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Text } from "@react-three/drei"
import * as THREE from "three"

interface HackathonBadge3DProps {
  title?: string
  award?: string
  speed?: number
  position?: [number, number, number]
}

export function HackathonBadge3D({
  title = "Global AI Hackathon",
  award = "1st Place Winner",
  speed = 1,
  position = [-3.8, -1.5, -0.5],
}: HackathonBadge3DProps) {
  const badgeRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (badgeRef.current) {
      badgeRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.6 * speed) * 0.1
    }
  })

  return (
    <Float speed={2.2 * speed} rotationIntensity={0.6} floatIntensity={0.7} position={position}>
      <group ref={badgeRef}>
        {/* Outer Hexagon/Cylinder Badge Base */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.08, 6]} />
          <meshStandardMaterial
            color="#831843"
            roughness={0.2}
            metalness={0.8}
            emissive="#f43f5e"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Inner Glowing Ring */}
        <mesh position={[0, 0, 0.05]}>
          <ringGeometry args={[0.65, 0.75, 32]} />
          <meshBasicMaterial color="#fb7185" side={THREE.DoubleSide} />
        </mesh>

        {/* Award Text */}
        <Text
          position={[0, 0.2, 0.06]}
          fontSize={0.16}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.5}
        >
          {award}
        </Text>

        {/* Hackathon Title */}
        <Text
          position={[0, -0.25, 0.06]}
          fontSize={0.12}
          color="#fecdd3"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.5}
        >
          {title}
        </Text>
      </group>
    </Float>
  )
}
