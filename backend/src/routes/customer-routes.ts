import { Router } from "express";

import {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  getAuthStatus,
} from "../controllers/customer-controller";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// POST /customers/register
router.post("/register", registerCustomer);

// POST /customers/login
router.post("/login", loginCustomer);

// POST /customers/logout
router.post("/logout", logoutCustomer);

// GET /customers/auth-status
router.get("/auth-status", authenticateToken, getAuthStatus);

export default router;
