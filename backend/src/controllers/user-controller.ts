import { supabase } from "../supabase";
import { Request, Response } from "express";

export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const { data: users, error: SupabaseError } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (SupabaseError || !users) {
      res
        .status(500)
        .json({ error: SupabaseError?.message || "Failed to fetch users" });
      return;
    }

    res.status(200).json(users);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};
