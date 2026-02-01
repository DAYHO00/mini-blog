import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 주소
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청마다 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// (선택) 401이면 토큰 제거 + 로그인으로 유도
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("accessToken");
      // 라우터 밖이라 강제 이동(간단)
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);
