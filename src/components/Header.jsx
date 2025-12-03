import { Bell, User, SunMoon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleUserClick = () => {
        if (!user) {
            navigate("/login")
        } else {
            navigate("/profile")
        }
    }

    return (
        <header className="flex justify-end items-center px-6 py-4 border-b border-white/5 bg-[#111217]">
            <div className="flex items-center gap-4">
                <button aria-label="Notifications" className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded">
                    <Bell size={20} />
                </button>
                <button aria-label="Toggle theme" className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded">
                    <SunMoon size={20} />
                </button>

                <div onClick={handleUserClick}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer">
                    <User size={18} />
                </div>
            </div>
        </header>
    );
}
