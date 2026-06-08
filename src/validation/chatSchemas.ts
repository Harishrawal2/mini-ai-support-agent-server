import { z } from "zod";
import { env } from "../config/env.js";

export const sendMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(env.MAX_MESSAGE_LENGTH, `Message must be ${env.MAX_MESSAGE_LENGTH} characters or fewer`),
  sessionId: z.string().trim().min(1).max(128).optional()
});

export const sessionParamsSchema = z.object({
  sessionId: z.string().trim().min(1).max(128)
});
