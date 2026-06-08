import type { Message, SenderRole } from "@prisma/client";

export type ChatHistoryMessage = Pick<Message, "sender" | "text">;
export type ProviderChatRole = "user" | "assistant";

export interface ReplyGenerator {
  generateReply(input: {
    history: ChatHistoryMessage[];
    knowledgeBase: string;
  }): Promise<string>;
}

export const toOpenAiRole = (sender: SenderRole): ProviderChatRole => {
  return sender === "USER" ? "user" : "assistant";
};
