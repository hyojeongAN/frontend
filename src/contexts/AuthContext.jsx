import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import localforage from 'localforage';
import axiosInstance from '../api/axiosConfig'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { username: '...', isAuthenticated: true/false, role: '...' }
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 토큰 파싱 및 사용자 정보 설정 함수 (재사용을 위해)
  const parseTokenAndSetUser = useCallback(async (token) => {
    if (!token) {
        setUser(null);
        return;
    }
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ username: payload.sub, isAuthenticated: true, role: payload.auth }); // JWT 페이로드에서 역할(auth) 클레임도 가져옴
    } catch (jwtError) {
        console.error("JWT 토큰 파싱 오류:", jwtError);
        await localforage.removeItem('jwtToken'); // 유효하지 않은 토큰은 삭제
        setUser(null);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await localforage.removeItem('jwtToken');
      setUser(null);
      console.log("로그아웃 성공: 토큰 삭제 및 사용자 정보 초기화");
    
      
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  }, [navigate]);

  // 컴포넌트 마운트 시 저장된 토큰을 확인하고 사용자 상태를 로드
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await localforage.getItem('jwtToken');
        await parseTokenAndSetUser(token); // 토큰 파싱 로직 분리
      } catch (error) {
        console.error("저장된 토큰 불러오기 실패:", error);
        await localforage.removeItem('jwtToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [parseTokenAndSetUser]); // parseTokenAndSetUser 의존성 추가

  // API 요청 시 JWT 토큰 자동 추가 (axios interceptor) -> axiosInstance.js로 이동!
  // axiosInstance의 interceptor가 global하게 작동하므로 여기에 다시 정의할 필요 없음.
  // 단, 401/403 응답 시 logout 처리는 여전히 필요하므로 아래 로직을 유지

  useEffect(() => {
    // AuthContext의 logout 함수를 axios 인터셉터에서 사용할 수 있도록 캡쳐
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;
            console.warn("401 Unauthorized 또는 403 Forbidden - 토큰 만료 또는 유효하지 않음. 자동 로그아웃 처리.");
            await logout(); // AuthContext의 logout 함수 호출
            return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [logout]);


  const authContextValue = {
    user,
    loading,
    login: async (loginId, password) => {
        try {
            const response = await axiosInstance.post('/auth/login', { loginId, password });
            const { token } = response.data;
            await localforage.setItem('jwtToken', token);
            
            await parseTokenAndSetUser(token); // 로그인 성공 후 사용자 정보 설정

            navigate('/'); // 로그인 성공 후 루트 경로 (대시보드)로 이동
            return true; // 로그인 성공
        } catch (error) {
            console.error("로그인 실패:", error.response?.data || error.message);
            throw error; // 에러를 호출자에게 다시 던지기
        }
    },
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};