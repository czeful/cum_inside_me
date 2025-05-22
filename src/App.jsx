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
import UserProfile from "./pages/UserProfile";
import FriendsList from "./pages/FriendsList";
import FriendRequests from "./pages/FriendRequests";
import MyProfile from "./pages/MyProfile";
import FindFriends from "./pages/FindFriends";



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

        <Route path="/users/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/friends" element={<ProtectedRoute><FriendsList /></ProtectedRoute>} />
        <Route path="/friend-requests" element={<ProtectedRoute><FriendRequests /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
        <Route path="/find-friend" element={<ProtectedRoute><FindFriends /></ProtectedRoute>} />   
      </Routes>
    </div>
  )
}

export default App
