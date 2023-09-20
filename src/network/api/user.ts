import { User } from "@/models/user";
import api from "@/network/axiosInstance";
import { generateFormData } from "@/utils/utils";

const baseUrl = "/users";

export async function getAuthenticatedUser() {
  const response = await api.get<User>(`${baseUrl}/me`);
  return response.data;
}

interface SignUpValues {
  username: string;
  email: string;
  password: string;
  verificationCode: string;
}

export async function signUp(credentials: SignUpValues) {
  const response = await api.post<User>(`${baseUrl}/signup`, credentials);
  return response.data;
}

export async function requestEmailVerificationCode(email: string) {
  await api.post(`${baseUrl}/verificationcode`, { email });
}

interface LoginValues {
  username: string;
  password: string;
}

export async function login(credentials: LoginValues) {
  const response = await api.post<User>(`${baseUrl}/login`, credentials);
  return response.data;
}

export async function logout() {
  await api.post(`${baseUrl}/logout`);
}

export async function getUserByUsername(username: string) {
  const response = await api.get<User>(`${baseUrl}/profile/${username}`);
  return response.data;
}

interface UpdateUserValues {
  username?: string;
  displayName?: string;
  about?: string;
  profilePic?: File;
}

export async function updateUser(input: UpdateUserValues) {
  const formData = generateFormData(input);

  const response = await api.patch<User>(`${baseUrl}/me`, formData);
  return response.data;
}

export async function requestPasswordResetCode(email: string) {
  await api.post(`${baseUrl}/resetpasswordcode`, { email });
}

interface ResetPasswordValues {
  email: string;
  password: string;
  verificationCode: string;
}

export async function resetPassword(credentials: ResetPasswordValues) {
  const response = await api.post<User>(
    `${baseUrl}/resetpassword`,
    credentials
  );
  return response.data;
}
