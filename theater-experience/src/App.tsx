import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from './store/useStore'
import Home from './components/Home'
import MovieSelect from './components/MovieSelect'
import TheaterSelect from './components/TheaterSelect'
import SeatSelect from './components/SeatSelect'
import SeatExperience from './components/SeatExperience'
import Payment from './components/Payment'
import Confirmation from './components/Confirmation'

export default function App() {
  const step = useStore(s => s.step)

  const render = () => {
    switch (step) {
      case 'home': return <Home key="home" />
      case 'movies': return <MovieSelect key="movies" />
      case 'theaters': return <TheaterSelect key="theaters" />
      case 'seats': return <SeatSelect key="seats" />
      case 'experience': return <SeatExperience key="experience" />
      case 'payment': return <Payment key="payment" />
      case 'confirmation': return <Confirmation key="confirmation" />
      default: return <Home key="home" />
    }
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ minHeight: '100vh' }}
        >
          {render()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
