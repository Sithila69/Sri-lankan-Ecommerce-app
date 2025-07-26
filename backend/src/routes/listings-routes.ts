import { Router } from "express";

import {
  debugListings,
  getAllListings,
  getListingDetails,
} from "../controllers/listings-controller";

const router = Router();

// GET /listings
router.get("/all", getAllListings);
router.get("/debug-listings", debugListings); // Default route to get all listings
router.get("/get-details/:idOrSlug", getListingDetails); // Assuming this is for getting listings by slug
export default router;
