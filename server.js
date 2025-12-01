import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY in env");
  process.exit(1);
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/chat { messages: [{role:"user", content:"..."}] }
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages (array) required" });
    }

    const systemPrompt = {
      role: "system",
      content: "You are a helpful assistant for my website's chat widget."
    };
    const payloadMessages = [systemPrompt, ...messages];

    // Use GPT-4.1
    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: payloadMessages,
      max_tokens: 800
    });

    const assistantMsg = response.choices?.[0]?.message ?? null;
    res.json({ assistant: assistantMsg, raw: response });
  } catch (err) {
    console.error("OpenAI error", err);
    res.status(500).json({ error: err?.message ?? "Server error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
