import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  OPENAI_API_KEY: z.string().optional().default(""),
  OPENAI_MODEL: z.string().optional().default("gpt-4o-mini"),
  PORT: z.coerce.number().int().positive().optional().default(4000),
  CLIENT_ORIGIN: z.string().optional().default("http://localhost:5174"),
  MAX_MESSAGE_LENGTH: z.coerce.number().int().positive().optional().default(2000),
  MAX_CHAT_HISTORY_MESSAGES: z.coerce.number().int().positive().optional().default(12)
});

export const env = envSchema.parse(process.env);
