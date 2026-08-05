"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function DigitalGrid() {
  const gridRef = useRef<THREE.GridHelper>(null)

  useFrame((state) => {
    if (!gridRef.current) return
    // Subtle movement on the grid coordinates matching the wave or scroll
    const time = state.clock.getElapsedTime()
    gridRef.current.position.z = (time * 0.1) % 2
  })

  return (
    <gridHelper
      ref={gridRef}
      args={[30, 30, "#3b82f6", "#1e293b"]}
      position={[0, -2.5, 0]}
      rotation={[0, 0, 0]}
    />
  )
}
