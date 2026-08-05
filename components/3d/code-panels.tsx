"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox, Text } from "@react-three/drei"
import * as THREE from "three"

const CODE_SNIPPETS = [
  "const dev = () => {",
  "  return magic();",
  "};",
  "// Building the future",
  "import React from 'react'",
  "export default App",
]

export function CodePanels() {
  const group1 = useRef<THREE.Group>(null)
  const group2 = useRef<THREE.Group>(null)
  const group3 = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (group1.current) {
      group1.current.rotation.y = t * 0.2
      group1.current.position.y = Math.sin(t * 0.5) * 0.3
    }
    if (group2.current) {
      group2.current.rotation.y = -t * 0.15
      group2.current.position.y = Math.cos(t * 0.6) * 0.3
    }
    if (group3.current) {
      group3.current.rotation.y = t * 0.25
      group3.current.position.y = Math.sin(t * 0.4 + 1) * 0.3
    }
  })

  return (
    <>
      {/* Panel 1 */}
      <group ref={group1} position={[-2, 1, -1]}>
        <RoundedBox args={[1.5, 1, 0.05]} radius={0.05}>
          <meshStandardMaterial
            color="#1a1a2e"
            transparent
            opacity={0.6}
            metalness={0.5}
            roughness={0.5}
          />
        </RoundedBox>
        <Text
          position={[0, 0.2, 0.05]}
          fontSize={0.08}
          color="#a855f7"
          anchorX="center"
          anchorY="middle"
        >
          {CODE_SNIPPETS[0]}
        </Text>
        <Text
          position={[0, 0, 0.05]}
          fontSize={0.08}
          color="#60a5fa"
          anchorX="center"
          anchorY="middle"
        >
          {CODE_SNIPPETS[1]}
        </Text>
        <Text
          position={[0, -0.2, 0.05]}
          fontSize={0.08}
          color="#a855f7"
          anchorX="center"
          anchorY="middle"
        >
          {CODE_SNIPPETS[2]}
        </Text>
      </group>

      {/* Panel 2 */}
      <group ref={group2} position={[2, 0.5, -2]}>
        <RoundedBox args={[1.3, 0.8, 0.05]} radius={0.05}>
          <meshStandardMaterial
            color="#1a1a2e"
            transparent
            opacity={0.6}
            metalness={0.5}
            roughness={0.5}
          />
        </RoundedBox>
        <Text
          position={[0, 0.1, 0.05]}
          fontSize={0.07}
          color="#10b981"
          anchorX="center"
          anchorY="middle"
        >
          {CODE_SNIPPETS[3]}
        </Text>
      </group>

      {/* Panel 3 */}
      <group ref={group3} position={[0, -1, -1.5]}>
        <RoundedBox args={[1.6, 0.9, 0.05]} radius={0.05}>
          <meshStandardMaterial
            color="#1a1a2e"
            transparent
            opacity={0.6}
            metalness={0.5}
            roughness={0.5}
          />
        </RoundedBox>
        <Text
          position={[0, 0.15, 0.05]}
          fontSize={0.08}
          color="#ec4899"
          anchorX="center"
          anchorY="middle"
        >
          {CODE_SNIPPETS[4]}
        </Text>
        <Text
          position={[0, -0.15, 0.05]}
          fontSize={0.08}
          color="#f59e0b"
          anchorX="center"
          anchorY="middle"
        >
          {CODE_SNIPPETS[5]}
        </Text>
      </group>
    </>
  )
}
