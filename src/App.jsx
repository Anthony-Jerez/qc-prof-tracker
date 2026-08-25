import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProfessorProfile from './pages/ProfessorProfile'
import CourseDashboard from './pages/CourseDashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/prof/:name" element={<ProfessorProfile />} />
      <Route path="/prof/:name/:course" element={<CourseDashboard />} />
    </Routes>
  )
}

export default App
