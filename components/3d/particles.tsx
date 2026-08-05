"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function Particles({ count = 400 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 10 + Math.random() * 50
      const speed = 0.005 + Math.random() / 500
      const xFactor = -8 + Math.random() * 16
      const yFactor = -8 + Math.random() * 16
      const zFactor = -8 + Math.random() * 16
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor })
    }
    return temp
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Create different colors for particles
  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3)
    const color1 = new THREE.Color("#60a5fa") // blue light
    const color2 = new THREE.Color("#c084fc") // purple light
    const color3 = new THREE.Color("#ffffff") // white

    for (let i = 0; i < count; i++) {
      const rand = Math.random()
      let finalColor = color1
      if (rand > 0.6) finalColor = color2
      else if (rand > 0.9) finalColor = color3

      arr[i * 3] = finalColor.r
      arr[i * 3 + 1] = finalColor.g
      arr[i * 3 + 2] = finalColor.b
    }
    return arr
  }, [count])

  const colorArray = useMemo(() => new THREE.InstancedBufferAttribute(colors, 3), [colors])

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return

    // Apply instanced attribute colors if not already applied
    if (mesh.geometry && !mesh.geometry.attributes.color) {
      mesh.geometry.setAttribute("color", colorArray)
    }

    const mouseX = state.pointer.x * 2
    const mouseY = state.pointer.y * 2

    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      t = particle.t += speed
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)

      // Drift reactive to mouse position
      dummy.position.set(
        xFactor + Math.cos((t / 10) * factor) + mouseX * (1.5 - Math.abs(xFactor) / 10),
        yFactor + Math.sin((t / 10) * factor) + mouseY * (1.5 - Math.abs(yFactor) / 10),
        zFactor + Math.cos((t / 10) * factor)
      )

      const scale = Math.max(0.01, (s * 0.1) + 0.05)
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  )
}
