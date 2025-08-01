import { Router } from "express";

import {
  debugListings,
  getAllListings,
  getListingDetails,
  getListingsByCategory,
  getCategories,
} from "../controllers/listings-controller";

const router = Router();

// GET /listings
router.get("/all", getAllListings);
router.get("/debug-listings", debugListings);
router.get("/categories", getCategories); // Get all categories
router.get("/category/:categorySlug", getListingsByCategory); // Get listings by category slug
router.get("/get-details/:idOrSlug", getListingDetails);
export default router;
