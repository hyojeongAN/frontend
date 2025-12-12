import { Routes, Route, useNavigate, Navigate } from "react-router-dom"; // useNavigate import 추가
import MainLayout from "./MainLayout";
import Dashboard from "./pages/Dashboard";
import ErrorLogs from "./pages/ErrorLogs";
import Settings from "./pages/Settings"
import Profile from "./pages/Profile";
import UserJoin from "./pages/UserJoin";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from './contexts/AuthContext'; // useAuth 훅 import

// 인증이 필요한 라우트를 감싸는 컴포넌트
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // 아직 로딩 중이면 아무것도 렌더링하지 않거나 로딩 스피너 표시
  if (loading) {
    return <div>Loading authentication...</div>;
  }

  // user가 없거나 인증되지 않았으면 로그인 페이지로 리다이렉트
  if (!user || !user.isAuthenticated) {
    // navigate('/login');
    return <Navigate to="/login" replace />; // 리다이렉트 후에는 컴포넌트 렌더링 중지
  }

  return children; // 인증된 사용자만 children 렌더링
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 인증이 필요 없는 공개 라우트 */}
        <Route path="/userjoin" element={<UserJoin />} />
        <Route path="/login" element={<Login />} />

        {/* 인증이 필요한 라우트들을 ProtectedRoute로 감싸기 */}
        <Route path="/"element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} /> 
          <Route path="logs" element={<ErrorLogs />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* 일치하는 경로가 없을 때 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes> 
    </AuthProvider>
  );
}