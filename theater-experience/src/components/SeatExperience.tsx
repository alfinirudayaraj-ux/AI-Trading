import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../store/useStore'

function ScreenContent({ movieTitle, backdrop }: { movieTitle: string; backdrop: string }) {
  const texRef = useRef<THREE.CanvasTexture | null>(null)
  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 576
    return c
  }, [])

  useEffect(() => {
    const ctx = canvas.getContext('2d')!
    // parse gradient-ish backdrop
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    g.addColorStop(0, '#0d0015')
    g.addColorStop(0.5, '#1a2a4a')
    g.addColorStop(1, '#0a1020')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // cinematic bars
    ctx.fillStyle = 'rgba(0,0,0,0.55)'
    ctx.fillRect(0, 0, canvas.width, 60)
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60)
    // glow
    const rg = ctx.createRadialGradient(canvas.width * 0.5, canvas.height * 0.45, 50, canvas.width * 0.5, canvas.height * 0.45, 400)
    rg.addColorStop(0, 'rgba(120,180,255,0.18)')
    rg.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = rg
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // title
    ctx.fillStyle = '#f5f5f7'
    ctx.font = 'bold 64px Cinzel, serif'
    ctx.textAlign = 'center'
    ctx.fillText(movieTitle, canvas.width / 2, canvas.height / 2 - 10)
    ctx.font = '28px Inter, sans-serif'
    ctx.fillStyle = '#d4af37'
    ctx.fillText('NOW SHOWING • IMMERSIVE PREVIEW', canvas.width / 2, canvas.height / 2 + 40)
    ctx.font = '22px Inter, sans-serif'
    ctx.fillStyle = '#b8c8e0'
    ctx.fillText('This is your exact screen perspective from the selected seat', canvas.width / 2, canvas.height / 2 + 85)
    // vignette
    const vg = ctx.createRadialGradient(canvas.width/2, canvas.height/2, canvas.height*0.2, canvas.width/2, canvas.height/2, canvas.width*0.7)
    vg.addColorStop(0, 'rgba(0,0,0,0)')
    vg.addColorStop(1, 'rgba(0,0,0,0.45)')
    ctx.fillStyle = vg
    ctx.fillRect(0,0,canvas.width,canvas.height)
    if (texRef.current) texRef.current.needsUpdate = true
  }, [canvas, movieTitle, backdrop])

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    texRef.current = t
    return t
  }, [canvas])

  useFrame(({ clock }) => {
    // subtle brightness pulse
    const mat = (screenMat.current as any)
    if (mat) mat.emissiveIntensity = 0.85 + Math.sin(clock.elapsedTime * 1.5) * 0.05
  })
  const screenMat = useRef<THREE.MeshStandardMaterial>(null)

  return (
    <mesh position={[0, 4.2, -14.8]}>
      <planeGeometry args={[14, 7.2]} />
      <meshStandardMaterial ref={screenMat} map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.85} toneMapped={false} />
    </mesh>
  )
}

function LookControls({ enabled }: { enabled: boolean }) {
  const { camera, gl } = useThree()
  const isDragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const spherical = useRef({ theta: Math.PI, phi: Math.PI / 2 - 0.05 }) // facing -z (screen)
  const targetTheta = useRef(spherical.current.theta)
  const targetPhi = useRef(spherical.current.phi)

  useEffect(() => {
    const el = gl.domElement
    const onDown = (e: PointerEvent) => { isDragging.current = true; last.current = { x: e.clientX, y: e.clientY }; el.setPointerCapture(e.pointerId) }
    const onUp = () => { isDragging.current = false }
    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return
      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y
      last.current = { x: e.clientX, y: e.clientY }
      targetTheta.current -= dx * 0.004
      targetPhi.current -= dy * 0.003
      // clamp: allow looking around but keep seated feel
      targetPhi.current = Math.max(0.7, Math.min(2.2, targetPhi.current))
      targetTheta.current = Math.max(Math.PI - 1.25, Math.min(Math.PI + 1.25, targetTheta.current))
    }
    const onWheel = (e: WheelEvent) => {
      // small FOV zoom feel by adjusting phi slightly
      targetPhi.current += e.deltaY * 0.0005
      targetPhi.current = Math.max(0.7, Math.min(2.2, targetPhi.current))
    }
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointermove', onMove)
    el.addEventListener('wheel', onWheel, { passive: true })
    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointermove', onMove)
      el.removeEventListener('wheel', onWheel)
    }
  }, [gl])

  useFrame(() => {
    if (!enabled) return
    spherical.current.theta += (targetTheta.current - spherical.current.theta) * 0.12
    spherical.current.phi += (targetPhi.current - spherical.current.phi) * 0.12
    const r = 0.01
    const dir = new THREE.Vector3(
      Math.sin(spherical.current.phi) * Math.sin(spherical.current.theta),
      Math.cos(spherical.current.phi),
      Math.sin(spherical.current.phi) * Math.cos(spherical.current.theta)
    )
    const lookAt = camera.position.clone().add(dir.multiplyScalar(r))
    camera.lookAt(lookAt)
  })
  return null
}

