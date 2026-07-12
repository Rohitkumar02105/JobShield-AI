import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import analyzeRouter from "./routes/analyze.js";
import trackerRouter from "./routes/tracker.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "JobShield AI API" });
});

app.use("/api/analyze", analyzeRouter);
app.use("/api/tracker", trackerRouter);

async function start() {
  if (process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } else {
    console.log("MongoDB disabled: running with in-memory demo tracker");
  }

  app.listen(port, () => {
    console.log(`JobShield AI API running on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
