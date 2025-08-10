import { Router } from "express";

import {
  registerCustomer,
  loginCustomer,
} from "../controllers/customer-controller";

const router = Router();

// POST /customers/register
router.post("/register", registerCustomer);

// POST /customers/login
router.post("/login", loginCustomer);

export default router;
