import { useNavigate } from "react-router-dom"

export default function UserJoin () {
    const navigate = useNavigate();

    const handleUserJoin = (e) => {
        e.preventDefault();
        navigate("/login")
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen text-white">
            <h2 className="text-2xl mb-6">회원가입</h2>

            <form className="flex flex-col gap-4 w-72" onSubmit={handleUserJoin}>
                <input className="p-2 rounded bg-[#1a1c21]" placeholder="아이디" />
                <input className="p-2 rounded bg-[#1a1c21]" type="password" placeholder="비밀번호" />

                <button className="bg-blue-600 py-2 rounded">회원가입</button>
            </form>
        </div>
    );
}