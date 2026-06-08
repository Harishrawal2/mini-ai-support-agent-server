import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/appError.js";

type HttpParserError = Error & {
  status?: number;
  type?: string;
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: "Invalid request",
      details: error.flatten()
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
      details: error.details
    });
    return;
  }

  const parserError = error as HttpParserError;
  if (parserError.type === "entity.parse.failed") {
    res.status(parserError.status ?? 400).json({
      error: "Request body must be valid JSON."
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    error: "Something went wrong. Please try again."
  });
};
