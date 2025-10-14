import type { Response, ApiError } from "../../types/api";
import { config } from "../../../config";

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = config.api.baseUrl) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private async handleResponse<T>(
    response: globalThis.Response
  ): Promise<Response<T>> {
    let responseData: Response<T>;

    try {
      const text = await response.text();

      if (!text) {
        throw new Error("Boş response alındı");
      }

      responseData = JSON.parse(text) as Response<T>;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      const errorData: ApiError = {
        message: `API response parse edilemedi: ${
          parseError instanceof Error ? parseError.message : "Bilinmeyen hata"
        }`,
        statusCode: response.status,
      };
      throw errorData;
    }

    if (!response.ok) {
      const errorData: ApiError = {
        message:
          responseData.message || response.statusText || "An error occurred",
        statusCode: response.status,
      };

      errorData.details = JSON.stringify(responseData);
      throw errorData;
    }

    // API'den dönen response'da statusCode kontrolü
    if (responseData.statusCode && responseData.statusCode !== 200) {
      const errorData: ApiError = {
        message: responseData.message || "API Error",
        statusCode: responseData.statusCode,
      };

      errorData.details = JSON.stringify(responseData);
      throw errorData;
    }

    return responseData;
  }

  async get<T>(
    endpoint: string,
    headers: Record<string, string> = {}
  ): Promise<Response<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: { ...this.defaultHeaders, ...headers },
    });

    return this.handleResponse<T>(response);
  }

  async post<T, K = unknown>(
    endpoint: string,
    data?: K,
    headers: Record<string, string> = {}
  ): Promise<Response<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { ...this.defaultHeaders, ...headers },
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T, K = unknown>(
    endpoint: string,
    data?: K,
    headers: Record<string, string> = {}
  ): Promise<Response<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: { ...this.defaultHeaders, ...headers },
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(
    endpoint: string,
    headers: Record<string, string> = {}
  ): Promise<Response<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: { ...this.defaultHeaders, ...headers },
    });

    return this.handleResponse<T>(response);
  }

  setAuthToken(token: string): void {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.defaultHeaders.Authorization;
  }
}

// Singleton instance
export const apiClient = new ApiClient();
