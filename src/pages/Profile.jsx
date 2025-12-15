import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext"
import axiosInstance from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Profile () {
    const { user, logout } = useAuth(); // AuthContext에서 user, logout 가져오기
    const navigate = useNavigate(); //페이지 이동 훅

    const [detailedUserData, setDetailedUserData] = useState(null); // 백에서 가져올 상세 사용자 데이터
    const [errorStats, setErrorStats] = useState({ recentErrorCount: 0, todayErrorCount: 0 }); //에러 통계 데이터

    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(''); // 에러 메시지

    useEffect(() => {
        const fetchDetailedUserData = async () => {
            try {
                const response = await axiosInstance.get('/user/me');
                setDetailedUserData(response.data);
            } catch (err) {
                console.error("Faild to fetch detailed user data for profile:", err);
                setError("상세 프로필 정보를 불러오는데 실패했습니다.");
                // 에러 발생 시 (예: 토큰 만료) 로그인 페이지 등으로 리다이렉트할 수도 있음
                navigate('/login'); // 로그인 페이지 바로 이동
            } finally {
                setLoading(false);
            }
        };

        const fetchErrorStats = async () => {
            try {
                const response = await axiosInstance.get('/logs/statistics');
                console.log("백엔드에서 받은 에러 통계 데이터:", response.data);
                setErrorStats(response.data);
            } catch (err) {
                console.error("Failed to fetch error statistics:", err);
            } finally {

            }
        };

        // user가 AuthContext에 존재할 때만 API 호출 (로그인 상태인 경우)
        if (user) {
            Promise.all([fetchDetailedUserData(), fetchErrorStats()])
                .finally(() => setLoading(false));
        } else {
            // user가 AuthContext에 없으면 (로그아웃 상태 등) 로딩을 바로 종료
            setLoading(false);
            // navigate('/login');
        }
    }, [user]); // user 객체가 변경될 때마다 다시 불러옴

    if (loading) {
        return (
            <div className="p-6 text-white">
                <p>프로필 정보를 로딩 중...</p>
            </div>
        );
    }

    // 상세 정보가 있으면 상세 정보를 쓰고, 없으면 AuthContext의 user 정보를 사용
    const displayUser = detailedUserData || user;

    // 로그인 상태가 아니거나 정보가 없으면 (optional: 로그인 페이지로 리다이렉트)
    if (!displayUser) {
        return (
            <div className="p-6 text-white">
                <p>로그인이 필요합니다.</p>
                <button onClick={() => navigate('/login')} className="mt-4 bg-blue-600 px-4 py-2 rounded">
                    로그인
                </button>
            </div>
        );
    }

    return (
         <div className="p-6 text-white" style={{ maxWidth: '600px', margin: '50px auto', border: '1px solid #e0e0e0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', backgroundColor: '#2d3748' }}>
            <h2 className="text-xl mb-4" style={{ textAlign: 'center', color: '#fff' }}>
                {displayUser.userName || displayUser.username}님의 프로필
            </h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ marginBottom: '20px'}}>
                {/* <p> 태그 안에 <div>는 올 수 없어 <div>를 <p>로 변경 */}
                <p className="text-gray-300" style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#fff' }}>로그인 ID : <strong>{displayUser.loginId || displayUser.username}</strong></span> 
                </p>
                {displayUser.email && (
                    <p className="text-gray-300" style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#fff' }}>이메일 : <strong>{displayUser.email}</strong></span> 
                </p>
                )}
                {/* {displayUser.role && (
                    <p className="text-gray-300" style={{ marginBottom: '8px' }}>
                        <span style={{ color: '#fff' }}>역할 : <strong>{displayUser.role}</strong></span>
                    </p>
                )} */}
                {displayUser.createdAt && (
                    <p className="text-gray-300" style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#fff' }}>가입일 : {new Date(displayUser.createdAt).toLocaleDateString()}</span>
                </p>
                )}
                {displayUser.updatedAt && (
                    <p className="text-gray-300" style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#fff' }}>최근 수정일 : {new Date(displayUser.updatedAt).toLocaleDateString()}</span>
                </p>
                )}
            </div>

            <section style={{ borderTop: '1px solid #4a5568', paddingTop: '20px', marginTop: '20px' }}>
                <h3 className="text-white" style={{ marginBottom: '15px' }}>최근 활동 요약</h3>
                <p className="text-gray-300">최근 발생한 에러: {errorStats.recentErrorCount}</p>
                <p className="text-gray-300">오늘 발생한 에러: {errorStats.todayErrorCount}</p>
            </section>

            {/* <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button onClick={() => navigate('/settings')} className="mt-4 bg-blue-600 px-4 py-2 rounded" style={{ transition: 'background-color 0.3s ease' }}>
                    내 정보 수정하기
                </button>
            </div> */}

            <button onClick={logout} className="mt-4 bg-red-600 px-4 py-2 rounded">
                로그아웃
            </button>

        </div>
    );
}