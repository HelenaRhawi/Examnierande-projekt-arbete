import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../data/db.js";
import validateOrder from "../middelware/validateOrder.js";

const router = Router();

router.get("/", (req, res) => {
  const getAllOrders = db.prepare("SELECT * FROM orders");
  res.json(getAllOrders.all());
});

router.post("/", validateOrder, (req, res) => {
  try {
    const { userId } = req.body;

    const validatedItems = req.validatedItems;

    const orderId = uuidv4();
    const eta = Math.floor(Math.random() * 10) + 5;
    const createdAt = new Date().toISOString();

    db.prepare(
      `
      INSERT INTO orders (id, userId, ETA, createdAt)
      VALUES (?, ?, ?, ?)
    `,
    ).run(orderId, userId || null, eta, createdAt);

    const insertItem = db.prepare(`
      INSERT INTO orderItems (id, order_id, menu_id, quantity, price)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const item of validatedItems) {
      insertItem.run(
        uuidv4(),
        orderId,
        item.menu_id,
        item.quantity,
        item.price,
      );
    }

    const itemsWithNames = db
      .prepare(
        `
      SELECT 
        oi.quantity,
        oi.price,
        m.title
      FROM orderItems oi
      JOIN menu m ON oi.menu_id = m.id
      WHERE oi.order_id = ?
    `,
      )
      .all(orderId);

    const total = itemsWithNames.reduce((sum, item) => {
      return sum + item.quantity * item.price;
    }, 0);

    res.status(201).json({
      orderId,
      eta,
      total,
      items: itemsWithNames.map((item) => ({
        name: item.title,
        quantity: item.quantity,
      })),
    });
  } catch (error) {
    console.error("POST /orders:", error);
    res.status(500).json({ fel: "Kunde inte skapa order" });
  }
});

export default router;
