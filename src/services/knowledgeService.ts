import type { FaqRepository } from "../repositories/faqRepository.js";

export class KnowledgeService {
  constructor(private readonly faqRepository: FaqRepository) {}

  async getPromptContext() {
    const faqs = await this.faqRepository.listAll();

    if (faqs.length === 0) {
      return "No store FAQ entries are currently configured.";
    }

    return faqs
      .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`)
      .join("\n\n");
  }
}
