// categories.routes.ts
import { Router } from "express";
import { getAllCategories, getCategoriesByType } from "../controllers/categories-controller";

const router = Router();

router.get("/", getAllCategories);
router.get("/type/:type", getCategoriesByType);

export default router;
