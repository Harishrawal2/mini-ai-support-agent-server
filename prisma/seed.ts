import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const faqs = [
  {
    question: "What is your shipping policy?",
    answer:
      "We ship across India in 3-5 business days. Express shipping is available in metro cities for eligible orders. International shipping is currently available to the USA and UAE with delivery in 8-12 business days."
  },
  {
    question: "What is your return policy?",
    answer:
      "Unused products can be returned within 30 days of delivery. Items must be in original packaging. Refunds are processed to the original payment method within 5-7 business days after inspection."
  },
  {
    question: "Do you ship to the USA?",
    answer:
      "Yes, we ship to the USA. Standard USA delivery usually takes 8-12 business days, and customs duties or import taxes may be collected by the carrier if applicable."
  },
  {
    question: "What are support hours?",
    answer:
      "Support is available Monday to Saturday, 9:00 AM to 7:00 PM IST. Outside those hours, customers can leave a message and the team will respond on the next business day."
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "Orders can be changed or cancelled within 2 hours of purchase if they have not been packed yet. Customers should share their order ID with support as soon as possible."
  }
];

async function main() {
  for (const faq of faqs) {
    await prisma.faq.upsert({
      where: { question: faq.question },
      update: { answer: faq.answer },
      create: faq
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log(`Seeded ${faqs.length} FAQ entries.`);
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
