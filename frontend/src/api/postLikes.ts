import { api } from "./client";

export type LikeResponse = {
  postId: number;
  likeCount: number;
  liked: boolean;
};

export async function likePost(postId: number): Promise<LikeResponse> {
  const res = await api.post(`/api/v1/posts/${postId}/likes`);
  return res.data;
}

export async function unlikePost(postId: number): Promise<LikeResponse> {
  const res = await api.delete(`/api/v1/posts/${postId}/likes`);
  return res.data;
}

export async function getLikeCount(postId: number): Promise<number> {
  const res = await api.get(`/api/v1/posts/${postId}/likes/count`);
  // { postId, likeCount }
  return res.data.likeCount;
}

export async function getMyLike(postId: number): Promise<boolean> {
  const res = await api.get(`/api/v1/posts/${postId}/likes/me`);
  // { postId, liked }
  return res.data.liked;
}
