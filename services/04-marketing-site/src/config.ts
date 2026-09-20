/**
 * Centralized app configuration with smart environment & runtime detection.
 *
 * Logika deteksi otomatis:
 * 1. Jika VITE_STUDIO_URL didefinisikan secara eksplisit di env (misal .env.production), gunakan nilai tersebut.
 * 2. Jika diakses dari browser:
 *    - Jika hostname adalah 'localhost', '127.0.0.1', atau port lokal dev -> arahkan ke http://localhost:5173
 *    - Jika hostname adalah domain production (herocms.stackbyte.id atau stackbyte.id) -> arahkan ke https://studio-herocms.stackbyte.id
 * 3. Fallback:
 *    - Mode DEV (npm run dev) -> http://localhost:5173
 *    - Mode PROD (npm run build) -> https://studio-herocms.stackbyte.id
 */
export const getStudioUrl = (): string => {
  // 1. Jika di browser, deteksi runtime hostname
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    // Deteksi lingkungan development lokal
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0' || hostname.endsWith('.local')) {
      return import.meta.env.VITE_STUDIO_URL || 'http://localhost:5173';
    }

    // Deteksi lingkungan production di stackbyte.id
    if (hostname.includes('herocms.stackbyte.id') || hostname.includes('stackbyte.id')) {
      return import.meta.env.VITE_STUDIO_URL || 'https://studio-herocms.stackbyte.id';
    }
  }

  // 2. Evaluasi berdasarkan build environment Vite
  if (import.meta.env.VITE_STUDIO_URL) {
    return import.meta.env.VITE_STUDIO_URL;
  }

  return import.meta.env.DEV ? 'http://localhost:5173' : 'https://studio-herocms.stackbyte.id';
};

export const appConfig = {
  get studioUrl(): string {
    return getStudioUrl();
  }
} as const;
