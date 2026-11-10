import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

export default function Payment() {
  const { selectedMovie, selectedTheater, selectedSeat, selectedShowtime, setStep } = useStore()
  const [processing, setProcessing] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [card, setCard] = useState('')

  if (!selectedMovie || !selectedTheater || !selectedSeat) return null

  const convenience = 35
  const gst = Math.round(selectedSeat.price * 0.18)
  const total = selectedSeat.price + convenience + gst

  const pay = () => {
    setProcessing(true)
    setTimeout(() => { setProcessing(false); setStep('confirmation') }, 1800)
  }

  return (
    <div className="page" style={{ background: 'radial-gradient(ellipse 100% 50% at 50% 0%, #1a1428 0%, #050508 70%)' }}>
      <button className="nav-back" onClick={() => setStep('experience')}>← Back to View</button>
      <div className="payment-wrap">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="card" style={{ padding: 26 }}>
          <h2 className="display" style={{ fontSize: 28, marginBottom: 6 }}>Complete Your Booking</h2>
          <p style={{ color: '#9a9aa6', marginBottom: 22, fontSize: 14 }}>Secure checkout • Instant confirmation</p>
          <div className="field"><label>Full Name</label><input placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} /></div>
          <div className="field"><label>Email</label><input placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div className="field"><label>Card Number</label><input placeholder="4242 4242 4242 4242" value={card} onChange={e=>setCard(e.target.value)} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field"><label>Expiry</label><input placeholder="MM/YY" /></div>
            <div className="field"><label>CVV</label><input placeholder="123" /></div>
          </div>
          <button className="btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={pay} disabled={processing}>
            {processing ? <><span className="loader-ring" />Processing...</> : `Pay ₹${total} & Book Seat`}
          </button>
          <div style={{ marginTop: 12, fontSize: 12, color: '#777', textAlign: 'center' }}>Demo checkout — no real payment will be processed.</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="card" style={{ padding: 24, height: 'fit-content' }}>
          <h3 className="display" style={{ fontSize: 20, marginBottom: 16 }}>Booking Summary</h3>
          <div style={{ padding: 14, borderRadius: 14, background: selectedMovie.backdrop, marginBottom: 16, minHeight: 90, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div className="display" style={{ fontSize: 20 }}>{selectedMovie.title}</div>
            <div style={{ fontSize: 12, color: '#d5d5e0' }}>{selectedMovie.genre} • {selectedMovie.language}</div>
          </div>
          <div style={{ display: 'grid', gap: 10, fontSize: 14 }}>
            <Row label="Theatre" value={selectedTheater.name} />
            <Row label="Showtime" value={selectedShowtime || selectedMovie.showtimes[0]} />
            <Row label="Seat" value={`${selectedSeat.row}${selectedSeat.number} (${selectedSeat.type})`} highlight />
            <Row label="Experience" value="360° Seat Preview ✓" />
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '16px 0' }} />
          <div style={{ display: 'grid', gap: 8, fontSize: 14 }}>
            <Row label="Seat price" value={`₹${selectedSeat.price}`} />
            <Row label="Convenience fee" value={`₹${convenience}`} />
            <Row label="GST (18%)" value={`₹${gst}`} />
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 600 }}>
            <span className="display">Total</span><span style={{ color: '#d4af37' }}>₹{total}</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ color: '#9a9aa6' }}>{label}</span>
      <span style={{ textAlign: 'right', color: highlight ? '#d4af37' : '#f5f5f7', fontWeight: highlight ? 600 : 400 }}>{value}</span>
    </div>
  )
}
