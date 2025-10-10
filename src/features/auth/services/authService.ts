import { apiClient } from "../../../shared/services/api";
import type {
  LoginResponse,
  ClientRefreshTokenModel,
  LoginUserInfo,
} from "../types";
import type { Response } from "../../../shared/types/api";

export class AuthService {
  private readonly endpoints = {
    login: "/Login/CreateTokenByClient",
    refreshToken: "/Login/RefreshToken",
  } as const;

  /**
   * Kullanıcı girişi yapar (username, password, branchId ile)
   */
  async login(
    username: string,
    password: string,
    branchId: string
  ): Promise<LoginResponse> {
    // Swagger formatına uygun request
    const request = {
      branchId: branchId,
      languageId: 1, // Varsayılan dil
      data: {
        clientId: "WebApp",
        clientSecret: "SecretYaz1",
        deviceType: "web",
        deviceId: "web-device-" + Date.now(),
        refreshToken: "",
        email: username, // Username'i email field'ına gönderiyoruz
        password: password,
        branchId: branchId,
      },
    };

    try {
      console.log("Login request:", request); // Debug için

      const response = await apiClient.post<LoginUserInfo>(
        this.endpoints.login,
        request
      );

      console.log("Login response:", response); // Debug için

      // Token'ı API client'a set et
      if (response.data?.token) {
        apiClient.setAuthToken(response.data.token);
        this.saveToken(response.data.token);
        this.saveUserInfo(response.data);
      }

      return response;
    } catch (error: unknown) {
      console.error("Login error:", error);

      // API'den gelen hata mesajlarını kullan
      if (error && typeof error === "object" && "message" in error) {
        throw new Error(error.message as string);
      } else if (error && typeof error === "object" && "statusCode" in error) {
        const statusCode = error.statusCode as number;
        if (statusCode === 400) {
          throw new Error("Giriş bilgilerinizi kontrol edin.");
        } else if (statusCode === 404) {
          throw new Error("Şube bulunamadı.");
        }
      }

      throw new Error("Bağlantı hatası. Lütfen daha sonra tekrar deneyin.");
    }
  }

  /**
   * Token yenileme işlemi
   */
  async refreshToken(token: string): Promise<Response> {
    const refreshData: ClientRefreshTokenModel = {
      token,
    };

    try {
      const response = await apiClient.post<never, ClientRefreshTokenModel>(
        this.endpoints.refreshToken,
        refreshData
      );

      return response;
    } catch (error) {
      console.error("Refresh token error:", error);
      throw error;
    }
  }

  /**
   * Çıkış işlemi
   */
  logout(): void {
    apiClient.removeAuthToken();
    this.removeToken();
    this.removeUserInfo();
  }

  /**
   * Token'ı localStorage'a kaydet
   */
  private saveToken(token: string): void {
    localStorage.setItem("zupos_auth_token", token);
  }

  /**
   * Token'ı localStorage'dan al
   */
  getToken(): string | null {
    return localStorage.getItem("zupos_auth_token");
  }

  /**
   * Token'ı localStorage'dan sil
   */
  private removeToken(): void {
    localStorage.removeItem("zupos_auth_token");
  }

  /**
   * Kullanıcı bilgilerini localStorage'a kaydet
   */
  private saveUserInfo(userInfo: LoginUserInfo): void {
    localStorage.setItem("zupos_user_info", JSON.stringify(userInfo));
  }

  /**
   * Kullanıcı bilgilerini localStorage'dan al
   */
  getUserInfo(): LoginUserInfo | null {
    const userInfo = localStorage.getItem("zupos_user_info");
    return userInfo ? (JSON.parse(userInfo) as LoginUserInfo) : null;
  }

  /**
   * Kullanıcı bilgilerini localStorage'dan sil
   */
  private removeUserInfo(): void {
    localStorage.removeItem("zupos_user_info");
  }

  /**
   * Kullanıcının giriş yapıp yapmadığını kontrol et
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const userInfo = this.getUserInfo();

    if (token && userInfo) {
      // Token'ı API client'a set et
      apiClient.setAuthToken(token);
      return true;
    }

    return false;
  }

  /**
   * Token'ın geçerli olup olmadığını kontrol et (basit kontrol)
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // JWT token'ın payload kısmını decode et (basit kontrol)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const authService = new AuthService();
