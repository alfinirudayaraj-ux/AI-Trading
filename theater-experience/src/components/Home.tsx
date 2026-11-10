import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Text } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

function TheaterPOV() {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.rotation.y = Math.sin(t * 0.08) * 0.03
    group.current.rotation.x = Math.sin(t * 0.05) * 0.015
  })
  return (
    <group ref={group}>
      {/* ceiling */}
      <mesh position={[0, 5.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 40]} />
        <meshStandardMaterial color="#0a0a12" roughness={1} />
      </mesh>
      {/* floor */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 40]} />
        <meshStandardMaterial color="#120c18" roughness={0.9} />
      </mesh>
      {/* walls */}
      <mesh position={[-8, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[40, 12]} />
        <meshStandardMaterial color="#0b0814" roughness={1} />
      </mesh>
      <mesh position={[8, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[40, 12]} />
        <meshStandardMaterial color="#0b0814" roughness={1} />
      </mesh>
      {/* screen wall */}
      <mesh position={[0, 1.5, -12]}>
        <planeGeometry args={[30, 12]} />
        <meshStandardMaterial color="#050508" roughness={1} />
      </mesh>
      {/* screen */}
      <mesh position={[0, 2.2, -11.8]}>
        <planeGeometry args={[12, 5.5]} />
        <meshStandardMaterial color="#1a2840" emissive="#0c1a30" emissiveIntensity={0.6} roughness={0.2} />
      </mesh>
      {/* screen glow */}
      <pointLight position={[0, 2.2, -9]} intensity={18} distance={18} color="#6aa8ff" />
      {/* aisle lights */}
      {[-6,-2,2,6].map((z,i)=>(
        <pointLight key={i} position={[-3, -1.2, z]} intensity={0.6} distance={4} color="#4a3a20" />
      ))}
      {[-6,-2,2,6].map((z,i)=>(
        <pointLight key={`r${i}`} position={[3, -1.2, z]} intensity={0.6} distance={4} color="#4a3a20" />
      ))}
      {/* seat silhouettes in front */}
      {[-4,-2,0,2,4].map((x,i)=>(
        <group key={i} position={[x*0.9, -1.2, -2]}>
          <mesh position={[0,0,0]}>
            <boxGeometry args={[0.9, 0.12, 0.8]} />
            <meshStandardMaterial color="#1a1020" roughness={0.8} />
          </mesh>
          <mesh position={[0,0.5,-0.3]}>
            <boxGeometry args={[0.85, 0.9, 0.15]} />
            <meshStandardMaterial color="#1f1530" roughness={0.7} />
          </mesh>
        </group>
      ))}
      {[-4,-2,0,2,4].map((x,i)=>(
        <group key={`f${i}`} position={[x*0.95, -0.8, -4.5]}>
          <mesh position={[0,0,0]}>
            <boxGeometry args={[0.85, 0.1, 0.75]} />
            <meshStandardMaterial color="#140c1a" roughness={0.85} />
          </mesh>
          <mesh position={[0,0.45,-0.28]}>
            <boxGeometry args={[0.8, 0.8, 0.12]} />
            <meshStandardMaterial color="#181025" roughness={0.8} />
          </mesh>
        </group>
      ))}
      <ambientLight intensity={0.15} />
    </group>
  )
}

export default function Home() {
  const { movies, homeMovieIndex, setHomeMovieIndex, setStep } = useStore()
  const current = movies[homeMovieIndex]

  useEffect(() => {
    const id = setInterval(() => {
      setHomeMovieIndex((homeMovieIndex + 1) % movies.length)
    }, 4500)
    return () => clearInterval(id)
  }, [homeMovieIndex, movies.length, setHomeMovieIndex])

  return (
    <div style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Canvas gl={{ antialias: true, powerPreference: 'high-performance' }} dpr={[1, 1.5]}>
          <PerspectiveCamera makeDefault position={[0, 0.2, 3.5]} fov={70} />
          <TheaterPOV />
        </Canvas>
      </div>

      {/* screen content overlay */}
      <div style={{
        position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)',
        width: 'min(52vw, 620px)', aspectRatio: '16/7.3', zIndex: 5,
        borderRadius: 4, overflow: 'hidden', boxShadow: '0 0 60px rgba(80,140,255,0.25)',
        border: '1px solid rgba(120,180,255,0.15)'
      }}>
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ width: '100%', height: '100%', background: current.backdrop, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '18px 22px' }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), transparent 50%)' }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.25em', color: '#f0d77a', textTransform: 'uppercase', marginBottom: 4 }}>Now Showing in India</div>
            <div className="display" style={{ fontSize: 'clamp(18px, 2.8vw, 34px)', lineHeight: 1.1, marginBottom: 6 }}>{current.title}</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', fontSize: 12, color: '#d5d5e0' }}>
              <span className="rating">★ {current.rating}</span>
              <span>{current.genre}</span>
              <span>{current.language}</span>
            </div>
            <div style={{ fontSize: 11, color: '#b8b8c8', marginTop: 6, maxWidth: 420 }}>{current.reviews}</div>
          </div>
        </motion.div>
        <div style={{ position: 'absolute', bottom: 8, right: 10, display: 'flex', gap: 5 }}>
          {movies.map((m, i) => (
            <div key={m.id} style={{ width: i === homeMovieIndex ? 18 : 6, height: 6, borderRadius: 99, background: i === homeMovieIndex ? '#f0d77a' : 'rgba(255,255,255,0.3)', transition: 'all 0.4s ease' }} />
          ))}
        </div>
      </div>

      {/* UI overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="display glow-text" style={{ fontSize: 28, letterSpacing: '0.08em' }}>CineVista</div>
            <div style={{ fontSize: 12, color: '#9a9aa6', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Immersive Seat Preview</div>
          </div>
          <div className="chip gold" style={{ pointerEvents: 'auto' }}><span className="pulse-dot" /> Live in theatres across India</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} style={{ maxWidth: 520 }}>
            <h1 className="display" style={{ fontSize: 'clamp(28px, 4.5vw, 54px)', lineHeight: 1.05, marginBottom: 12 }}>
              See your <span className="glow-text">exact seat view</span> before you book.
            </h1>
            <p style={{ color: '#b8b8c8', fontSize: 15, lineHeight: 1.6, maxWidth: 460 }}>
              Step into the theatre, sit in your chosen seat, and experience the real screen perspective in 360°. Then book with confidence.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} style={{ pointerEvents: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="btn-ghost" onClick={() => setStep('movies')}>Browse Movies</button>
            <button className="btn-primary" onClick={() => setStep('movies')}>Begin Experience</button>
          </motion.div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 6, color: '#777', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        Scroll or tap Begin to explore
      </div>
    </div>
  )
}
