import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

export default function MovieSelect() {
  const { movies, setSelectedMovie, setStep } = useStore()
  return (
    <div className="page" style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 80 }}>
      <button className="nav-back" onClick={() => setStep('home')}>← Home</button>
      <h1 className="section-title display">Now Showing</h1>
      <p className="section-sub">Top movies running in theatres across India. Select one to preview your seat.</p>
      <div className="grid-movies">
        {movies.map((m, i) => (
          <motion.div
            key={m.id}
            className="card movie-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            onClick={() => setSelectedMovie(m)}
          >
            <div className="movie-poster" style={{ background: m.poster }}>
              <div className="movie-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span className="chip gold">{m.certificate}</span>
                  <span className="rating">★ {m.rating}</span>
                </div>
                <h3 className="display">{m.title}</h3>
                <p>{m.genre} • {m.duration}</p>
                <p style={{ marginTop: 6, fontSize: 12, color: '#cfcfe0' }}>{m.tagline}</p>
              </div>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 12, color: '#9a9aa6', lineHeight: 1.5 }}>{m.reviews}</div>
              <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {m.showtimes.slice(0,3).map(t => <span key={t} className="chip">{t}</span>)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
