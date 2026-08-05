"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, MeshDistortMaterial, Float } from "@react-three/drei"
import * as THREE from "three"

export function AIOrb() {
  const orbRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (orbRef.current) {
      const material = orbRef.current.material as any
      if (material.distort !== undefined) {
        material.distort = 0.4 + Math.sin(t) * 0.1
      }
    }
  })

  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={orbRef} args={[0.8, 64, 64]} position={[0, 1.5, 0]}>
        <MeshDistortMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={0.5}
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      <pointLight position={[0, 1.5, 0]} intensity={2} color="#a855f7" distance={4} />
    </Float>
  )
}