function TheaterEnvironment({ seatX, seatZ, seatRow }: { seatX: number; seatZ: number; seatRow: string }) {
  const seats = useStore(s => s.seats)
  const selectedSeat = useStore(s => s.selectedSeat)
  return (
    <group>
      {/* structure */}
      <mesh position={[0, 6, 0]} rotation={[Math.PI/2,0,0]}><planeGeometry args={[40,50]} /><meshStandardMaterial color="#080810" roughness={1} /></mesh>
      <mesh position={[0, -0.5, 5]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[40,50]} /><meshStandardMaterial color="#15101a" roughness={0.95} /></mesh>
      <mesh position={[-12, 3, 5]} rotation={[0, Math.PI/2, 0]}><planeGeometry args={[50, 14]} /><meshStandardMaterial color="#0a0912" /></mesh>
      <mesh position={[12, 3, 5]} rotation={[0, -Math.PI/2, 0]}><planeGeometry args={[50, 14]} /><meshStandardMaterial color="#0a0912" /></mesh>
      <mesh position={[0, 3, 20]} rotation={[0, Math.PI, 0]}><planeGeometry args={[40,14]} /><meshStandardMaterial color="#07070c" /></mesh>
      <mesh position={[0, 3, -15]}><planeGeometry args={[40,14]} /><meshStandardMaterial color="#040406" /></mesh>
      {/* screen frame */}
      <mesh position={[0, 4.2, -14.9]}><planeGeometry args={[15.2, 8.2]} /><meshStandardMaterial color="#020203" /></mesh>

      {/* all seats as environment */}
      {seats.map(seat => {
        const isMine = seat.id === selectedSeat?.id
        const isFront = seat.z < seatZ - 0.3
        const isVisible = true
        if (!isVisible) return null
        const base = seat.type === 'recliner' ? '#3a1828' : seat.type === 'premium' ? '#201a3a' : '#141d30'
        const dark = isMine ? base : isFront ? '#15121a' : '#18141f'
        return (
          <group key={seat.id} position={[seat.x, 0, seat.z]}>
            <mesh position={[0, 0.22, 0]}><boxGeometry args={[0.85, 0.18, 0.8]} /><meshStandardMaterial color={dark} roughness={0.7} /></mesh>
            <mesh position={[0, 0.7, -0.32]}><boxGeometry args={[0.8, 0.85, 0.16]} /><meshStandardMaterial color={dark} roughness={0.65} /></mesh>
            <mesh position={[-0.46, 0.4, 0]}><boxGeometry args={[0.08, 0.35, 0.7]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
            <mesh position={[0.46, 0.4, 0]}><boxGeometry args={[0.08, 0.35, 0.7]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
            {seat.type === 'recliner' && <mesh position={[0, 0.05, 0.55]} rotation={[-0.2,0,0]}><boxGeometry args={[0.75, 0.12, 0.7]} /><meshStandardMaterial color={dark} /></mesh>}
          </group>
        )
      })}

      {/* aisle lights */}
      {Array.from({length: 10}).map((_,i)=>(
        <group key={i}>
          <pointLight position={[-5.5, 0.2, 3 + i*2.2]} intensity={0.35} distance={3} color="#ffcc77" />
          <mesh position={[-5.5, 0.05, 3 + i*2.2]}><sphereGeometry args={[0.05,8,8]} /><meshStandardMaterial emissive="#ffbb55" emissiveIntensity={2} color="#332200" /></mesh>
          <pointLight position={[5.5, 0.2, 3 + i*2.2]} intensity={0.35} distance={3} color="#ffcc77" />
          <mesh position={[5.5, 0.05, 3 + i*2.2]}><sphereGeometry args={[0.05,8,8]} /><meshStandardMaterial emissive="#ffbb55" emissiveIntensity={2} color="#332200" /></mesh>
        </group>
      ))}
      {/* ceiling accents */}
      {[-6,-2,2,6].map((z,i)=>(
        <pointLight key={i} position={[0, 5.5, z]} intensity={0.4} distance={12} color="#334466" />
      ))}
      <ambientLight intensity={0.12} />
      <pointLight position={[0, 5, -10]} intensity={6} distance={25} color="#7bb8ff" />
    </group>
  )
}

export default function SeatExperience() {
  const { selectedSeat, selectedMovie, selectedTheater, selectedShowtime, setStep } = useStore()
  const [hint, setHint] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 4000)
    return () => clearTimeout(t)
  }, [])

  if (!selectedSeat || !selectedMovie || !selectedTheater) {
    return <div className="page" style={{ paddingTop: 100 }}><button className="nav-back" onClick={() => setStep('seats')}>← Seats</button><p>No seat selected.</p></div>
  }

  const eyeHeight = selectedSeat.type === 'recliner' ? 1.05 : selectedSeat.type === 'premium' ? 1.15 : 1.2
  const camX = selectedSeat.x
  const camZ = selectedSeat.z + 0.05
  const camY = eyeHeight

  return (
    <div style={{ height: '100vh', position: 'relative', background: '#000', overflow: 'hidden' }}>
      <Canvas gl={{ antialias: true, powerPreference: 'high-performance' }} dpr={[1, 1.75]}>
        <PerspectiveCamera makeDefault position={[camX, camY, camZ]} fov={75} near={0.1} far={100} />
        <LookControls enabled={true} />
        <Suspense fallback={null}>
          <TheaterEnvironment seatX={camX} seatZ={camZ} seatRow={selectedSeat.row} />
          <ScreenContent movieTitle={selectedMovie.title} backdrop={selectedMovie.backdrop} />
        </Suspense>
      </Canvas>

      <div className="experience-overlay">
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <button className="btn-ghost" onClick={() => setStep('seats')}>← Change Seat</button>
          <div className="hud-panel">
            <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedMovie.title}</div>
            <div style={{ fontSize: 12, color: '#9a9aa6' }}>{selectedTheater.name}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div className="hud-panel" style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: '#9a9aa6' }}>Your Seat</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#d4af37' }}>{selectedSeat.row}{selectedSeat.number} <span style={{ fontSize: 12, color: '#ccc', textTransform: 'capitalize' }}>({selectedSeat.type})</span></div>
            <div style={{ fontSize: 12, color: '#9a9aa6' }}>{selectedShowtime || selectedMovie.showtimes[0]} • ₹{selectedSeat.price}</div>
          </div>
        </div>
      </div>

      {hint && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 20, pointerEvents: 'none' }} className="hud-panel">
          <div style={{ fontSize: 14, textAlign: 'center' }}>Drag or swipe to look around 360°</div>
          <div style={{ fontSize: 12, color: '#9a9aa6', textAlign: 'center', marginTop: 4 }}>Experience the exact view from seat {selectedSeat.row}{selectedSeat.number}</div>
        </div>
      )}

      <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10, pointerEvents: 'none' }}>
        <div className="hud-panel" style={{ pointerEvents: 'auto', maxWidth: 340 }}>
          <div style={{ fontSize: 12, color: '#9a9aa6', marginBottom: 4 }}>Seat Experience Preview</div>
          <div style={{ fontSize: 13, lineHeight: 1.5 }}>You're viewing the screen and theatre from eye-level at seat {selectedSeat.row}{selectedSeat.number}. This preview simulates sightlines, screen scale, and ambience from this position.</div>
        </div>
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: 10 }}>
          <button className="btn-ghost" onClick={() => setStep('seats')}>Try Another Seat</button>
          <button className="btn-primary" onClick={() => setStep('payment')}>Proceed to Pay ₹{selectedSeat.price}</button>
        </div>
      </div>
    </div>
  )
}
