import { SenderRole } from "@prisma/client";
import { env } from "../config/env.js";
import type { ConversationRepository } from "../repositories/conversationRepository.js";
import type { MessageRepository } from "../repositories/messageRepository.js";
import type { KnowledgeService } from "./knowledgeService.js";
import type { ReplyGenerator } from "./replyGenerator.js";

export class ChatService {
  constructor(
    private readonly conversations: ConversationRepository,
    private readonly messages: MessageRepository,
    private readonly knowledge: KnowledgeService,
    private readonly replyGenerator: ReplyGenerator
  ) {}

  async sendMessage(input: { message: string; sessionId?: string }) {
    const conversation = await this.conversations.getOrCreate(input.sessionId);
    const text = input.message.trim();

    await this.messages.create(conversation.id, SenderRole.USER, text);

    const [history, knowledgeBase] = await Promise.all([
      this.messages.listRecent(conversation.id, env.MAX_CHAT_HISTORY_MESSAGES),
      this.knowledge.getPromptContext()
    ]);

    const reply = await this.replyGenerator.generateReply({
      history,
      knowledgeBase
    });

    await this.messages.create(conversation.id, SenderRole.AI, reply);

    return {
      sessionId: conversation.id,
      reply
    };
  }

  async getMessages(sessionId: string) {
    const conversation = await this.conversations.findById(sessionId);
    if (!conversation) {
      return [];
    }

    return this.messages.listByConversation(sessionId);
  }
}
