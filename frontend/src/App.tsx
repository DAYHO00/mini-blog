import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import WritePost from "./pages/Write";
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  const token = localStorage.getItem("accessToken");

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ 로그인 상태면 /feed, 아니면 /login */}
        <Route
          path="/"
          element={<Navigate to={token ? "/feed" : "/login"} replace />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/feed"
          element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          }
        />

        <Route
          path="/write"
          element={
            <PrivateRoute>
              <WritePost />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
