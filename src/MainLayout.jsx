import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="flex min-h-screen bg-[#0E0E11] text-[#E7E8EC]">
            <Sidebar />

            <div className="flex flex-col flex-1">
                <Header />
            
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}