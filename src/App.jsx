import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import ErrorLogs from "./pages/ErrorLogs";
import Settings from "./pages/Settings";
import axios from 'axios';

export default function App() {
  return (
    <Routes>
      <Route path="/"element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="logs" element={<ErrorLogs />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes> 
  );
}