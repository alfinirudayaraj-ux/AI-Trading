import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useStore, Seat } from '../store/useStore'
import * as THREE from 'three'

function SeatMesh({ seat, onSelect, selected }: { seat: Seat; onSelect: (id: string) => void; selected: boolean }) {
  const color = seat.status === 'booked' ? '#333' : selected ? '#d4af37' : seat.type === 'recliner' ? '#5b2245' : seat.type === 'premium' ? '#2d2458' : '#1e2f4a'
  const emissive = selected ? '#6b5618' : '#000000'
  return (
    <group position={[seat.x, 0, seat.z]} onClick={(e) => { e.stopPropagation(); if (seat.status !== 'booked') onSelect(seat.id) }}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[0.85, 0.18, 0.8]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={selected ? 0.6 : 0} roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.7, -0.32]} castShadow>
        <boxGeometry args={[0.8, 0.85, 0.16]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={selected ? 0.5 : 0} roughness={0.55} />
      </mesh>
      {/* armrests */}
      <mesh position={[-0.46, 0.4, 0]}><boxGeometry args={[0.08, 0.35, 0.7]} /><meshStandardMaterial color="#222" /></mesh>
      <mesh position={[0.46, 0.4, 0]}><boxGeometry args={[0.08, 0.35, 0.7]} /><meshStandardMaterial color="#222" /></mesh>
      {seat.type === 'recliner' && (
        <mesh position={[0, 0.05, 0.55]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.75, 0.12, 0.7]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      )}
    </group>
  )
}

function TheaterMini() {
  const { seats, selectSeat, selectedSeat } = useStore()
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <pointLight position={[0, 6, -2]} intensity={12} color="#7ec8ff" distance={20} />
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 12]} receiveShadow>
        <planeGeometry args={[30, 35]} />
        <meshStandardMaterial color="#0b0b12" roughness={0.95} />
      </mesh>
      {/* screen */}
      <mesh position={[0, 3.5, -1]}>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial color="#1a3555" emissive="#0f2038" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 3.5, -1.05]}>
        <planeGeometry args={[15, 6.8]} />
        <meshStandardMaterial color="#050508" />
      </mesh>
      {seats.map(s => (
        <SeatMesh key={s.id} seat={s} onSelect={selectSeat} selected={selectedSeat?.id === s.id} />
      ))}
    </>
  )
}

export default function SeatSelect() {
  const { selectedMovie, selectedTheater, selectedShowtime, selectedSeat, setStep } = useStore()
  const seatLabel = selectedSeat ? `${selectedSeat.row}${selectedSeat.number} • ${selectedSeat.type} • ₹${selectedSeat.price}` : 'No seat selected'

  if (!selectedMovie || !selectedTheater) return null

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#050508' }}>
      <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,5,8,0.8)', backdropFilter: 'blur(10px)', zIndex: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button className="btn-ghost" onClick={() => setStep('theaters')}>← Back</button>
          <div>
            <div className="display" style={{ fontSize: 18 }}>{selectedMovie.title}</div>
            <div style={{ fontSize: 12, color: '#9a9aa6' }}>{selectedTheater.name} • {selectedShowtime || selectedMovie.showtimes[0]}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="hud-panel" style={{ fontSize: 13 }}>{seatLabel}</div>
          <button className="btn-primary" disabled={!selectedSeat} onClick={() => setStep('experience')}>Experience This Seat</button>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas shadows gl={{ antialias: true, powerPreference: 'high-performance' }} dpr={[1, 1.5]}>
          <PerspectiveCamera makeDefault position={[0, 18, 22]} fov={50} />
          <OrbitControls enableDamping dampingFactor={0.08} maxPolarAngle={Math.PI / 2.1} minDistance={8} maxDistance={35} target={[0, 0, 10]} />
          <TheaterMini />
        </Canvas>
        <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)' }} className="screen-indicator">
          <div className="screen-bar" />
          <div className="screen-label">Screen This Way</div>
        </div>
        <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)' }} className="seat-legend hud-panel">
          <span><i className="dot" style={{ background: '#1e2f4a' }} /> Standard ₹180</span>
          <span><i className="dot" style={{ background: '#2d2458' }} /> Premium ₹320</span>
          <span><i className="dot" style={{ background: '#5b2245' }} /> Recliner ₹550</span>
          <span><i className="dot" style={{ background: '#333' }} /> Booked</span>
          <span><i className="dot" style={{ background: '#d4af37' }} /> Selected</span>
        </div>
        <div style={{ position: 'absolute', left: 16, bottom: 18, fontSize: 12, color: '#888' }} className="hud-panel">
          Drag to orbit • Scroll to zoom • Tap a seat to select
        </div>
      </div>
    </div>
  )
}
