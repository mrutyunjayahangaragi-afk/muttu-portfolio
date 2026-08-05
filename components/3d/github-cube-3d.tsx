"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Text } from "@react-three/drei"
import * as THREE from "three"

interface GitHubCube3DProps {
  speed?: number
  position?: [number, number, number]
}

export function GitHubCube3D({ speed = 1, position = [-2.2, 2.6, -1.2] }: GitHubCube3DProps) {
  const cubeRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta * 0.4 * speed
      cubeRef.current.rotation.y += delta * 0.6 * speed
    }
  })

  return (
    <Float speed={2 * speed} rotationIntensity={0.6} floatIntensity={0.8} position={position}>
      <mesh ref={cubeRef}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.2}
          metalness={0.8}
          emissive="#38bdf8"
          emissiveIntensity={0.3}
        />
        <Text
          position={[0, 0, 0.46]}
          fontSize={0.28}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
        >
          GH
        </Text>
      </mesh>
    </Float>
  )
}
