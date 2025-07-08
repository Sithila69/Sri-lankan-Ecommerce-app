import express, { Request, Response } from "express";
import { supabase } from "../supabase";

const router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from("products").select(`
        *,
        seller:seller_id (
          id,
          name,
          rating,
          reviews,
          location,
          contact_email,
          contact_phone
        )
      `);
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        seller:seller_id (
          id,
          name,
          rating,
          reviews,
          location,
          contact_email,
          contact_phone
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, price, category } = req.body;
    const { data, error } = await supabase
      .from("products")
      .insert([{ title, price, category }]);
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
