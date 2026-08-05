"use client"

import { Suspense, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { PerspectiveCamera, Environment } from "@react-three/drei"
import { FloatingLaptop } from "./floating-laptop"
import { CodePanels } from "./code-panels"
import { AIOrb } from "./ai-orb"
import { Particles } from "./particles"
import { DigitalGrid } from "./digital-grid"
import { WebGlFallback } from "./webgl-fallback"
import { useMediaQuery } from "@/hooks/use-media-query"
import * as THREE from "three"

function CameraRig() {
  const vec = new THREE.Vector3()
  useFrame((state) => {
    state.camera.position.lerp(vec.set(state.pointer.x * 2.5, state.pointer.y * 1.5, 9), 0.05)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

function Scene() {
  return (
    <>
      {/* Dynamic Lighting System */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 3]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, 5, -5]} intensity={1} color="#a855f7" />
      <spotLight 
        position={[0, 8, 2]} 
        angle={0.4} 
        penumbra={1} 
        intensity={2} 
        color="#60a5fa" 
        castShadow
      />

      {/* 3D Objects */}
      <FloatingLaptop />
      <AIOrb />
      <CodePanels />
      <Particles count={300} />
      <DigitalGrid />

      {/* Camera Rig (Responsive Mouse Follow) */}
      <CameraRig />
      
      {/* Night Sky Environment */}
      <Environment preset="night" />
    </>
  )
}

export function HeroScene() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null)

  useEffect(() => {
    // Detect WebGL capability
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      setHasWebGL(!!gl)
    } catch (e) {
      setHasWebGL(false)
    }
  }, [])

  // If mobile, simplify or skip 3D to maintain 60 FPS
  if (isMobile) {
    return <WebGlFallback />
  }

  // WebGL detection state check
  if (hasWebGL === false) {
    return <WebGlFallback />
  }

  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas 
        dpr={[1, 1.5]} // Limit pixel ratio to 1.5 for performance
        gl={{ antialias: false, powerPreference: "high-performance" }}
        performance={{ min: 0.5 }} 
        className="h-full w-full"
      >
        <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={50} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
