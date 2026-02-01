import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api/auth";
import "./AuthLayout.css";

export default function Signup() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    try {
      await signup({ username, email, password });
      // ✅ 회원가입 성공하면 로그인 화면으로
      nav("/login");
    } catch {
      setErr("회원가입 실패: 중복 여부/형식/서버 상태를 확인하세요.");
    }
  };

  return (
    <div className="auth-wrap">
      {/* 왼쪽: 이미지/브랜딩 */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-inner">
            <h1>B.L.O.G</h1>
            <p>Fresh Thoughts, Simply Written</p>
          </div>
        </div>
      </div>

      {/* 오른쪽: 회원가입 폼 */}
      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">Signup</h2>

          <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
            <input
              className="auth-input"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <input
              className="auth-input"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <input
              className="auth-input"
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />

            <button className="auth-btn auth-btn-primary" type="submit">
              회원가입
            </button>
          </form>

          {err && <p className="auth-error">{err}</p>}

          <p className="auth-link">
            이미 계정이 있나요? <Link to="/login">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
