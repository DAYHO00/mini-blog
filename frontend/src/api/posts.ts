// src/api/posts.ts
import { api } from "./client";

export type PostItem = {
  id: number;
  title: string;
  content: string;
  // 백엔드 응답에 따라 author 관련 필드가 추가될 수 있음
  authorUsername?: string;
  username?: string;
};

export type CreatePostRequest = {
  title: string;
  content: string;
};

export async function getPosts(): Promise<PostItem[]> {
  const res = await api.get<PostItem[]>("/api/v1/posts");
  return res.data;
}

export async function createPost(body: CreatePostRequest): Promise<PostItem> {
  const res = await api.post<PostItem>("/api/v1/posts", body);
  return res.data;
}

export async function deletePost(postId: number): Promise<void> {
  await api.delete(`/api/v1/posts/${postId}`);
}
