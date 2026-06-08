import type { PrismaClient } from "@prisma/client";

export class ConversationRepository {
  constructor(private readonly db: PrismaClient) {}

  async create() {
    return this.db.conversation.create({ data: {} });
  }

  async findById(id: string) {
    return this.db.conversation.findUnique({ where: { id } });
  }

  async getOrCreate(id?: string) {
    if (!id) {
      return this.create();
    }

    const existing = await this.findById(id);
    return existing ?? this.create();
  }
}
