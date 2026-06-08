import type { Request, Response } from "express";
import type { Message } from "@prisma/client";
import type { ChatService } from "../services/chatService.js";
import { sendMessageSchema, sessionParamsSchema } from "../validation/chatSchemas.js";

const serializeMessage = (message: Message) => ({
  id: message.id,
  sender: message.sender === "USER" ? "user" : "ai",
  text: message.text,
  createdAt: message.createdAt.toISOString()
});

export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  sendMessage = async (req: Request, res: Response) => {
    const body = sendMessageSchema.parse(req.body);
    const result = await this.chatService.sendMessage(body);

    res.status(200).json(result);
  };

  getMessages = async (req: Request, res: Response) => {
    const params = sessionParamsSchema.parse(req.params);
    const messages = await this.chatService.getMessages(params.sessionId);

    res.status(200).json({
      sessionId: params.sessionId,
      messages: messages.map(serializeMessage)
    });
  };
}
