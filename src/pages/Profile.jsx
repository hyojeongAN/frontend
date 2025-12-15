import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ recentErrorCount: 0, todayErrorCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    Promise.all([
      axiosInstance.get("/user/me"),
      axiosInstance.get("/logs/statistics"),
    ])
      .then(([profileRes, statsRes]) => {
        setProfile(profileRes.data);
        setStats(statsRes.data);
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="p-6 text-white">로딩 중...</div>;
  if (!profile) return null;

  return (
    <div className="p-8 text-white max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6">{profile.loginId}</h2>
    {/* <div className="flex items-center gap-3 mb-6">
      <h2 className="text-2xl font-semibold">{profile.loginId}</h2>
      <span
        className={`px-2 py-0.5 text-xs rounded ${
          profile.role === "ADMIN" ? "bg-blue-600/20 text-blue-400" : "bg-gray-600/20 text-gray-400"
        }`}
      >
        {profile.role === "ADMIN" ? "admin" : "user"}
      </span>
      <span
        className={`px-2 py-0.5 text-xs rounded ${
          profile.role === "ADMIN" ? "bg-red-600/20 text-red-400" : "bg-green-600/20 text-green-400"
        }`}
      >
        {profile.role === "ADMIN" ? "admin" : "active"}
      </span>
    </div> */}

    <div className="grid grid-cols-2 gap-6 bg-gray-900 p-6 rounded-xl">
      <Info label="이메일" value={profile.email} />
      <Info label="가입일" value={format(profile.createdAt)} />
      <Info label="최근 수정" value={format(profile.updatedAt)} />
    </div>

    <div className="mt-8">
      <h3 className="text-lg mb-4">최근 활동 요약</h3>
      <div className="grid grid-cols-3 gap-4">
        <Stat title="최근 에러" value={stats.recentErrorCount} />
        <Stat title="오늘 에러" value={stats.todayErrorCount} highlight />
        {/* <Stat title="역할" value={profile.role} /> */}
      </div>
    </div>

    <div className="mt-10 flex gap-3">
      <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">비밀번호 변경</button>
      <button onClick={logout} className="px-4 py-2 bg-red-600 rounded hover:bg-red-500">
        로그아웃
      </button>
    </div>
  </div>
);
}

/* ===== Components ===== */

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm">{value || "-"}</p>
    </div>
  );
}

function Stat({ title, value, highlight }) {
  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <p className="text-xs text-gray-400">{title}</p>
      <p className={`text-xl font-bold ${highlight ? "text-orange-400" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function format(date) {
  return date ? new Date(date).toLocaleDateString() : "-";
}
