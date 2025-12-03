import { useAuth } from "../contexts/AuthContext"

export default function Profile () {
    const { user, logout } = useAuth;

    return (
        <div className="p-6 text-white">
            <h2 className="text-xl mb-4">프로필</h2>

            <p className="text-gray-300">사용자: {user?.username}</p>

            <button onClick={logout} className="mt-4 bg-red-600 px-4 py-2 rounded">
                로그아웃
            </button>
        </div>
    );
}