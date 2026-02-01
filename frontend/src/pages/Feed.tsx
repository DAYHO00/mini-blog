import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts, deletePost } from "../api/posts";
import type { PostItem } from "../api/posts";
import {
  getLikeCount,
  getMyLike,
  likePost,
  unlikePost,
} from "../api/postLikes";
import { createComment, deleteComment, getComments } from "../api/comments";
import type { CommentItem } from "../api/comments";
import { getMyUsernameFromToken } from "../utils/auth";

export default function Feed() {
  const nav = useNavigate();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const myUsername = useMemo(() => getMyUsernameFromToken(), []);

  // ✅ 날짜 포맷 (게시글/댓글 공용)
  const formatDate = (isoString?: string) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const goHome = () => {
    nav("/login"); // ✅ "처음 화면"을 /feed로 본다면
    window.scrollTo(0, 0); // ✅ 이미 피드에 있어도 맨 위로 올려줌(선택)
  };

  // postId -> likeCount / liked
  const [likeCountMap, setLikeCountMap] = useState<Record<number, number>>({});
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});
  const [likeBusyMap, setLikeBusyMap] = useState<Record<number, boolean>>({});

  // 댓글 상태
  const [commentOpenMap, setCommentOpenMap] = useState<Record<number, boolean>>(
    {},
  );
  const [commentsMap, setCommentsMap] = useState<Record<number, CommentItem[]>>(
    {},
  );
  const [commentLoadingMap, setCommentLoadingMap] = useState<
    Record<number, boolean>
  >({});
  const [commentErrMap, setCommentErrMap] = useState<Record<number, string>>(
    {},
  );

  // 댓글 작성 입력 상태(postId별)
  const [commentInputMap, setCommentInputMap] = useState<
    Record<number, string>
  >({});
  const [commentCreateBusyMap, setCommentCreateBusyMap] = useState<
    Record<number, boolean>
  >({});

  // ✅ 댓글 삭제 busy (commentId별)
  const [commentDeleteBusyMap, setCommentDeleteBusyMap] = useState<
    Record<number, boolean>
  >({});

  // ✅ 게시글 삭제 busy (postId별)
  const [postDeleteBusyMap, setPostDeleteBusyMap] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        setLoading(true);

        const data = await getPosts();
        setPosts(data);

        const ids = data.map((p) => p.id);

        const counts = await Promise.all(ids.map((id) => getLikeCount(id)));
        const nextCountMap: Record<number, number> = {};
        ids.forEach((id, idx) => (nextCountMap[id] = counts[idx]));
        setLikeCountMap(nextCountMap);

        const myLikes = await Promise.all(ids.map((id) => getMyLike(id)));
        const nextLikedMap: Record<number, boolean> = {};
        ids.forEach((id, idx) => (nextLikedMap[id] = myLikes[idx]));
        setLikedMap(nextLikedMap);
      } catch {
        setErr("게시글을 불러오지 못했습니다. 서버/토큰을 확인하세요.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onWrite = () => nav("/write");

  const toggleLike = async (postId: number) => {
    if (likeBusyMap[postId]) return;

    const currentlyLiked = !!likedMap[postId];

    setLikeBusyMap((m) => ({ ...m, [postId]: true }));
    setLikedMap((m) => ({ ...m, [postId]: !currentlyLiked }));
    setLikeCountMap((m) => ({
      ...m,
      [postId]: Math.max(0, (m[postId] ?? 0) + (currentlyLiked ? -1 : 1)),
    }));

    try {
      const res = currentlyLiked
        ? await unlikePost(postId)
        : await likePost(postId);
      setLikedMap((m) => ({ ...m, [postId]: res.liked }));
      setLikeCountMap((m) => ({ ...m, [postId]: res.likeCount }));
    } catch {
      setLikedMap((m) => ({ ...m, [postId]: currentlyLiked }));
      setLikeCountMap((m) => ({
        ...m,
        [postId]: Math.max(0, (m[postId] ?? 0) + (currentlyLiked ? +1 : -1)),
      }));
      alert("좋아요 처리에 실패했습니다.");
    } finally {
      setLikeBusyMap((m) => ({ ...m, [postId]: false }));
    }
  };

  const toggleComments = async (postId: number) => {
    const willOpen = !commentOpenMap[postId];
    setCommentOpenMap((m) => ({ ...m, [postId]: willOpen }));
    if (!willOpen) return;

    if (commentsMap[postId]) return;

    setCommentErrMap((m) => {
      const next = { ...m };
      delete next[postId];
      return next;
    });

    setCommentLoadingMap((m) => ({ ...m, [postId]: true }));
    try {
      const list = await getComments(postId);
      setCommentsMap((m) => ({ ...m, [postId]: list }));
    } catch {
      setCommentErrMap((m) => ({
        ...m,
        [postId]: "댓글을 불러오지 못했습니다.",
      }));
    } finally {
      setCommentLoadingMap((m) => ({ ...m, [postId]: false }));
    }
  };

  const submitComment = async (postId: number) => {
    const content = (commentInputMap[postId] ?? "").trim();
    if (!content) return;

    if (commentCreateBusyMap[postId]) return;
    setCommentCreateBusyMap((m) => ({ ...m, [postId]: true }));

    try {
      const created = await createComment(postId, content);
      setCommentsMap((m) => {
        const prev = m[postId] ?? [];
        return { ...m, [postId]: [...prev, created] };
      });
      setCommentInputMap((m) => ({ ...m, [postId]: "" }));
    } catch {
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setCommentCreateBusyMap((m) => ({ ...m, [postId]: false }));
    }
  };

  // ✅ 댓글 삭제
  const removeComment = async (postId: number, commentId: number) => {
    if (commentDeleteBusyMap[commentId]) return;

    const ok = confirm("댓글을 삭제할까요?");
    if (!ok) return;

    setCommentDeleteBusyMap((m) => ({ ...m, [commentId]: true }));

    const prevList = commentsMap[postId] ?? [];
    setCommentsMap((m) => ({
      ...m,
      [postId]: (m[postId] ?? []).filter((c) => c.id !== commentId),
    }));

    try {
      await deleteComment(commentId);
    } catch {
      setCommentsMap((m) => ({ ...m, [postId]: prevList }));
      alert("댓글 삭제에 실패했습니다. 서버/권한을 확인하세요.");
    } finally {
      setCommentDeleteBusyMap((m) => ({ ...m, [commentId]: false }));
    }
  };

  // ✅ 게시글 작성자 판단
  const getPostAuthor = (p: PostItem) =>
    ((p as any).authorUsername ??
      (p as any).username ??
      (p as any).author ??
      (p as any).authorName ??
      "") as string;

  // ✅ 게시글 생성일 가져오기
  const getPostCreatedAt = (p: PostItem) =>
    ((p as any).createdAt ?? (p as any).created_at ?? "") as string;

  const isMyPost = (p: PostItem) => {
    const author = getPostAuthor(p);
    if (!author || !myUsername) return false;
    return author === myUsername;
  };

  // ✅ 게시글 삭제 (내 글만 실제 삭제)
  const removePost = async (postId: number, minePost: boolean) => {
    if (!minePost) return;
    if (postDeleteBusyMap[postId]) return;

    const ok = confirm("게시글을 삭제할까요?");
    if (!ok) return;

    setPostDeleteBusyMap((m) => ({ ...m, [postId]: true }));

    const prevPosts = posts;
    setPosts((ps) => ps.filter((p) => p.id !== postId));

    try {
      await deletePost(postId);
    } catch {
      setPosts(prevPosts);
      alert("게시글 삭제에 실패했습니다. 서버/권한을 확인하세요.");
    } finally {
      setPostDeleteBusyMap((m) => ({ ...m, [postId]: false }));
    }
  };

  const getCommentAuthor = (c: CommentItem) =>
    (c.username ?? (c as any).authorUsername ?? "") as string;

  // ✅ 댓글 생성일 가져오기
  const getCommentCreatedAt = (c: CommentItem) =>
    ((c as any).createdAt ?? (c as any).created_at ?? "") as string;

  const isMyComment = (c: CommentItem) => {
    const author = getCommentAuthor(c);
    if (!author || !myUsername) return false;
    return author === myUsername;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "#fff",
          borderBottom: "1px solid #eee",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 10,
        }}
      >
        <div
          onClick={goHome}
          style={{
            fontWeight: 900,
            letterSpacing: "0.08em",
            cursor: "pointer", // ✅ 마우스 손가락
            userSelect: "none", // ✅ 드래그 방지 (선택)
          }}
        >
          B.L.O.G
        </div>

        <button
          onClick={onWrite}
          style={{
            border: "1px solid #111",
            background: "#111",
            color: "#fff",
            borderRadius: 10,
            padding: "10px 14px",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Write
        </button>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: 18 }}>
        {loading && <p>Loading...</p>}
        {err && <p style={{ color: "#d00" }}>{err}</p>}

        {!loading && !err && posts.length === 0 && (
          <p>아직 게시글이 없어요. 첫 글을 작성해보세요!</p>
        )}

        <div style={{ display: "grid", gap: 12 }}>
          {posts.map((p) => {
            const liked = !!likedMap[p.id];
            const likeCount = likeCountMap[p.id] ?? 0;
            const busy = !!likeBusyMap[p.id];

            const commentsOpen = !!commentOpenMap[p.id];
            const commentLoading = !!commentLoadingMap[p.id];
            const commentErr = commentErrMap[p.id];
            const comments = commentsMap[p.id] ?? [];

            const input = commentInputMap[p.id] ?? "";
            const creating = !!commentCreateBusyMap[p.id];

            const minePost = isMyPost(p);
            const deletingPost = !!postDeleteBusyMap[p.id];

            const author = getPostAuthor(p);
            const createdAt = getPostCreatedAt(p);

            return (
              <div
                key={p.id}
                style={{
                  background: "#fff",
                  border: "1px solid #eee",
                  borderRadius: 16,
                  padding: 16,
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 900 }}>{p.title}</div>

                {/* ✅ 작성자 + 날짜 */}
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    color: "#777",
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{author || "user"}</span>
                  <span style={{ opacity: 0.7 }}>·</span>
                  <span>{formatDate(createdAt)}</span>
                </div>

                <div style={{ marginTop: 8, color: "#333", lineHeight: 1.5 }}>
                  {p.content}
                </div>

                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    color: "#666",
                    fontSize: 14,
                  }}
                >
                  <button
                    onClick={() => toggleLike(p.id)}
                    disabled={busy}
                    style={{
                      border: "1px solid #eee",
                      background: "#fff",
                      borderRadius: 999,
                      padding: "8px 12px",
                      cursor: busy ? "not-allowed" : "pointer",
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      opacity: busy ? 0.6 : 1,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{liked ? "♥" : "♡"}</span>
                    <span style={{ color: "#111", fontWeight: 800 }}>
                      {likeCount}
                    </span>
                  </button>

                  <button
                    onClick={() => toggleComments(p.id)}
                    style={{
                      border: "1px solid #eee",
                      background: "#fff",
                      borderRadius: 999,
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                  >
                    💬 Comment
                  </button>

                  <button
                    onClick={() => removePost(p.id, minePost)}
                    disabled={!minePost || deletingPost}
                    title={!minePost ? "내 게시글만 삭제할 수 있어요" : "삭제"}
                    style={{
                      border: "1px solid #eee",
                      background: "#fff",
                      borderRadius: 999,
                      padding: "8px 12px",
                      cursor:
                        !minePost || deletingPost ? "not-allowed" : "pointer",
                      opacity: !minePost || deletingPost ? 0.35 : 1,
                    }}
                  >
                    🗑 Delete
                  </button>
                </div>

                {commentsOpen && (
                  <div
                    style={{
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: "1px solid #f0f0f0",
                      display: "grid",
                      gap: 10,
                    }}
                  >
                    {commentLoading && <div>댓글 불러오는 중...</div>}
                    {commentErr && (
                      <div style={{ color: "#d00" }}>{commentErr}</div>
                    )}

                    {!commentLoading &&
                      !commentErr &&
                      comments.map((c) => {
                        const mine = isMyComment(c);
                        const deleting = !!commentDeleteBusyMap[c.id];

                        const cAuthor = getCommentAuthor(c);
                        const cCreatedAt = getCommentCreatedAt(c);

                        return (
                          <div
                            key={c.id}
                            style={{
                              background: "#fafafa",
                              border: "1px solid #eee",
                              borderRadius: 12,
                              padding: "10px 12px",
                              display: "flex",
                              gap: 10,
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              {/* ✅ 댓글 작성자 + 날짜 */}
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "#666",
                                  display: "flex",
                                  gap: 6,
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                }}
                              >
                                <span style={{ fontWeight: 700 }}>
                                  {cAuthor || "user"}
                                </span>
                                <span style={{ opacity: 0.7 }}>·</span>
                                <span>{formatDate(cCreatedAt)}</span>
                              </div>

                              <div style={{ marginTop: 4, color: "#111" }}>
                                {c.content}
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                if (!mine) return;
                                removeComment(p.id, c.id);
                              }}
                              disabled={!mine || deleting}
                              title={
                                !mine ? "내 댓글만 삭제할 수 있어요" : "삭제"
                              }
                              style={{
                                border: "1px solid #eee",
                                background: "#fff",
                                borderRadius: 10,
                                padding: "6px 10px",
                                cursor:
                                  !mine || deleting ? "not-allowed" : "pointer",
                                opacity: !mine || deleting ? 0.35 : 1,
                                fontSize: 12,
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        );
                      })}

                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <input
                        value={input}
                        onChange={(e) =>
                          setCommentInputMap((m) => ({
                            ...m,
                            [p.id]: e.target.value,
                          }))
                        }
                        placeholder="Write a comment..."
                        style={{
                          flex: 1,
                          border: "1px solid #ddd",
                          borderRadius: 10,
                          padding: "10px 12px",
                          outline: "none",
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submitComment(p.id);
                        }}
                        disabled={creating}
                      />
                      <button
                        onClick={() => submitComment(p.id)}
                        disabled={creating || !input.trim()}
                        style={{
                          border: "1px solid #111",
                          background: "#111",
                          color: "#fff",
                          borderRadius: 10,
                          padding: "10px 12px",
                          fontWeight: 800,
                          cursor: creating ? "not-allowed" : "pointer",
                          opacity: creating || !input.trim() ? 0.6 : 1,
                        }}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
