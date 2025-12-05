import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import localforage from "localforage";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await localforage.removeItem('jwtToken');
                console.log('로그아웃 성공: JWT 토큰이 삭제되었습니다.');
                alert('로그아웃 되었습니다!');
                navigate('/login');
            } catch (error) {
                console.error('로그아웃 실패:', error);
                alert('로그아웃 중 오류가 발생했습니다.');
                navigate('/');
            }
        };
        handleLogout();
    }, [navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p>로그아웃 중입니다</p>
        </div>
    );
}