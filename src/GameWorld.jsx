import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'

function GameCube(props) {
  const meshRef = useRef()

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = props.scrollY * 0.002
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
      <group position={props.position} scale={props.size} ref={meshRef}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={props.color}
            metalness={0.7}
            roughness={0.15}
            emissive={props.color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.55}
          />
        </mesh>
      </group>
    </Float>
  )
}

function GameWorld() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#a855f7" />
        <pointLight position={[-5, -5, 5]} intensity={1.5} color="#22d3ee" />

        <GameCube position={[-13, 4, -2]} size={1.8} color="#a855f7" scrollY={scrollY} />
        <GameCube position={[13, 1, -3]} size={2.2} color="#22d3ee" scrollY={scrollY} />
        <GameCube position={[-12, -5, -1]} size={1.4} color="#f472b6" scrollY={scrollY} />
        <GameCube position={[12.5, -6, -2]} size={1.6} color="#a855f7" scrollY={scrollY} />
      </Canvas>
    </div>
  )
}

export default GameWorld