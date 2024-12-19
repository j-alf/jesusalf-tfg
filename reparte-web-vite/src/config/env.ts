export const config = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
    clientId: Number(import.meta.env.VITE_CLIENT_ID) || 2,
    clientSecret: import.meta.env.VITE_CLIENT_SECRET || 'T8wwys68esi#JkHKqMFedy'
} as const;