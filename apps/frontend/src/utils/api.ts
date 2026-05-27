// apps/frontend/src/utils/api.ts

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api";

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("jwt_token");
  const headers = new Headers(options.headers);

  // Otomatis menyuntikkan token otorisasi jika sesi aktif
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Mengatur tipe konten bawaan jika bukan pengiriman berkas (FormData)
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