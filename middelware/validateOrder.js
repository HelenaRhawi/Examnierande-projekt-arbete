import db from "../data/db.js";

export default function validateOrder(req, res, next) {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ fel: "Ordern måste innehålla items" });
  }

  const menu = db.prepare("SELECT * FROM menu").all();

  try {
    const validatedItems = items.map((item) => {
      const menuItem = menu.find((m) => m.id == item.menuId);

      if (!menuItem) {
        throw new Error(`Produkt ${item.menuId} finns inte`);
      }

      return {
        menu_id: menuItem.id,
        quantity: item.quantity,
        price: menuItem.price,
      };
    });

  
    req.validatedItems = validatedItems;

    next();
  } catch (error) {
    return res.status(400).json({ fel: error.message });
  }
}
