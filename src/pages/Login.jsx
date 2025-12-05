import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

       try {
        await login(loginId, password);
        alert('로그인에 성공했습니다');
       } catch (err) {
        console.error('로그인 실패:', error.response ? error.response.data : error.message);
        alert(`로그인 실패: ${error.message}`);
        setError(errorMessage);
       }

    };

    return (
        <div className="flex flex-col items-center justify-center h-screen text-white" onSubmit={handleSubmit}>
            <h2 className="text-2xl mb-6">로그인</h2>

            <form className="flex flex-col gap-4 w-72" onSubmit={handleSubmit}>
                <input className="p-2 rounded bg-[#1a1c21]" value={loginId} 
                    onChange={(e) => setLoginId(e.target.value)} placeholder="아이디"/>
                <input className="p-2 rounded bg-[#1a1c21]" value={password} type="password" 
                    onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호"/>
            
                <button className="bg-blue-600 py-2 rounded" type="submit">로그인</button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>

            <p className="mt-4 text-gray-400">
                계정이 없으신가요?{" "}
                <Link to="/userjoin" className="text-blue-400 hover:underline">
                    회원가입
                </Link>
            </p>
        </div>
    );
}