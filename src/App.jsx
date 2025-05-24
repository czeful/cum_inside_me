// File: src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import GoalsList from "./pages/GoalsList";
import GoalCreate from "./pages/GoalCreate";
import GoalDetail from "./pages/GoalDetail";
import UserProfile from "./pages/UserProfile";
import FriendsList from "./pages/FriendsList";
import FriendRequests from "./pages/FriendRequests";
import MyProfile from "./pages/Myprofile";
import FindFriends from "./pages/FindFriends";
import MyTemplates from "./pages/MyTemplates";
import TemplateCard from "./pages/template/TemplateCard";
import TemplateCreatePage from "./pages/template/TemplateCreatePage";
import TemplateDetailsPage from "./pages/template/TemplateDetailsPage";
import TemplateList from "../src/pages/template/TemplateList";
import AssistantChat from "./components/AssistantChat";
// import AdminDashboard from "./pages/admin/AdminDashboard";
import ChatPage from './pages/ChatPage'

function App() {
   const { isLoading, user } = useAuth();
   console.log('user из AuthContext:', user);


  if (isLoading) {
    return <div className="loading">Loading...</div>;
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

        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <GoalsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals/new"
          element={
            <ProtectedRoute>
              <GoalCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals/:id"
          element={
            <ProtectedRoute>
              <GoalDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/:id"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <FriendsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friend-requests"
          element={
            <ProtectedRoute>
              <FriendRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/find-friend"
          element={
            <ProtectedRoute>
              <FindFriends />
            </ProtectedRoute>
          }
        />

        {/* Главная страница шаблонов с табами */}
        <Route
          path="/templates"
          element={
            <ProtectedRoute>
              <TemplateList />
            </ProtectedRoute>
          }
        />

        {/* (опционально) — отдельные страницы если нужны */}
        <Route
          path="/templates/create"
          element={
            <ProtectedRoute>
              <TemplateCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/templates/my"
          element={
            <ProtectedRoute>
              <MyTemplates />
            </ProtectedRoute>
          }
        />
        <Route path="/templates/:id" element={<ProtectedRoute>
              <TemplateDetailsPage />
            </ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      </Routes>
      <AssistantChat user={user}/>
    </div>
  );
}

export default App;
