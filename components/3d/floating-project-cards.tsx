"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Text } from "@react-three/drei"
import * as THREE from "three"

interface FloatingProjectCardsProps {
  title?: string
  techStack?: string[]
  speed?: number
  position?: [number, number, number]
}

export function FloatingProjectCards({
  title = "Next.js AI Platform",
  techStack = ["Next.js", "TypeScript", "AI"],
  speed = 1,
  position = [-3.2, 1.2, 0.5],
}: FloatingProjectCardsProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5 * speed) * 0.15
    }
  })

  return (
    <Float speed={2 * speed} rotationIntensity={0.4} floatIntensity={0.6} position={position}>
      <group ref={groupRef}>
        {/* Main Glass Panel */}
        <mesh>
          <boxGeometry args={[3.2, 2.0, 0.08]} />
          <meshPhysicalMaterial
            color="#0f172a"
            transmission={0.8}
            opacity={0.9}
            transparent
            roughness={0.2}
            ior={1.5}
            thickness={0.5}
          />
        </mesh>

        {/* Border Accent */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[3.15, 1.95]} />
          <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.3} />
        </mesh>

        {/* Title Text */}
        <Text
          position={[0, 0.4, 0.06]}
          fontSize={0.24}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.8}
        >
          {title}
        </Text>

        {/* Tech Stack Tags Text */}
        <Text
          position={[0, -0.3, 0.06]}
          fontSize={0.15}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          {techStack.join(" • ")}
        </Text>
      </group>
    </Float>
  )
}
