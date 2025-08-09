// src/controllers/customer-controller.ts
import { Request, Response } from "express";
import { supabase } from "../supabase";
import argon2 from "argon2";

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export const registerCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const input = req.body;

    if (
      !input.email ||
      !input.password ||
      !input.first_name ||
      !input.last_name
    ) {
      res.status(400).json({
        error:
          "Missing required fields: email, password, first_name, last_name",
      });
      return;
    }

    const { data: existingUsers, error: checkErr } = await supabase
      .from("users")
      .select("id")
      .eq("email", input.email)
      .limit(1);

    if (checkErr) {
      res.status(500).json({ error: checkErr.message });
      return;
    }

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      res.status(409).json({ error: "Email is already registered" });
      return;
    }

    const passwordHash = await argon2.hash(input.password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 1,
    });

    const { data: userInsert, error: userError } = await supabase
      .from("users")
      .insert([
        {
          email: input.email,
          password_hash: passwordHash,
          first_name: input.first_name,
          last_name: input.last_name,
          phone: input.phone ?? null,
          user_type: "customer",
          email_verified: false,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (userError) {
      res.status(500).json({ error: userError.message });
      return;
    }

    const { error: customerError } = await supabase.from("customers").insert([
      {
        user_id: userInsert.id,
        date_of_birth: input.date_of_birth ?? null,
        gender: input.gender ?? null,
        preferred_language: input.preferred_language ?? "en",
        marketing_consent: input.marketing_consent ?? false,
        referral_code: input.referral_code ?? null,
        referred_by_code: input.referred_by_code ?? null,
      },
    ]);

    if (customerError) {
      await supabase.from("users").delete().eq("id", userInsert.id);
      res.status(500).json({ error: customerError.message });
      return;
    }

    res.status(201).json({
      message: "Customer registered successfully",
      user_id: userInsert.id,
    });
  } catch (error: any) {
    console.error("Error registering customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
