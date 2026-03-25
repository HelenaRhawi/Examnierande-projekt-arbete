import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../data/db.js";

const router = Router();
router.post("/", (req, res) => {
  const { name, email, address } = req.body;
  if (!name || !email || !address) {
    return res.status(400).json({ Fel: "Namn, email och adress krävs." });
  }
  const id = uuidv4();
  const createdAt = new Date().toISOString();
  try {
    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, address, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, name, email, address, createdAt);

    const newUser = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("POST /user: ", error);
    res.status(500).json({ Fel: "Kunde inte skapa användare." });
  }
});

export default router;
