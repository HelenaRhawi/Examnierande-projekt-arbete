import { validate } from "uuid";
import db from "../data/db.js";

export default function validateUser(req, res, next) {
  const { name, email, address } = req.body;

  // 1. Kolla att fält finns
  if (!name || !email || !address) {
    return res.status(400).json({ Fel: "Alla fält måste vara ifyllda!" });
  }

  // 2. Kolla datatyp + tomma strängar
  if (
    typeof name !== "string" ||
    name.trim() === "" ||
    typeof email !== "string" ||
    email.trim() === "" ||
    typeof address !== "string" ||
    address.trim() === ""
  ) {
    return res.status(400).json({
      Fel: "Namn, e-mail och adress måste vara giltiga strängar",
    });
  }

  // 3. Kolla e‑postformat
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ Fel: "E-mail har ett ogiltigt format!" });
  }

  // 4. Kolla om e‑post redan finns i databasen
  const existingUser = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email);

  if (existingUser) {
    return res
      .status(400)
      .json({ Fel: "Denna e-postadress är redan upptagen" });
  }

  // 5. Allt OK → gå vidare
  next();
}
