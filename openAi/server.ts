import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import OpenAI from "openai";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(express.json());
app.use(cors());

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Missing OPENAI_API_KEY in .env");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const { messages, products } = req.body;

    if (!messages || !products) {
      return res.status(400).json({ error: "Missing messages or products" });
    }

    const userInput = messages[messages.length - 1].content;

    const prompt = `
Eres un chatbot de tienda de ropa.
Hablas español o inglés automáticamente según el usuario.

Productos disponibles:
${JSON.stringify(products, null, 2)}

Instrucciones:
- Responde SOLO usando esta lista de productos.
- Si preguntan por un producto, responde con su stock.
- Si un producto no existe, dilo claramente.
- Nunca inventes productos.
Usuario: ${userInput}
`;

    // ---- OPENAI CALL ----
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    // ---- CORRECT TEXT EXTRACTION ----
    let replyText = "No pude generar una respuesta.";

    try {
      const message = response.output?.[0];
      if (
        message &&
        "content" in message &&
        message.content?.[0] &&
        "text" in message.content?.[0]
      ) {
        replyText = message.content[0].text;
      }
    } catch (err) {
      console.error("Failed to extract model output:", err);
    }
    // -------------------------------

    res.json({
      assistant: {
        role: "assistant",
        content: replyText,
      },
    });

  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Chat backend error" });
  }
});

app.listen(3001, () => {
  console.log("Chat backend running on http://localhost:3001");
});
