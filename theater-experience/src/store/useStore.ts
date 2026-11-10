import { create } from 'zustand'

export type Movie = {
  id: string
  title: string
  genre: string
  rating: number
  reviews: string
  duration: string
  language: string
  certificate: string
  poster: string
  backdrop: string
  tagline: string
  showtimes: string[]
}

export type Theater = {
  id: string
  name: string
  location: string
  distance: string
  amenities: string[]
  formats: string[]
  seatTypes: ('standard' | 'premium' | 'recliner')[]
}

export type Seat = {
  id: string
  row: string
  number: number
  type: 'standard' | 'premium' | 'recliner'
  status: 'available' | 'booked' | 'selected'
  x: number
  z: number
  price: number
}

export type Step = 'home' | 'movies' | 'theaters' | 'seats' | 'experience' | 'payment' | 'confirmation'

interface AppState {
  step: Step
  movies: Movie[]
  theaters: Theater[]
  selectedMovie: Movie | null
  selectedTheater: Theater | null
  selectedShowtime: string | null
  seats: Seat[]
  selectedSeat: Seat | null
  homeMovieIndex: number
  isTransitioning: boolean
  setStep: (step: Step) => void
  setSelectedMovie: (movie: Movie) => void
  setSelectedTheater: (theater: Theater) => void
  setSelectedShowtime: (time: string) => void
  selectSeat: (seatId: string) => void
  setHomeMovieIndex: (i: number) => void
  setTransitioning: (v: boolean) => void
  reset: () => void
}

function generateSeats(): Seat[] {
  const rows = ['A','B','C','D','E','F','G','H','I','J']
  const seats: Seat[] = []
  const centerX = 0
  rows.forEach((row, ri) => {
    const count = ri < 3 ? 10 : ri < 7 ? 12 : 14
    const type = ri < 3 ? 'standard' : ri < 7 ? 'premium' : 'recliner'
    const price = type === 'standard' ? 180 : type === 'premium' ? 320 : 550
    const z = 4 + ri * 2.2
    const start = -(count - 1) / 2
    for (let n = 0; n < count; n++) {
      const num = n + 1
      const booked = Math.random() < 0.28
      seats.push({
        id: `${row}${num}`,
        row,
        number: num,
        type,
        status: booked ? 'booked' : 'available',
        x: centerX + (start + n) * 1.15,
        z,
        price,
      })
    }
  })
  return seats
}

const movies: Movie[] = [
  {
    id: 'm1',
    title: 'Kalki 2898 AD',
    genre: 'Sci-Fi / Epic',
    rating: 8.4,
    reviews: '4.2K reviews • "A visual spectacle redefining Indian sci-fi"',
    duration: '3h 1m',
    language: 'Telugu / Hindi',
    certificate: 'UA',
    poster: 'linear-gradient(135deg,#1a0a2e,#4a1942,#c9a227)',
    backdrop: 'linear-gradient(135deg,#0d0015,#2d1b4e,#1a0a2e)',
    tagline: 'The future awakens.',
    showtimes: ['10:30 AM','2:15 PM','6:00 PM','9:45 PM'],
  },
  {
    id: 'm2',
    title: 'Pushpa 2: The Rule',
    genre: 'Action / Drama',
    rating: 8.7,
    reviews: '6.1K reviews • "Allu Arjun delivers a thunderous performance"',
    duration: '3h 20m',
    language: 'Telugu / Hindi',
    certificate: 'UA',
    poster: 'linear-gradient(135deg,#2b1d0e,#6b3a1f,#d4a017)',
    backdrop: 'linear-gradient(135deg,#1a1005,#3d2510,#2b1d0e)',
    tagline: 'Pushpa ka rule.',
    showtimes: ['11:00 AM','3:00 PM','6:30 PM','10:00 PM'],
  },
  {
    id: 'm3',
    title: 'Stree 2',
    genre: 'Horror / Comedy',
    rating: 8.1,
    reviews: '3.8K reviews • "Hilarious, spooky, and brilliantly crafted"',
    duration: '2h 29m',
    language: 'Hindi',
    certificate: 'UA',
    poster: 'linear-gradient(135deg,#0a1a1a,#1a3a3a,#b8860b)',
    backdrop: 'linear-gradient(135deg,#050f0f,#102828,#0a1a1a)',
    tagline: 'Woh phir aayegi.',
    showtimes: ['10:00 AM','1:30 PM','5:00 PM','8:30 PM'],
  },
  {
    id: 'm4',
    title: 'Devara: Part 1',
    genre: 'Action / Thriller',
    rating: 7.9,
    reviews: '2.9K reviews • "Jr NTR commands the screen with raw intensity"',
    duration: '2h 58m',
    language: 'Telugu / Hindi',
    certificate: 'UA',
    poster: 'linear-gradient(135deg,#0a1628,#1a3a5c,#4a90a4)',
    backdrop: 'linear-gradient(135deg,#050d18,#10243a,#0a1628)',
    tagline: 'Fear has a new name.',
    showtimes: ['9:45 AM','1:00 PM','4:30 PM','8:00 PM'],
  },
  {
    id: 'm5',
    title: 'Bhool Bhulaiyaa 3',
    genre: 'Horror / Comedy',
    rating: 7.6,
    reviews: '2.4K reviews • "Kartik Aaryan shines in this spooky entertainer"',
    duration: '2h 38m',
    language: 'Hindi',
    certificate: 'UA',
    poster: 'linear-gradient(135deg,#1a0a0a,#4a1a1a,#c45c26)',
    backdrop: 'linear-gradient(135deg,#100505,#301010,#1a0a0a)',
    tagline: 'Manjulika returns.',
    showtimes: ['10:15 AM','1:45 PM','5:15 PM','9:00 PM'],
  },
]

