import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Scan from './pages/Scan'
import Report from './pages/Report'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

