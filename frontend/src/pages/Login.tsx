import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import "./AuthLayout.css";

export default function Login() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    try {
      const token = await login({ username, password });
      localStorage.setItem("accessToken", token);
      nav("/feed");
    } catch {
      setErr("Login failed. Please check your account.");
    }
  };

  return (
    <div className="auth-wrap">
      {/* 왼쪽: 이미지 / 브랜딩 */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-inner">
            <h1>B.L.O.G</h1>
            <p>Fresh Thoughts, Simply Written</p>
          </div>
        </div>
      </div>

      {/* 오른쪽: 로그인 폼 */}
      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">Login</h2>

          <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
            <input
              className="auth-input"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="auth-input"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="auth-btn auth-btn-primary">Log in</button>
          </form>

          {err && <p className="auth-error">{err}</p>}

          <p className="auth-link">
            No account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
