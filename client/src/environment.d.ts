// environment.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_URL: string;
      FEATURE_FLAG: string;
      // Add your other .env variables here
    }
  }
}

// Ensure this file is treated as a module
export {};
