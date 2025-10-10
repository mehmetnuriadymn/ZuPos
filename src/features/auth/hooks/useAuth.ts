// React hook'ları - state yönetimi ve performance optimizasyonu için
import { useState, useCallback } from "react";

// Authentication servis katmanı - API çağrıları yapar
import { authService } from "../services";

// TypeScript type definitions - authentication state'i için
import type { AuthState } from "../types";

export const useAuth = () => {
  // Authentication state'ini initialize et
  // İlk yüklemede localStorage'dan mevcut authentication durumunu kontrol et
  const [authState, setAuthState] = useState<AuthState>(() => ({
    isAuthenticated: authService.isAuthenticated(), // localStorage'da token var mı kontrol et
    user: authService.getUserInfo(), // localStorage'dan kullanıcı bilgilerini al
    loading: false, // İlk durumda loading yok
    error: null, // İlk durumda hata yok
  }));

  const login = useCallback(
    async (username: string, password: string, branchId: string) => {
      // 1. Loading durumunu aktif et, önceki hataları temizle
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // 2. AuthService üzerinden API'ye giriş isteği gönder
        // Bu adımda: React → AuthService → ApiClient → C# API → Database
        const response = await authService.login(username, password, branchId);

        // 3. API'den dönen response'u kontrol et
        // Başarılı giriş için: statusCode=200 VE token dolu olmalı
        if (
          response.data &&
          response.data.token &&
          response.data.token.trim() !== ""
        ) {
          // 4. Başarılı giriş: Authentication state'ini güncelle
          setAuthState({
            isAuthenticated: true, // Kullanıcı artık giriş yapmış
            user: response.data, // Kullanıcı bilgilerini sakla (userName, branchName, userID vs.)
            loading: false, // Loading durumunu kapat
            error: null, // Hata durumunu temizle
          });

          // 5. Başarılı response'u return et (component'e dönecek)
          return response;
        } else {
          // 6. Token yoksa veya boşsa: Giriş başarısız
          const errorMessage =
            response.data?.token === ""
              ? "Token oluşturulamadı - kullanıcı bilgilerinizi kontrol edin"
              : response.message || "Giriş işlemi başarısız";

          // 7. Error state'ini güncelle
          setAuthState((prev) => ({
            ...prev,
            loading: false, // Loading'i kapat
            error: errorMessage, // Hata mesajını set et
          }));

          // 8. Error throw et (component'te catch edilecek)
          throw new Error(errorMessage);
        }
      } catch (error) {
        // 9. Beklenmeyen hata durumu (network error, API down vs.)
        const errorMessage =
          error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu";

        // 10. Error state'ini güncelle
        setAuthState((prev) => ({
          ...prev,
          loading: false, // Loading'i kapat
          error: errorMessage, // Hata mesajını set et
        }));

        // 11. Error'u tekrar throw et (component'te catch edilecek)
        throw error;
      }
    },
    [] // Dependency array boş - bu fonksiyon hiç değişmeyecek
  );

  const logout = useCallback(() => {
    // 1. AuthService'den çıkış işlemini gerçekleştir
    // Bu adımda: Token localStorage'dan silinir, API client'dan authorization header kaldırılır
    authService.logout();

    // 2. Authentication state'ini sıfırla
    setAuthState({
      isAuthenticated: false, // Kullanıcı artık giriş yapmamış
      user: null, // Kullanıcı bilgilerini temizle
      loading: false, // Loading durumu kapalı
      error: null, // Hata durumu temiz
    });
  }, []); // Dependency array boş - bu fonksiyon hiç değişmeyecek

  const refreshToken = useCallback(async (token: string) => {
    // 1. Loading durumunu aktif et, önceki hataları temizle
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // 2. AuthService üzerinden token yenileme isteği gönder
      // Bu adımda: Mevcut token'ı API'ye gönder, yeni token al
      await authService.refreshToken(token);

      // 3. Token yenileme başarılı - loading'i kapat
      setAuthState((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      // 4. Token yenileme başarısız - hata durumunu yönet
      const errorMessage =
        error instanceof Error ? error.message : "Token yenileme başarısız";

      // 5. Error state'ini güncelle
      setAuthState((prev) => ({
        ...prev,
        loading: false, // Loading'i kapat
        error: errorMessage, // Hata mesajını set et
      }));

      // 6. Error'u throw et (genellikle kullanıcıyı login sayfasına yönlendirir)
      throw error;
    }
  }, []); // Dependency array boş - bu fonksiyon hiç değişmeyecek

  const clearError = useCallback(() => {
    // Hata mesajını temizle (kullanıcı hata mesajını kapatmak istediğinde)
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []); // Dependency array boş - bu fonksiyon hiç değişmeyecek

  // Hook'un döndürdüğü değerler
  return {
    // Authentication state değerleri
    ...authState, // isAuthenticated, user, loading, error

    // Authentication işlem fonksiyonları
    login, // Kullanıcı girişi yapar
    logout, // Kullanıcı çıkışı yapar
    refreshToken, // Token'ı yeniler
    clearError, // Hata mesajını temizler
  };
};
