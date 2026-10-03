import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend/.env explicitly, with fallback to current working directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/openpath',
  JWT_SECRET: process.env.JWT_SECRET || 'openpath_jwt_hackathon_secret_key_2026_xyz',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_NAME: 'openpath_token',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  // SMTP / Email Configuration for real OTP delivery
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'OpenPath <noreply@openpath.dev>',

  // Local AI Agent Configuration
  LOCAL_AI_BASE_URL: process.env.LOCAL_AI_BASE_URL || 'http://localhost:11434',
  LOCAL_AI_MODEL: process.env.LOCAL_AI_MODEL || 'llama3.2',
  LOCAL_AI_TIMEOUT: process.env.LOCAL_AI_TIMEOUT ? parseInt(process.env.LOCAL_AI_TIMEOUT, 10) : 30000,
};