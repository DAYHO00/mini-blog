import { api } from "./client";

export type PostItem = {
  id: number;
  title: string;
  content: string;
  authorUsername?: string;
  username?: string;
};

export type CreatePostRequest = {
  title: string;
  content: string;
};

export async function getPosts(): Promise<PostItem[]> {
  const res = await api.get<PostItem[]>("/v1/posts");
  return res.data;
}

export async function createPost(body: CreatePostRequest): Promise<PostItem> {
  const res = await api.post<PostItem>("/v1/posts", body);
  return res.data;
}

export async function deletePost(postId: number): Promise<void> {
  await api.delete(`/v1/posts/${postId}`);
}
