import OpenAI from "openai";
import { env } from "../config/env.js";
import type { ReplyGenerator } from "./replyGenerator.js";
import { toOpenAiRole } from "./replyGenerator.js";

const FALLBACK_REPLY =
  "I am sorry, I am having trouble reaching the AI support system right now. Please try again in a moment or contact support during business hours.";

export class OpenAiReplyGenerator implements ReplyGenerator {
  private readonly client: OpenAI | null;

  constructor() {
    this.client = env.OPENAI_API_KEY
      ? new OpenAI({ apiKey: env.OPENAI_API_KEY, timeout: 15_000 })
      : null;
  }

  async generateReply(input: Parameters<ReplyGenerator["generateReply"]>[0]) {
    if (!this.client) {
      return FALLBACK_REPLY;
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: env.OPENAI_MODEL,
        temperature: 0.3,
        max_tokens: 350,
        messages: [
          {
            role: "system",
            content: [
              "You are a helpful support agent for SpurCart, a small e-commerce store.",
              "Answer clearly and concisely in 1-4 sentences.",
              "Use the store knowledge below when relevant.",
              "If the answer is not in the knowledge base, say what you can infer and suggest contacting support.",
              "Never invent order-specific details, tracking numbers, discount codes, or policies.",
              "",
              "Store knowledge:",
              input.knowledgeBase
            ].join("\n")
          },
          ...input.history.map((message) => ({
            role: toOpenAiRole(message.sender),
            content: message.text
          }))
        ]
      });

      const reply = completion.choices[0]?.message?.content?.trim();
      return reply || FALLBACK_REPLY;
    } catch (error) {
      console.error("OpenAI reply generation failed", error);
      return FALLBACK_REPLY;
    }
  }
}
