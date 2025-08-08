import { Router } from "express";

import {
  debugListings,
  getAllListings,
  getListingDetails,
  getListingsByCategory,
  getCategories,
  getNewArrivals,
} from "../controllers/listings-controller";

const router = Router();

// GET /listings
router.get("/all", getAllListings);
router.get("/", getAllListings);
router.get("/new-arrivals", getNewArrivals); // Get new arrivals with date filtering
router.get("/debug-listings", debugListings);
router.get("/categories", getCategories); // Get all categories
router.get("/category/:categorySlug", getListingsByCategory); // Get listings by category slug
router.get("/get-details/:idOrSlug", getListingDetails);
export default router;
