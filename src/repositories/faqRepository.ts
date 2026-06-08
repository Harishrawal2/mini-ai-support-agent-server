import type { PrismaClient } from "@prisma/client";

export class FaqRepository {
  constructor(private readonly db: PrismaClient) {}

  async listAll() {
    return this.db.faq.findMany({
      orderBy: { question: "asc" }
    });
  }
}
