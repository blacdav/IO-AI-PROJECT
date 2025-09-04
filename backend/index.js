import express from "express";
import { runEvaluation } from "./evaluator.js";
import fs from "fs";
import cors from "cors";
import { configDotenv } from "dotenv";
configDotenv();

const app = express();
const PORT = 4000;
const API_KEY = process.env.IOINTELLIGENCE_API_KEY;

app.use(cors());

// Health check
app.get("/", (req, res) => {
  res.send("AI Model Evaluation Dashboard Backend");
});

app.get("/models", async (req, res) => {
  try {
    const response = await fetch("https://api.intelligence.io.solutions/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Run evaluation manually
app.post("/evaluate", async (req, res) => {
  try {
    const metrics = await runEvaluation();
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get last stored metrics
app.get("/metrics", (req, res) => {
  if (!fs.existsSync("./metrics.json")) {
    return res.status(404).json({ error: "No metrics found. Run /evaluate first." });
  }
  const metrics = JSON.parse(fs.readFileSync("./metrics.json"));
  res.json(metrics);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});