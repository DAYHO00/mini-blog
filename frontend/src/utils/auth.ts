export function getMyUsernameFromToken(): string | null {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(json);
    // 백엔드에서 sub에 username을 넣고 있으니 이걸 사용
    return typeof data.sub === "string" ? data.sub : null;
  } catch {
    return null;
  }
}
