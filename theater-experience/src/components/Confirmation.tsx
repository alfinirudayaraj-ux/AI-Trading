import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

export default function Confirmation() {
  const { selectedMovie, selectedTheater, selectedSeat, selectedShowtime, reset } = useStore()
  if (!selectedMovie || !selectedTheater || !selectedSeat) return null
  const bookingId = `CV${Math.random().toString(36).slice(2,8).toUpperCase()}`
  return (
    <div className="ticket-success">
      <motion.div className="ticket-card" initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#2ecc71,#1e9e52)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 34, color: '#fff' }}>✓</motion.div>
        <h1 className="display glow-text" style={{ fontSize: 34, marginBottom: 6 }}>Booking Confirmed</h1>
        <p style={{ color: '#9a9aa6', marginBottom: 22 }}>Your immersive seat preview helped you pick the perfect view. Enjoy the show!</p>
        <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.25)', borderRadius: 16, padding: 18, marginBottom: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ color: '#9a9aa6', fontSize: 13 }}>Booking ID</span>
            <span style={{ color: '#d4af37', fontWeight: 600, letterSpacing: '0.08em' }}>{bookingId}</span>
          </div>
          <div className="display" style={{ fontSize: 22, marginBottom: 4 }}>{selectedMovie.title}</div>
          <div style={{ color: '#b8b8c8', fontSize: 14, marginBottom: 12 }}>{selectedTheater.name}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 14 }}>
            <div><div style={{ color: '#777', fontSize: 12 }}>SEAT</div><div style={{ fontWeight: 600, color: '#d4af37' }}>{selectedSeat.row}{selectedSeat.number} • {selectedSeat.type}</div></div>
            <div><div style={{ color: '#777', fontSize: 12 }}>SHOWTIME</div><div style={{ fontWeight: 600 }}>{selectedShowtime || selectedMovie.showtimes[0]}</div></div>
            <div><div style={{ color: '#777', fontSize: 12 }}>LANGUAGE</div><div>{selectedMovie.language}</div></div>
            <div><div style={{ color: '#777', fontSize: 12 }}>FORMAT</div><div>2D / Immersive Preview</div></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button className="btn-ghost" onClick={reset}>Book Another</button>
          <button className="btn-primary" onClick={reset}>Back to Home</button>
        </div>
      </motion.div>
    </div>
  )
}
