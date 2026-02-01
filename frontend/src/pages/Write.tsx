// src/pages/Write.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts";
import { getMyUsernameFromToken } from "../utils/auth";

export default function Write() {
  const nav = useNavigate();
  const myUsername = useMemo(() => getMyUsernameFromToken(), []);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canSubmit =
    title.trim().length > 0 && content.trim().length > 0 && !busy;

  const onBack = () => nav("/feed");

  const onSubmit = async () => {
    if (!canSubmit) return;

    setBusy(true);
    setErr(null);

    try {
      await createPost({
        title: title.trim(),
        content: content.trim(),
      });

      // ✅ 작성 성공 -> 피드로
      nav("/feed");
    } catch (e: any) {
      setErr("작성에 실패했습니다. 토큰/서버/권한을 확인하세요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      {/* 상단바 */}
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "#fff",
          borderBottom: "0.0625rem solid #eee",
          padding: "0.875rem 1.125rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 10,
        }}
      >
        <button
          onClick={onBack}
          style={{
            border: "0.0625rem solid #eee",
            background: "#fff",
            borderRadius: "999rem",
            padding: "0.5rem 0.75rem",
            cursor: "pointer",
            fontWeight: 800,
          }}
        >
          ← Back
        </button>

        <div style={{ fontWeight: 900, letterSpacing: "0.08em" }}>B.L.O.G</div>

        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          style={{
            border: "0.0625rem solid #111",
            background: "#111",
            color: "#fff",
            borderRadius: "999rem",
            padding: "0.5rem 0.875rem",
            cursor: !canSubmit ? "not-allowed" : "pointer",
            fontWeight: 900,
            opacity: !canSubmit ? 0.5 : 1,
          }}
        >
          {busy ? "Posting..." : "Post"}
        </button>
      </div>

      {/* 본문 */}
      <div style={{ maxWidth: "45rem", margin: "0 auto", padding: "1.125rem" }}>
        <div
          style={{
            background: "#fff",
            border: "0.0625rem solid #eee",
            borderRadius: "1rem",
            padding: "1rem",
            display: "grid",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "999rem",
                background: "#111",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
              }}
            >
              {myUsername?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div
              style={{ fontSize: "0.95rem", color: "#333", fontWeight: 800 }}
            >
              {myUsername || "unknown"}
            </div>
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            disabled={busy}
            style={{
              border: "0.0625rem solid #ddd",
              borderRadius: "0.75rem",
              padding: "0.875rem 0.875rem",
              outline: "none",
              fontSize: "1rem",
              fontWeight: 800,
            }}
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something..."
            disabled={busy}
            rows={10}
            style={{
              border: "0.0625rem solid #ddd",
              borderRadius: "0.75rem",
              padding: "0.875rem 0.875rem",
              outline: "none",
              fontSize: "1rem",
              lineHeight: 1.6,
              resize: "vertical",
            }}
          />

          {err && (
            <div style={{ color: "#d00", fontSize: "0.9rem", fontWeight: 700 }}>
              {err}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "0.625rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={onBack}
              disabled={busy}
              style={{
                border: "0.0625rem solid #eee",
                background: "#fff",
                borderRadius: "0.75rem",
                padding: "0.75rem 0.875rem",
                cursor: busy ? "not-allowed" : "pointer",
                fontWeight: 800,
                opacity: busy ? 0.6 : 1,
              }}
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={!canSubmit}
              style={{
                border: "0.0625rem solid #111",
                background: "#111",
                color: "#fff",
                borderRadius: "0.75rem",
                padding: "0.75rem 0.875rem",
                cursor: !canSubmit ? "not-allowed" : "pointer",
                fontWeight: 900,
                opacity: !canSubmit ? 0.5 : 1,
              }}
            >
              {busy ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
