import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export type LoginPayload = {
  username: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type UserResponse = {
  id: number;
  username: string;
  email: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  new_password: string;
};

export const loginApi = async (payload: LoginPayload) => {
  const res = await axios.post<TokenResponse>(`${API_URL}/auth/login`, payload);
  return res.data;
};

export const refreshApi = async (refreshToken: string) => {
  const res = await axios.post<TokenResponse>(`${API_URL}/auth/refresh`, {
    refresh_token: refreshToken,
  });
  return res.data;
};

export const logoutApi = async (refreshToken: string) => {
  const res = await axios.post(`${API_URL}/auth/logout?refresh_token=${refreshToken}`);
  return res.data;
};

export const getMeApi = async (accessToken: string) => {
  const res = await axios.get<UserResponse>(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const forgotPasswordApi = async (payload: ForgotPasswordPayload) => {
  try {
    const res = await axios.post(`${API_URL}/auth/forgot-password`, payload);
    return res.data;
  } catch (error: any) {
    // Pass through the error with status code for proper handling
    throw error;
  }
};

export const resetPasswordApi = async (payload: ResetPasswordPayload) => {
  try {
    const res = await axios.post(`${API_URL}/auth/reset-password`, payload);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const verifyResetTokenApi = async (token: string) => {
  const res = await axios.get(`${API_URL}/auth/verify-reset-token/${token}`);
  return res.data;
};