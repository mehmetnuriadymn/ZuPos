export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5185",
    timeout: 30000,
  },
  auth: {
    tokenKey: "zupos_auth_token",
    userInfoKey: "zupos_user_info",
    clientId: import.meta.env.VITE_CLIENT_ID || "WebApp",
    clientSecret: import.meta.env.VITE_CLIENT_SECRET || "SecretYaz1",
    deviceType: import.meta.env.VITE_DEVICE_TYPE || "web",
    defaultBranchId: Number(import.meta.env.VITE_DEFAULT_BRANCH_ID),
  },
  app: {
    name: "ZuPOS",
    version: "1.0.0",
  },
} as const;
