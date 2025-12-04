import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handLeSubmit = async (e) => {
        e.preventDefault();

       if (!loginId.trim() || !password.trim()) {
        setError("아이디와 비밀번호를 모두 입력해주세요.")
        return;
       }

       try {
        await login({loginId, password});
        navigate("/profile");
       } catch {
        setError("로그인 실패: 아이디 또는 비밀번호를 확인하세요")
       }

    };

    return (
        <div className="flex flex-col items-center justify-center h-screen text-white" onSubmit={handLeSubmit}>
            <h2 className="text-2xl mb-6">로그인</h2>

            <form className="flex flex-col gap-4 w-72" onSubmit={handLeSubmit}>
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