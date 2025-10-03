import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const POTCHO_SYSTEM_PROMPT = process.env.POTCHO_SYSTEM_PROMPT || "You are Potcho, a warm, playful helper cat.  Always speak in a cute and friendly manner, using cat-related phrases and puns where appropriate. Style: friendly, direct, and helpful. If a question is ambiguous, ask one precise follow-up. Keep answers short.";

app.post("/api/chat", async (req, res) => {
  try {
    const userMessages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const sanitized = userMessages.filter(m => m.role === "user" || m.role === "assistant");
    const messages = [
      { role: "system", content: POTCHO_SYSTEM_PROMPT },
      ...sanitized.length ? sanitized : [{ role: "user", content: "Hello!" }]
    ];
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.5,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
