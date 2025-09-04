import { configDotenv } from "dotenv";
import fetch from "node-fetch";

configDotenv();

const API_KEY = process.env.IOINTELLIGENCE_API_KEY;
const API_URL = "https://api.intelligence.io.solutions/api/v1/chat/completions";

// Call io.net API
export async function classifyText(model, text) {
  const start = Date.now();

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: text }],
      temperature: 0,
    }),
  });

  const data = await response.json();
  const latency = Date.now() - start;

  const prediction = data?.choices?.[0]?.message?.content?.trim() || "Unknown";
  const tokens = data?.usage?.total_tokens || 0;

  // No confidence provided → simulate with 1.0 if success
  const confidence = data?.choices?.[0]?.finish_reason ? 1.0 : 0.5;

  return {
    input: text,
    prediction,
    confidence,
    latency,
    tokens,
    model,
  };
}
