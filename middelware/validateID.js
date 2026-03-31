import { validate as validateUUID } from "uuid";
import db from "../data/db.js";

export default function validateID(table, idColumn = "id") {
  return function (req, res, next) {
    const { id } = req.params;

    // 1. Kontrollera UUID-format
    if (!validateUUID(id)) {
      return res.status(400).json({ fel: "Ogiltigt ID-format" });
    }

    // 2. Kontrollera att posten finns i rätt tabell
    const query = `SELECT * FROM ${table} WHERE ${idColumn} = ?`;
    const record = db.prepare(query).get(id);

    if (!record) {
      return res.status(404).json({ fel: `${table} hittades inte` });
    }

    // 3. Lägg posten i req för senare användning
    req.record = record;

    next();
  };
}
