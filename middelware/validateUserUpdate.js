import db from "../data/db.js";

export default function validateUserUpdate(req, res, next) {
  const { name, email, address } = req.body;
  const { id } = req.params; // viktigt för att exkludera användaren själv

  // 1. Fält måste finnas
  if (!name || !email || !address) {
    return res.status(400).json({
      Fel: "Namn, e-mail och adress är obligatoriskt!",
    });
  }

  // 2. Datatyp + tomma strängar
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

  // 3. E‑postformat
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      Fel: "E-mail har ett ogiltigt format!",
    });
  }

  // 4. Kontrollera att e‑posten inte används av någon annan
  const existingUser = db
    .prepare("SELECT * FROM users WHERE email = ? AND id != ?")
    .get(email, id);

  if (existingUser) {
    return res.status(400).json({
      Fel: "Denna e-postadress används redan av en annan användare",
    });
  }

  next();
}
