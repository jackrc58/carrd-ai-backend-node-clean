// server.js
// Simple Node.js backend for Carrd → AI chat

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Allow Carrd (and others) to call this API
app.use(cors());

// Parse application/x-www-form-urlencoded (Carrd forms) and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- Helper: call OpenAI HTTP API via fetch ---
async function callOpenAI(userMessage) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set in .env");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for the Fractional Geek website. Answer clearly and concisely.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("OpenAI API error:", text);
    throw new Error("Error from OpenAI API");
  }

  const data = await response.json();
  const aiMessage =
    data.choices?.[0]?.message?.content ||
    "Sorry, I couldn't generate a response right now.";

  return aiMessage;
}

// --- Routes ---

// Health check
app.get("/", (req, res) => {
  res.send("Carrd AI backend is running ✅");
});

// Main AI endpoint
app.post("/api/ai", async (req, res) => {
  try {
    const name = req.body.name || "Friend";
    const email = req.body.email || "";
    const message = req.body.message || req.body.prompt || "";

    if (!message) {
      return res.status(400).json({ error: "No message/prompt provided" });
    }

    const userPrompt = `User name: ${name}\nUser email: ${email}\nMessage: ${message}`;
    const aiReply = await callOpenAI(userPrompt);

    // JSON response for AJAX usage (Carrd embed code, etc.)
    res.json({
      ok: true,
      name,
      email,
      message,
      aiReply,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      error: "Server error. Check logs.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
