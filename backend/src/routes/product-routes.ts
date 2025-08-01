// src/routes/productRoutes.ts
import { Router } from "express";
import {
  getAllProducts,
  getProductsByCategory,
} from "../controllers/product-controller";

const router = Router();

router.get("/all", getAllProducts);
router.get("/category/:categorySlug", getProductsByCategory); // Get products by category slug

export default router;
