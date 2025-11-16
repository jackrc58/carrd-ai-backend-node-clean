# Carrd AI Backend (Node.js)

This is a simple Node.js/Express backend for your **Carrd** site so visitors can
talk to your AI assistant.

## 1. Requirements

- Node.js 18+ (includes `fetch` built in)
- npm
- An OpenAI API key

## 2. Setup

```bash
# Go into the folder
cd carrd-ai-backend-node

# Install dependencies
npm install

# Copy .env.example to .env and put your real key in
cp .env.example .env
# Then edit .env and set OPENAI_API_KEY
```

## 3. Run the server

```bash
npm start
```

You should see:

```text
✅ Server listening on http://localhost:3000
```

Open a browser and go to:

- http://localhost:3000 → should say "Carrd AI backend is running ✅"

## 4. Endpoint

The AI endpoint is:

- `POST /api/ai`

It accepts either JSON or `application/x-www-form-urlencoded`.

Fields:

- `name` (optional)
- `email` (optional)
- `message` (or `prompt`) – **required**

Example JSON body:

```json
{
  "name": "Robert",
  "email": "you@example.com",
  "message": "Explain quantum computing like I'm 10."
}
```

Example response:

```json
{
  "ok": true,
  "name": "Robert",
  "email": "you@example.com",
  "message": "Explain quantum computing like I'm 10.",
  "aiReply": "Quantum computers use tiny particles..."
}
```

## 5. Connecting from Carrd (High-Level)

In Carrd, you can:

1. Add an **Embed → Code** block with an HTML form and JavaScript that calls  
   `https://YOUR-SERVER-URL/api/ai` and then displays the `aiReply` on the page.

2. Or use Carrd's **Form** block with "Action: Custom" and set the Action URL  
   to your hosted backend. (This is better for simple submissions, but for
   live chat-style responses, the embed method is best.)

You will set the **public URL** to your server, for example:

- If you use a tunnel from your PC: `https://abc123.ngrok.io/api/ai`
- If you deploy online: `https://api.fractionalgeek.com/api/ai`

## 6. Notes

- Keep your `.env` file private.
- Never expose your OpenAI API key in Carrd or front-end code.
