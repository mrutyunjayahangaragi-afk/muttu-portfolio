"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Text } from "@react-three/drei"
import * as THREE from "three"

interface CertificateCard3DProps {
  title?: string
  issuer?: string
  speed?: number
  position?: [number, number, number]
}

export function CertificateCard3D({
  title = "AWS Certified Architect",
  issuer = "Amazon Web Services",
  speed = 1,
  position = [3.5, -1.8, 1.2],
}: CertificateCard3DProps) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.cos(state.clock.getElapsedTime() * 0.4 * speed) * 0.2
    }
  })

  return (
    <Float speed={1.8 * speed} rotationIntensity={0.5} floatIntensity={0.8} position={position}>
      <group ref={meshRef}>
        {/* Certificate Card Base */}
        <mesh>
          <boxGeometry args={[2.6, 1.6, 0.06]} />
          <meshStandardMaterial
            color="#064e3b"
            roughness={0.3}
            metalness={0.6}
            emissive="#059669"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Certificate Golden Border */}
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[2.5, 1.5]} />
          <meshBasicMaterial color="#f59e0b" wireframe transparent opacity={0.5} />
        </mesh>

        {/* Certificate Seal Badge */}
        <mesh position={[0.9, -0.4, 0.04]}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 32]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Title */}
        <Text
          position={[-0.1, 0.3, 0.045]}
          fontSize={0.18}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.2}
        >
          {title}
        </Text>

        {/* Issuer */}
        <Text
          position={[-0.1, -0.3, 0.045]}
          fontSize={0.13}
          color="#a7f3d0"
          anchorX="center"
          anchorY="middle"
        >
          {issuer}
        </Text>
      </group>
    </Float>
  )
}
