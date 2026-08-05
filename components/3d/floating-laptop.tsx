"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox, Float, Text } from "@react-three/drei"
import * as THREE from "three"

interface FloatingLaptopProps {
  projectTitle?: string
  speed?: number
  position?: [number, number, number]
}

export function FloatingLaptop({
  projectTitle = "Next.js Portfolio",
  speed = 1,
  position = [0, 0, 0],
}: FloatingLaptopProps) {
  const groupRef = useRef<THREE.Group>(null)
  const screenRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.2
      groupRef.current.rotation.x = Math.cos(t * 0.2) * 0.1
    }
    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = 0.5 + Math.sin(t * 2) * 0.2
    }
  })

  return (
    <Float speed={2 * speed} rotationIntensity={0.5} floatIntensity={0.5} position={position}>
      <group ref={groupRef}>
        {/* Laptop base */}
        <RoundedBox args={[2.5, 0.1, 1.8]} radius={0.05} position={[0, -0.5, 0]}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </RoundedBox>

        {/* Keyboard */}
        <RoundedBox args={[2.2, 0.05, 1.5]} radius={0.02} position={[0, -0.4, 0]}>
          <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
        </RoundedBox>

        {/* Screen Frame */}
        <group position={[0, 0.3, -0.9]} rotation={[-0.2, 0, 0]}>
          <RoundedBox
            ref={screenRef}
            args={[2.4, 1.5, 0.1]}
            radius={0.05}
          >
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#3b82f6"
              emissiveIntensity={0.5}
              metalness={0.3}
              roughness={0.4}
            />
          </RoundedBox>

          {/* Laptop Screen Content Overlay */}
          <Text
            position={[0, 0, 0.06]}
            fontSize={0.14}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={2.1}
          >
            {projectTitle}
          </Text>
        </group>

        {/* Screen glow */}
        <pointLight position={[0, 0.3, -0.5]} intensity={1} color="#60a5fa" distance={3} />
      </group>
    </Float>
  )
}
