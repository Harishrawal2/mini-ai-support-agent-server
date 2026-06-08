# Mini AI Support Agent Server

Express + Prisma backend for the Mini AI Support Agent. It stores chat sessions in PostgreSQL, loads FAQ context, and generates support replies with the OpenAI API.

## Tech Stack

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- OpenAI API
- Zod

## Getting Started

Install dependencies:

```bash
npm install
```

Create an environment file:

```bash
cp .env.example .env
```

Set the required values:

```env
DATABASE_URL="postgresql://postgres:admin@localhost:5432/mini_ai_support_agent?schema=public"
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-4o-mini"
PORT=4000
CLIENT_ORIGIN="http://localhost:5173"
MAX_MESSAGE_LENGTH=2000
MAX_CHAT_HISTORY_MESSAGES=12
```

Generate Prisma client and prepare the database:

```bash
npm run prisma:generate
npm run db:deploy
npm run db:seed
```

Start the development server:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:4000
```

Health check:

```http
GET /health
```

## Scripts

- `npm run dev`: Start the API with `tsx watch`.
- `npm run build`: Compile TypeScript to `dist`.
- `npm start`: Run the compiled server.
- `npm run prisma:generate`: Generate the Prisma client.
- `npm run db:migrate`: Run local Prisma migrations.
- `npm run db:deploy`: Apply migrations in deploy-style environments.
- `npm run db:seed`: Seed FAQ data.

## API

Send a message:

```http
POST /chat/message
Content-Type: application/json
```

```json
{
  "message": "What is your return policy?",
  "sessionId": "optional-existing-session-id"
}
```

Fetch chat history:

```http
GET /chat/:sessionId/messages
```

## Project Structure

```text
src/
  config/       Environment parsing
  controllers/  Request and response handling
  db/           Prisma client setup
  middleware/   Express middleware
  repositories/ Database access
  routes/       API routes
  services/     Chat, FAQ, and OpenAI logic
  validation/   Zod schemas
```

## Deployment

This server can be deployed to Render, Koyeb, Railway, Fly.io, or any Node.js host.

For production, set:

```env
DATABASE_URL="your-production-postgres-url"
OPENAI_API_KEY="your-openai-api-key"
CLIENT_ORIGIN="https://your-client-domain.com"
```

Run this during deployment:

```bash
npm install && npm run prisma:generate && npm run build && npm run db:deploy && npm run db:seed
npm start
```

Do not commit `.env` or API keys. Commit `.env.example` only.
