# Next.js Multi-AI Assistant

This is a comprehensive Next.js application demonstrating integrations with various AI providers and tools using the Vercel AI SDK.

## Features

- **Blog Generator**: Generates detailed blog posts in Markdown format using Google Gemini. Includes rate limiting and caching with Upstash Redis.
- **AI Search**: Intelligent search capabilities using Google Gemini with tool calling (search and web extraction).
- **Multi-Model Chat**: A chat interface supporting different AI models including OpenAI, Anthropic, and Groq.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/docs)
- **AI Providers**: OpenAI, Anthropic, Google Gemini (via `@ai-sdk/google`), Groq
- **Database/Caching**: [Upstash Redis](https://upstash.com/)
- **Rate Limiting**: [Upstash Ratelimit](https://upstash.com/docs/redis/sdks/ratelimit)

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nextjs-multi-ai-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

Create a `.env.local` file in the root directory and add the following environment variables:

```env
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GROQ_API_KEY=your_groq_api_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_gemini_api_key
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/api`: API routes for different AI functionalities (Anthropic, OpenAI, Groq, Search, Blog Generation).
- `src/app/components`: Reusable UI components for Chat, Blog Generation, and Search.
- `src/app/page.tsx`: Main entry point with component switching between Search, Blog, and Chat.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
