"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere } from "@react-three/drei"
import * as THREE from "three"

interface AIOrbProps {
  speed?: number
  position?: [number, number, number]
}

export function AIOrb({ speed = 1, position = [3.2, 1.8, -1] }: AIOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4 * speed
      meshRef.current.rotation.x += delta * 0.2 * speed
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.3 * speed
      ringRef.current.rotation.y -= delta * 0.5 * speed
    }
  })

  return (
    <group position={position}>
      {/* Outer Wireframe Globe */}
      <Sphere ref={meshRef} args={[1.1, 24, 24]}>
        <meshStandardMaterial
          color="#3b82f6"
          wireframe
          transparent
          opacity={0.35}
          emissive="#3b82f6"
          emissiveIntensity={0.6}
        />
      </Sphere>

      {/* Inner Glowing Core */}
      <Sphere args={[0.6, 32, 32]}>
        <meshStandardMaterial
          color="#a855f7"
          roughness={0.1}
          metalness={0.8}
          emissive="#a855f7"
          emissiveIntensity={1.2}
        />
      </Sphere>

      {/* Orbit Ring */}
      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.5, 0.02, 16, 64]} />
          <meshBasicMaterial color="#ec4899" transparent opacity={0.6} />
        </mesh>
      </group>
    </group>
  )
}
