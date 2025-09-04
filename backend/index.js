import express from "express";
import { runEvaluation } from "./evaluator.js";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());

// Health check
app.get("/", (req, res) => {
  res.send("AI Model Evaluation Dashboard Backend");
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