import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import localforage from 'localforage';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await localforage.removeItem('jwtToken'); // JWT 토큰 삭제
      setUser(null); // 사용자 정보 초기화
      console.log("로그아웃 성공: 토큰 삭제 및 사용자 정보 초기화");
      navigate('/login'); // 로그인 페이지로 리다이렉트
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await localforage.getItem('jwtToken');
        if (token) {
          setUser({ username: "인증된사용자"}); 
        }
      } catch (error) {
        console.error("저장된 토큰 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // API 요청 시 JWT 토큰 자동 추가 (axios interceptor)
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(async (config) => {
      const token = await localforage.getItem('jwtToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        // 토큰 만료 등 401 응답 시 로그아웃 처리
        if (error.response && error.response.status === 401 && !error.config._retry) {
            error.config._retry = true; // 무한 루프 방지
            console.warn("401 Unauthorized - 토큰 만료 또는 유효하지 않음. 로그아웃 처리.");
            await logout(); // 로그아웃 함수 호출
            return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    );

    // 컴포넌트 언마운트 시 인터셉터 제거
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]); // logout 함수가 변경될 때 다시 실행 (함수가 안정적이면 무한 루프 위험 낮음)


  // Provider가 제공할 값들
  const authContextValue = {
    user,
    loading,
    login: async (loginId, password) => { // 로그인 함수 (나중에 여기에 axios.post('login') 로직 넣기)
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', { loginId, password });
            const { token } = response.data;
            await localforage.setItem('jwtToken', token);
            // 백엔드에서 user 정보를 받아와서 setUser에 넣어야 함
            setUser({ username: loginId /* 백엔드에서 받아온 실제 user 정보 */ }); 
            navigate('/'); // 로그인 후 홈으로 이동
            return true; // 로그인 성공
        } catch (error) {
            console.error("로그인 실패:", error.response?.data || error.message);
            throw error; // 에러를 호출자에게 다시 던지기
        }
    },
    logout, // 위에서 정의한 로그아웃 함수 제공
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