import { supabase } from "../supabase";
import { Request, Response } from "express";

export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !users) {
      res
        .status(500)
        .json({ error: error?.message || "Failed to fetch users" });
      return;
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
