// apps/frontend/src/utils/api.ts

export const API_BASE_URL = import.meta.env.VITE_API_URL + "/api";

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  // Ambil token dari Zustand persist storage
  const authStorage = localStorage.getItem("auth-storage");
  const token = authStorage ? JSON.parse(authStorage)?.state?.token : null;
  
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || "Terjadi kesalahan pada komunikasi server.");
  }
  
  return data;
};