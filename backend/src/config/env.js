import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/openpath',
  JWT_SECRET: process.env.JWT_SECRET || 'openpath_jwt_hackathon_secret_key_2026_xyz',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_NAME: 'openpath_token',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
};
