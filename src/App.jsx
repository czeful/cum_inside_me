// File: src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import GoalsList from "./pages/GoalsList";
import GoalCreate from "./pages/GoalCreate";
import GoalDetail from "./pages/GoalDetail";




function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/goals" element={<ProtectedRoute><GoalsList /></ProtectedRoute>} />
        <Route path="/goals/new" element={<ProtectedRoute><GoalCreate /></ProtectedRoute>} />
        <Route path="/goals/:id" element={<ProtectedRoute><GoalDetail /></ProtectedRoute>} />  
          

      </Routes>
    </div>
  )
}

export default App
