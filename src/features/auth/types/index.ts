import type { Response } from "../../../shared/types/api";

// Client Model Types
export interface ClientModel {
  id: string;
  secret: string;
  deviceId?: string;
  deviceType?: string;
  email?: string;
  password?: string;
  branchId?: number;
  providerKey?: string;
  providerName?: string;
}

// Login Request Types (Swagger'dan)
export interface ClientLoginModel {
  clientId: string;
  clientSecret: string;
  deviceType: string;
  deviceId: string;
  refreshToken: string;
  email: string; // Buraya username gönderiyoruz
  password: string;
  branchId: string; // Swagger'da string
}

// Swagger'daki gerçek request formatı
export interface LoginRequest {
  branchId: string;
  languageId: number;
  data: ClientLoginModel;
}

// Refresh Token Types
export interface ClientRefreshTokenModel {
  token: string;
}

// Login Response Types
export interface LoginUserInfo {
  token: string;
  userName: string;
  userID: string;
  branchNo: number;
  branchName: string;
  isRememberMe: boolean;
}

export type LoginResponse = Response<LoginUserInfo>;

// Sign In Model (internal)
export interface SignInModel {
  userName: string;
  password: string;
  branchNo: number;
  isRememberMe?: boolean;
}

// Auth State Types
export interface AuthState {
  isAuthenticated: boolean;
  user: LoginUserInfo | null;
  loading: boolean;
  error: string | null;
}
