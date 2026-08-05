"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Text } from "@react-three/drei"
import * as THREE from "three"

interface Trophy3DProps {
  title?: string
  speed?: number
  position?: [number, number, number]
}

export function Trophy3D({
  title = "Best Innovation Award",
  speed = 1,
  position = [1.8, 2.5, -1.8],
}: Trophy3DProps) {
  const trophyRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (trophyRef.current) {
      trophyRef.current.rotation.y += delta * 0.5 * speed
    }
  })

  return (
    <Float speed={1.5 * speed} rotationIntensity={0.3} floatIntensity={0.5} position={position}>
      <group ref={trophyRef}>
        {/* Trophy Base */}
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[0.7, 0.3, 0.7]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Stem */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.08, 0.15, 0.5, 16]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.1} metalness={0.95} />
        </mesh>

        {/* Cup Body */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.45, 0.25, 0.6, 24, 1, true]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.1} metalness={0.95} side={THREE.DoubleSide} />
        </mesh>

        {/* Cup Bottom Sphere */}
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Title Badge */}
        <Text
          position={[0, -0.6, 0.36]}
          fontSize={0.09}
          color="#fef08a"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.6}
        >
          {title}
        </Text>
      </group>
    </Float>
  )
}
