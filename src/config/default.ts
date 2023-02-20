import { config } from "dotenv";

config();

export const {
  PORT = 8080,
  DB_URI = "",
  JWT_ACCESS_SECRET = "",
  JWT_REFRESH_SECRET = "",
  SMTP_HOST = "",
  SMTP_PORT = 2525,
  EMAIL_LOGIN = "",
  EMAIL_PASSWORD = "",
  API_URL = "",
  APP_URL = "",
} = process.env;
