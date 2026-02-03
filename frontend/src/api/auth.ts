import { api } from "./client";

export type LoginReq = { username: string; password: string };
export type SignupReq = { username: string; email: string; password: string };

export async function login(req: LoginReq): Promise<string> {
  const { data } = await api.post<string>("/v1/auth/login", req);
  return data;
}

export async function signup(req: SignupReq): Promise<void> {
  await api.post("/v1/auth/signup", req);
  console.log("Signup successful");
}
