import type { PrismaClient, SenderRole } from "@prisma/client";

export class MessageRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(conversationId: string, sender: SenderRole, text: string) {
    return this.db.message.create({
      data: {
        conversationId,
        sender,
        text
      }
    });
  }

  async listByConversation(conversationId: string) {
    return this.db.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" }
    });
  }

  async listRecent(conversationId: string, take: number) {
    const messages = await this.db.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
      take
    });

    return messages.reverse();
  }
}
