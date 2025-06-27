"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Float, Sparkles } from "@react-three/drei"
import type * as THREE from "three"

function MountainRange() {
  const mountainRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (mountainRef.current) {
      mountainRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
      mountainRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group ref={mountainRef} position={[0, -2, -5]}>
      {/* Mountain silhouettes */}
      <mesh position={[-3, 0, 0]}>
        <coneGeometry args={[2, 4, 8]} />
        <meshStandardMaterial color="#2d1810" />
      </mesh>
      <mesh position={[0, 0.5, -1]}>
        <coneGeometry args={[2.5, 5, 8]} />
        <meshStandardMaterial color="#1a0f08" />
      </mesh>
      <mesh position={[3, -0.5, 0]}>
        <coneGeometry args={[1.8, 3.5, 8]} />
        <meshStandardMaterial color="#2d1810" />
      </mesh>
    </group>
  )
}

function CoffeeParticles() {
  return <Sparkles count={100} scale={[10, 10, 10]} size={2} speed={0.3} color="#d97706" />
}

export default function HeroSection() {
  return (
    <group>
      <MountainRange />
      <CoffeeParticles />

      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          font="/fonts/Geist-Bold.ttf"
          fontSize={1.2}
          position={[0, 1, 0]}
          color="#f59e0b"
          anchorX="center"
          anchorY="middle"
        >
          O Café da Serra do Tempo
        </Text>
      </Float>

      <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.3}>
        <Text
          font="/fonts/Geist-Regular.ttf"
          fontSize={0.4}
          position={[0, 0.2, 0]}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
        >
          Feito com calma. Bebido com alma.
        </Text>
      </Float>
    </group>
  )
}
