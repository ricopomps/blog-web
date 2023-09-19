import { User } from "@/models/user";
import api from "@/network/axiosInstance";

const baseUrl = "/users";

interface SignUpValues {
  username: string;
  email: string;
  password: string;
}

export async function signUp(credentials: SignUpValues) {
  const response = await api.post<User>(`${baseUrl}/signup`, credentials);
  return response.data;
}

interface LoginValues {
  username: string;
  password: string;
}

export async function login(credentials: LoginValues) {
  const response = await api.post<User>(`${baseUrl}/login`, credentials);
  return response.data;
}
