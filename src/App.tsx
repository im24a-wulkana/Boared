import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import GameModeSelect from './pages/GameModeSelect'
import NineMensMorris from './pages/NineMensMorris'
import NineMensMorrisBot from './pages/NineMensMorrisBot'
import FourInARow from './pages/FourInARow'
import Chess from './pages/Chess'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ backgroundColor: '#2c1a0e', backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)' }}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/morris-select" element={<GameModeSelect />} />
          <Route path="/morris" element={<NineMensMorris />} />
          <Route path="/morris-bot" element={<NineMensMorrisBot />} />
          <Route path="/four-in-a-row" element={<FourInARow />} />
          <Route path="/chess" element={<Chess />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
