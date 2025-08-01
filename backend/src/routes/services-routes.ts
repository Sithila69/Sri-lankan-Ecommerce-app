import { Router } from "express";

import {
  getAllServices,
  getServicesByCategory,
} from "../controllers/services-controller";

const router = Router();

router.get("/all", getAllServices);
router.get("/category/:categorySlug", getServicesByCategory); // Get services by category slug

export default router;
