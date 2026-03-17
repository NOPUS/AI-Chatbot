# AI Chatbot

A clean, real-time chat interface built with Next.js that connects to the OpenAI API with streaming responses.

## Features

- ✨ Real-time streaming responses (text appears word by word)
- 💬 Chat history within a session with scrollable message thread
- 🎭 System prompt selector with different AI personalities
- 📱 Mobile-responsive design with Tailwind CSS
- 🔒 API key safely hidden in Next.js API route

## Tech Stack

- **Next.js 14** - React framework with App Router
- **OpenAI API** - GPT-3.5-turbo for chat completions
- **Vercel AI SDK** - Streaming and chat utilities
- **Tailwind CSS** - Styling and responsive design
- **TypeScript** - Type safety

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Select an AI personality from the dropdown in the header
2. Type your message in the input field
3. Press Enter or click Send to start a conversation
4. Watch responses stream in real-time word by word
5. Scroll through your chat history

## AI Personalities

- **Default Assistant** - Helpful, friendly, and knowledgeable
- **Creative Writer** - Imaginative and expressive
- **Technical Expert** - Precise and detailed technical explanations
- **Friendly Companion** - Warm and empathetic
- **Business Professional** - Clear and professional communication

## Project Structure

```
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # OpenAI API route with streaming
│   ├── globals.css           # Global styles with Tailwind
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page component
├── components/
│   └── ChatInterface.tsx     # Chat UI component
└── package.json
```

## Deployment

This project is ready to deploy on Vercel:

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add your `OPENAI_API_KEY` as an environment variable
4. Deploy!

## License

MIT
