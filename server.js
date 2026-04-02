import "dotenv/config";
import express from "express";
import apiRouter from "./routes/api.js";
import { runSeeders } from "./data/seed/runSeeders.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

runSeeders();

app.use("/api", apiRouter);

app.get("/", (_req, res) => {
  res.json({ Message: "Welcome to Mr Bean API" });
});

app.listen(PORT, () => {
  console.log(`API listening to http://localhost:${PORT}`);
});
