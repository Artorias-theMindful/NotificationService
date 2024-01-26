import dotenv from 'dotenv';
dotenv.config();
export const CONFIG = {
    DATABASE_URL: process.env.URL,
    PORT: process.env.PORT
  }