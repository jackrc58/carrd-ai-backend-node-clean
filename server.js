// Clean server.js for FractionalGeek AI Backend

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple health check
app.get("/", (req, res) => {
  res.send("Carrd AI backend is running ✅");
});

// TEMP DEBUG: Check if OPENAI_API_KEY is visible to the app
app.get("/debug/env", (req, res) => { 
  const apiKey = process.env.OPENAI_API_KEY; 
  res.json({
    hasKey: !!apiKey,
    length: apiKey ? apiKey.length : 0,
  });
}); 

// Main AI endpoint
app.post("/api/ai", async (req, res) => {
  try {
    const name = req.body.name || "Friend";
    const email = req.body.email || "";
    const message = req.body.message || req.body.prompt || "";

    if (!message) {
      return res.status(400).json({
        ok: false,
        error: "No message/prompt provided",
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return res.status(500).json({
        ok: false,
        error: "Server misconfiguration: missing OPENAI_API_KEY",
      });
    }

    const userPrompt = `User name: ${name}
User email: ${email}

User message:
${message}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are FractionalGeek AI, a helpful and concise assistant. Answer clearly and directly.",
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("OpenAI API error:", response.status, errText);
      return res.status(500).json({
        ok: false,
        error: "Error from AI provider. Try again later.",
      });
    }

    const data = await response.json();
    const aiReply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't generate a reply.";

    res.json({
      ok: true,
      name,
      email,
      message,
      aiReply,
    });
  } catch (err) {
    console.error("Unexpected server error:", err);
    res.status(500).json({
      ok: false,
      error: "Server error. Check logs.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

