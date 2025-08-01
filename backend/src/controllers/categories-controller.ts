// categories.controller.ts
import { Request, Response } from "express";
import { supabase } from "../supabase";

export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ categories });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCategoriesByType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type } = req.params;

    if (type !== 'product' && type !== 'service') {
      res.status(400).json({ error: 'Invalid category type' });
      return;
    }

    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .eq('type', type)
      .order("sort_order");

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ categories });
  } catch (err) {
    console.error("Error fetching categories by type:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
