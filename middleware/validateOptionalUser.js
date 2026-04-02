// middleware/validateOptionalUser.js
import db from "../data/db.js";
import { validate as validateUUID } from "uuid";

export default function validateOptionalUser(req, res, next) {
  const { id } = req.body;

  if (!id) {
    req.user = null;
    return next();
  }

  if (!validateUUID(id)) {
    return res.status(400).json({ Error: "Invalid ID-format" });
  }

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);

  if (!user) {
    return res.status(404).json({ Error: "User not found" });
  }

  req.user = user;

  next();
}
