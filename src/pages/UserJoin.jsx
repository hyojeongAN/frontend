import { useState } from "react";
import { useNavigate } from "react-router-dom"

export default function UserJoin () {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");

    const [errors, setErrors] = useState({
        name: "",
        loginId: "",
        password: "",
        confirmPassword: "",
        email: "",
    });

    const validate = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "이름을 입력해주세요.";
    if (!loginId.trim()) newErrors.loginId = "로그인 아이디를 입력해주세요.";

    if (!password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (password.length < 6) {
      newErrors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "비밀번호 재확인을 입력해주세요.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    if (!email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "유효한 이메일을 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
        // 검증 실패 시 스크롤을 맨 위로 올려 에러를 보여줄 수도 있음
        // window.scrollTo(0, 0); 
        return;
    }

    try {
      await axios.post("/api/auth/userjoin", {
        username: name,
        loginId,
        password, // confirmPassword는 백엔드로 보낼 필요 없음
        email,
      });
      alert("회원가입 성공!");
      navigate("/login");
    } catch (error) {
      alert("회원가입 실패: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <h2 className="text-2xl mb-6">회원가입</h2>

      <form className="flex flex-col gap-4 w-72" onSubmit={handleSubmit} noValidate>
        <div>
          <input
            className="p-2 rounded bg-[#1a1c21] w-full"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <input
            className="p-2 rounded bg-[#1a1c21] w-full"
            placeholder="로그인 아이디"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
          {errors.loginId && <p className="text-red-500 text-sm mt-1">{errors.loginId}</p>}
        </div>

        <div>
          <input
            className="p-2 rounded bg-[#1a1c21] w-full"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <input
            className="p-2 rounded bg-[#1a1c21] w-full"
            type="password"
            placeholder="비밀번호 재확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        <div>
          <input
            className="p-2 rounded bg-[#1a1c21] w-full"
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <button type="submit" className="bg-blue-600 py-2 rounded mt-3">
          회원가입
        </button>
      </form>
    </div>
  );
}