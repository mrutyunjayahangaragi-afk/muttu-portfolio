"use client"

import { Suspense, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { PerspectiveCamera, Environment } from "@react-three/drei"
import { FloatingLaptop } from "./floating-laptop"
import { AIOrb } from "./ai-globe"
import { FloatingProjectCards } from "./floating-project-cards"
import { CertificateCard3D } from "./certificate-card-3d"
import { HackathonBadge3D } from "./hackathon-badge-3d"
import { Trophy3D } from "./trophy-3d"
import { GitHubCube3D } from "./github-cube-3d"
import { TechIcons3D } from "./tech-icons-3d"
import { Particles } from "./particles"
import { DigitalGrid } from "./digital-grid"
import { WebGlFallback } from "./webgl-fallback"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { Hero3DConfig, Hero3DContent } from "@/types/hero"
import * as THREE from "three"

interface CameraRigProps {
  mouseX: number
  mouseY: number
  camX: number
  camY: number
  camZ: number
  sensitivity: number
}

function CameraRig({ mouseX, mouseY, camX, camY, camZ, sensitivity }: CameraRigProps) {
  const vec = new THREE.Vector3()
  useFrame((state) => {
    state.camera.position.lerp(
      vec.set(
        camX + state.pointer.x * 2.5 * sensitivity,
        camY + state.pointer.y * 1.5 * sensitivity,
        camZ
      ),
      0.05
    )
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

interface SceneProps {
  config: Hero3DConfig
  content: Hero3DContent
}

function Scene({ config, content }: SceneProps) {
  return (
    <>
      {/* Lighting System */}
      <ambientLight intensity={Number(config.ambient_light_intensity || 0.4)} />
      <directionalLight
        position={[5, 10, 3]}
        intensity={Number(config.directional_light_intensity || 1.5)}
        color={config.directional_light_color || "#ffffff"}
      />
      <pointLight
        position={[-5, 5, -5]}
        intensity={Number(config.point_light_intensity || 1.0)}
        color={config.point_light_color || "#a855f7"}
      />
      <spotLight
        position={[0, 8, 2]}
        angle={0.4}
        penumbra={1}
        intensity={2}
        color={config.spot_light_color || "#60a5fa"}
        castShadow
      />

      {/* 3D Developer Workspace Objects */}
      {config.show_laptop && (
        <FloatingLaptop
          projectTitle={content.latestProjectTitle}
          speed={Number(config.floating_speed || 1)}
        />
      )}

      {config.show_ai_globe && (
        <AIOrb speed={Number(config.floating_speed || 1)} />
      )}

      {config.show_project_cards && (
        <FloatingProjectCards
          title={content.latestProjectTitle}
          techStack={content.latestProjectTech}
          speed={Number(config.floating_speed || 1)}
        />
      )}

      {config.show_certificate_card && (
        <CertificateCard3D
          title={content.latestCertificateTitle}
          issuer={content.latestCertificateIssuer}
          speed={Number(config.floating_speed || 1)}
        />
      )}

      {config.show_hackathon_badge && (
        <HackathonBadge3D
          title={content.latestHackathonTitle}
          award={content.latestHackathonAward}
          speed={Number(config.floating_speed || 1)}
        />
      )}

      {config.show_trophy && (
        <Trophy3D
          title={content.latestAchievementTitle}
          speed={Number(config.floating_speed || 1)}
        />
      )}

      {config.show_github_cube && (
        <GitHubCube3D speed={Number(config.floating_speed || 1)} />
      )}

      {config.show_tech_icons && (
        <TechIcons3D speed={Number(config.floating_speed || 1)} />
      )}

      {config.show_particles && (
        <Particles count={config.particle_count || 300} />
      )}

      <DigitalGrid />

      {/* Camera Rig with Sensitivity & Position controls */}
      <CameraRig
        mouseX={0}
        mouseY={0}
        camX={Number(config.camera_position_x || 0)}
        camY={Number(config.camera_position_y || 0)}
        camZ={Number(config.camera_position_z || 9)}
        sensitivity={Number(config.mouse_sensitivity || 1)}
      />

      {/* Environment Map */}
      <Environment preset={config.environment_preset || "night"} />
    </>
  )
}

const DEFAULT_CONFIG: Hero3DConfig = {
  id: "default",
  show_laptop: true,
  show_ai_globe: true,
  show_project_cards: true,
  show_certificate_card: true,
  show_hackathon_badge: true,
  show_trophy: true,
  show_github_cube: true,
  show_tech_icons: true,
  show_particles: true,
  custom_glb_url: null,
  hdr_environment_url: null,
  environment_preset: "night",
  background_color: "#020408",
  ambient_light_intensity: 0.4,
  directional_light_color: "#ffffff",
  directional_light_intensity: 1.5,
  point_light_color: "#a855f7",
  point_light_intensity: 1.0,
  spot_light_color: "#60a5fa",
  camera_position_x: 0,
  camera_position_y: 0,
  camera_position_z: 9,
  floating_speed: 1.0,
  mouse_sensitivity: 1.0,
  orbit_auto_rotate: true,
  orbit_rotation_speed: 0.5,
  particle_count: 300,
  updated_at: new Date().toISOString(),
}

const DEFAULT_CONTENT: Hero3DContent = {
  latestProjectTitle: "Next.js AI Platform",
  latestProjectImage: null,
  latestProjectTech: ["Next.js", "TypeScript", "AI"],
  latestCertificateTitle: "AWS Solutions Architect",
  latestCertificateIssuer: "Amazon Web Services",
  latestHackathonTitle: "Global AI Hackathon",
  latestHackathonAward: "1st Place Winner",
  latestAchievementTitle: "Best Innovation Award",
}

interface HeroSceneProps {
  config?: Hero3DConfig
  content?: Hero3DContent
}

export function HeroScene({ config = DEFAULT_CONFIG, content = DEFAULT_CONTENT }: HeroSceneProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      setHasWebGL(!!gl)
    } catch (e) {
      setHasWebGL(false)
    }
  }, [])

  if (isMobile || hasWebGL === false) {
    return <WebGlFallback />
  }

  return (
    <div
      className="absolute inset-0 h-full w-full"
      style={{ backgroundColor: config.background_color || "#020408" }}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        performance={{ min: 0.5 }}
        className="h-full w-full"
      >
        <PerspectiveCamera
          makeDefault
          position={[
            Number(config.camera_position_x || 0),
            Number(config.camera_position_y || 0),
            Number(config.camera_position_z || 9),
          ]}
          fov={50}
        />
        <Suspense fallback={null}>
          <Scene config={config} content={content} />
        </Suspense>
      </Canvas>
    </div>
  )
}
