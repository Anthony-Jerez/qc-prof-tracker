import { createBrowserRouter } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProfessorProfile from './pages/ProfessorProfile'
import CourseDashboard from './pages/CourseDashboard'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MyReviewsPage from './pages/MyReviewsPage'
import NotFoundPage from './pages/NotFoundPage'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/prof/:name', element: <ProfessorProfile /> },
  { path: '/prof/:name/:course', element: <CourseDashboard /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/my-reviews', element: <MyReviewsPage /> },
  { path: '*', element: <NotFoundPage /> },
])
