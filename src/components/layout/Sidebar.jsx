import { Link } from "react-router-dom";
import { Home, List, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen border-r border-white/5 p-6">
      <h1 className="text-2xl font-semibold mb-8 font-mono">
        errorscope
      </h1>

      <nav className="flex flex-col gap-2 text-gray-400">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5">
          <Home size={18}/>
          Dashboard
        </Link>

        <Link
          to="/logs"
          className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5">
          <List size={18}/>
          Error Logs
        </Link>

        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5">
          <Settings size={18}/>
          Settings
        </Link>
      </nav>
    </aside>
  );
}