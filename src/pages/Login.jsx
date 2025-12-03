import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handLeSubmit = (e) => {
        e.preventDefault();

        login({ username: "test1" });
        navigate("/profile");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen text-white" onSubmit={handLeSubmit}>
            <h2 className="text-2xl mb-6">로그인</h2>

            <form className="flex flex-col gap-4 w-72" onSubmit={handLeSubmit}>
                <input className="p-2 rounded bg-[#1a1c21]" placeholder="아이디" />
                <input className="p-2 rounded bg-[#1a1c21]" type="password" placeholder="비밀번호" />
            
                <button className="bg-blue-600 py-2 rounded">로그인</button>
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