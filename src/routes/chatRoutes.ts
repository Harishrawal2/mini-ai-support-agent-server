import { Router } from "express";
import { ChatController } from "../controllers/chatController.js";
import { prisma } from "../db/prisma.js";
import { ConversationRepository } from "../repositories/conversationRepository.js";
import { FaqRepository } from "../repositories/faqRepository.js";
import { MessageRepository } from "../repositories/messageRepository.js";
import { ChatService } from "../services/chatService.js";
import { KnowledgeService } from "../services/knowledgeService.js";
import { OpenAiReplyGenerator } from "../services/openAiReplyGenerator.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const conversationRepository = new ConversationRepository(prisma);
const messageRepository = new MessageRepository(prisma);
const faqRepository = new FaqRepository(prisma);
const knowledgeService = new KnowledgeService(faqRepository);
const replyGenerator = new OpenAiReplyGenerator();
const chatService = new ChatService(
  conversationRepository,
  messageRepository,
  knowledgeService,
  replyGenerator
);
const chatController = new ChatController(chatService);

export const chatRoutes = Router();

chatRoutes.post("/message", asyncHandler(chatController.sendMessage));
chatRoutes.get("/:sessionId/messages", asyncHandler(chatController.getMessages));
