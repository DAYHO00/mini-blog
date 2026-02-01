import { api } from "./client";

export type CommentItem = {
  id: number;
  content: string;
  username?: string;
  authorUsername?: string;
  createdAt?: string;
};

export async function getComments(postId: number): Promise<CommentItem[]> {
  const res = await api.get(`/api/v1/posts/${postId}/comments`);
  return res.data;
}

export async function createComment(
  postId: number,
  content: string,
): Promise<CommentItem> {
  const res = await api.post(`/api/v1/posts/${postId}/comments`, { content });
  return res.data;
}

// ✅ 댓글 삭제 (가장 흔한 형태)
export async function deleteComment(commentId: number): Promise<void> {
  await api.delete(`/api/v1/comments/${commentId}`);
}
