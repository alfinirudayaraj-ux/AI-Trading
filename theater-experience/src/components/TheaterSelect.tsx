import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

export default function TheaterSelect() {
  const { theaters, selectedMovie, setSelectedTheater, setSelectedShowtime, selectedShowtime, setStep } = useStore()
  if (!selectedMovie) return null
  return (
    <div className="page" style={{ maxWidth: 1100, margin: '0 auto', paddingTop: 80 }}>
      <button className="nav-back" onClick={() => setStep('movies')}>← Movies</button>
      <div className="chip gold" style={{ marginBottom: 12 }}>Selected: {selectedMovie.title}</div>
      <h1 className="section-title display">Choose Theatre & Showtime</h1>
      <p className="section-sub">Pick a theatre near you. You'll preview the exact seat view next.</p>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: '#9a9aa6', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Showtime</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {selectedMovie.showtimes.map(t => (
            <button
              key={t}
              className={`btn-ghost`}
              style={{ borderColor: selectedShowtime === t ? 'var(--accent)' : undefined, color: selectedShowtime === t ? 'var(--accent)' : undefined, background: selectedShowtime === t ? 'rgba(212,175,55,0.08)' : undefined }}
              onClick={() => setSelectedShowtime(t)}
            >{t}</button>
          ))}
        </div>
      </div>

      <div className="grid-theaters">
        {theaters.map((t, i) => (
          <motion.div
            key={t.id}
            className="card theater-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => { if (!selectedShowtime) setSelectedShowtime(selectedMovie.showtimes[0]); setSelectedTheater(t) }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <h3 className="display" style={{ fontSize: 20, marginBottom: 4 }}>{t.name}</h3>
                <div style={{ color: '#9a9aa6', fontSize: 14 }}>{t.location} • {t.distance}</div>
              </div>
              <span className="chip gold">Select</span>
            </div>
            <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {t.formats.map(f => <span key={f} className="chip">{f}</span>)}
              {t.amenities.map(a => <span key={a} className="chip">{a}</span>)}
            </div>
            <div style={{ marginTop: 14, fontSize: 13, color: '#b8b8c8' }}>Seat types: {t.seatTypes.join(', ')}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
