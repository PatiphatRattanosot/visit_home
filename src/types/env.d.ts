export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      DB_URL: string;
      FRONTEND_URL: string;
    }
  }
}