const theaters: Theater[] = [
  { id:'t1', name:'PVR INOX — Phoenix Palladium', location:'Lower Parel, Mumbai', distance:'2.1 km', amenities:['Dolby Atmos','IMAX','Recliners','F&B'], formats:['IMAX','4DX','3D'], seatTypes:['standard','premium','recliner'] },
  { id:'t2', name:'INOX Megaplex — Inorbit Mall', location:'Malad West, Mumbai', distance:'5.4 km', amenities:['Dolby Atmos','Laser','Gourmet'], formats:['Laser','3D'], seatTypes:['standard','premium','recliner'] },
  { id:'t3', name:'Cinepolis — Viviana Mall', location:'Thane West', distance:'8.2 km', amenities:['4DX','Dolby 7.1','VIP'], formats:['4DX','3D','2D'], seatTypes:['standard','premium'] },
  { id:'t4', name:'PVR ICON — Infiniti Mall', location:'Andheri West, Mumbai', distance:'3.7 km', amenities:['Gold Class','Dolby Atmos','Butler'], formats:['Gold','3D','2D'], seatTypes:['premium','recliner'] },
]

export const useStore = create<AppState>((set, get) => ({
  step: 'home',
  movies,
  theaters,
  selectedMovie: null,
  selectedTheater: null,
  selectedShowtime: null,
  seats: generateSeats(),
  selectedSeat: null,
  homeMovieIndex: 0,
  isTransitioning: false,
  setStep: (step) => set({ step }),
  setSelectedMovie: (movie) => set({ selectedMovie: movie, step: 'theaters' }),
  setSelectedTheater: (theater) => set({ selectedTheater: theater, step: 'seats', seats: generateSeats(), selectedSeat: null }),
  setSelectedShowtime: (time) => set({ selectedShowtime: time }),
  selectSeat: (seatId) => {
    const seats = get().seats.map(s => {
      if (s.id === seatId) {
        if (s.status === 'booked') return s
        return { ...s, status: s.status === 'selected' ? 'available' as const : 'selected' as const }
      }
      if (s.status === 'selected') return { ...s, status: 'available' as const }
      return s
    })
    const selectedSeat = seats.find(s => s.status === 'selected') || null
    set({ seats, selectedSeat })
  },
  setHomeMovieIndex: (i) => set({ homeMovieIndex: i }),
  setTransitioning: (v) => set({ isTransitioning: v }),
  reset: () => set({ step: 'home', selectedMovie: null, selectedTheater: null, selectedShowtime: null, selectedSeat: null, seats: generateSeats() }),
}))
