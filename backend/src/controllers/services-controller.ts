import { Request, Response } from "express";
import { supabase } from "../supabase";
import { ListingFilters, PaginationParams } from "../types";

export const getServicesByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { categorySlug } = req.params;
    const {
      district,
      province,
      min_price,
      max_price,
      search,
      status = "active",
      featured,
      service_type,
      availability,
      page = 1,
      limit = 20,
    } = req.query as ListingFilters & PaginationParams;

    const offset = (Number(page) - 1) * Number(limit);

    // Build base query
    let query = supabase
      .from("listings")
      .select(
        "*, sellers!inner(id, business_name, is_verified, rating, total_reviews, district, province), services!inner(*), categories!inner(id, name, slug)"
      )
      .eq("status", status)
      .range(offset, offset + Number(limit) - 1)
      .order("created_at", { ascending: false });

    // Filter by category if not "all"
    if (categorySlug !== "all") {
      query = query.eq("categories.slug", categorySlug);
    }

    // Apply other filters
    if (district) query = query.eq("district", district);
    if (province) query = query.eq("province", province);
    if (min_price) query = query.gte("base_price", min_price);
    if (max_price) query = query.lte("base_price", max_price);
    if (featured) query = query.eq("featured", featured);
    if (service_type) query = query.eq("services.service_type", service_type);
    if (availability) query = query.eq("services.availability", availability);
    if (search) {
      query = query.or(`name.ilike.%${search}%, description.ilike.%${search}%`);
    }

    const { data: baseServices, error: baseError } = await query;
    if (baseError) {
      res.status(500).json({ error: baseError.message });
      return;
    }
    if (!baseServices || baseServices.length === 0) {
      res.json({
        services: [],
        pagination: { page: Number(page), limit: Number(limit), total: 0 },
      });
      return;
    }

    const listingIds = baseServices.map((s) => s.id);

    // Fetch additional data in parallel
    const [imagesRes, reviewsRes] = await Promise.all([
      supabase
        .from("listing_images")
        .select("*")
        .eq("status", "active")
        .in("listing_id", listingIds),
      supabase
        .from("reviews")
        .select("listing_id, rating")
        .in("listing_id", listingIds),
    ]);

    const images = imagesRes.data || [];
    const reviews = reviewsRes.data || [];

    // Helper functions
    const getReviewSummary = (listingId: string) => {
      const filtered = reviews.filter((r) => r.listing_id === listingId);
      const total = filtered.length;
      const average =
        total > 0
          ? parseFloat(
              (filtered.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(
                2
              )
            )
          : 0;
      return { count: total, average };
    };

    const getPrimaryImage = (listingId: string) => {
      const imgs = images.filter((i) => i.listing_id === listingId);
      const primary = imgs.find((i) => i.is_primary) || imgs[0];
      return primary
        ? { url: primary.image_url, alt_text: primary.alt_text }
        : null;
    };

    // Process services
    const processedServices = baseServices.map((service) => {
      return {
        id: service.id,
        name: service.name,
        slug: service.slug,
        category: {
          id: service.categories.id,
          name: service.categories.name,
          slug: service.categories.slug,
        },
        description: service.description,
        short_description: service.short_description,
        base_price: service.base_price,
        discounted_price: service.discounted_price,
        currency: service.currency,
        location: service.location,
        district: service.district,
        province: service.province,
        featured: service.featured,
        views_count: service.views_count,
        primary_image: getPrimaryImage(service.id),
        seller: {
          id: service.sellers.id,
          business_name: service.sellers.business_name,
          is_verified: service.sellers.is_verified,
          rating: service.sellers.rating,
          total_reviews: service.sellers.total_reviews,
          district: service.sellers.district,
          province: service.sellers.province,
        },
        review_summary: getReviewSummary(service.id),
        time_info: {
          type: "completion",
          min: service.services.completion_time_min,
          max: service.services.completion_time_max,
          unit: service.services.completion_time_unit,
        },
        availability_info: {
          type: "service",
          availability: service.services.availability,
          service_type: service.services.service_type,
        },
        listing_type: "service",
      };
    });

    res.json({
      services: processedServices,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: processedServices.length,
      },
    });
  } catch (err) {
    console.error("Error fetching services by category:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllServices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      category_id,
      district,
      province,
      min_price,
      max_price,
      search,
      status = "active",
      featured,
      service_type,
      availability,
      page = 1,
      limit = 20,
    } = req.query as ListingFilters & PaginationParams;

    const offset = (Number(page) - 1) * Number(limit);

    // ----------- Base Services Query -------------
    let query = supabase
      .from("listings")
      .select(
        "*, sellers!inner(id, business_name, is_verified, rating, total_reviews, district, province), services!inner(*), categories!inner(id, name, slug)"
      )
      .eq("status", status)
      .range(offset, offset + Number(limit) - 1)
      .order("created_at", { ascending: false });

    // Apply filters
    if (category_id) query = query.eq("category_id", category_id);
    if (district) query = query.eq("district", district);
    if (province) query = query.eq("province", province);
    if (min_price) query = query.gte("base_price", min_price);
    if (max_price) query = query.lte("base_price", max_price);
    if (featured) query = query.eq("featured", featured);
    if (service_type) query = query.eq("services.service_type", service_type);
    if (availability) query = query.eq("services.availability", availability);
    if (search) {
      query = query.or(`name.ilike.%${search}%, description.ilike.%${search}%`);
    }

    const { data: baseServices, error: baseError } = await query;
    if (baseError) {
      res.status(500).json({ error: baseError.message });
      return;
    }
    if (!baseServices || baseServices.length === 0) {
      res.json({
        services: [],
        pagination: { page: Number(page), limit: Number(limit), total: 0 },
      });
      return;
    }

    const listingIds = baseServices.map((s) => s.id);

    // ---------- Parallel Fetch: images, reviews ----------
    const [imagesRes, reviewsRes] = await Promise.all([
      supabase
        .from("listing_images")
        .select("*")
        .eq("status", "active")
        .in("listing_id", listingIds),
      supabase
        .from("reviews")
        .select("listing_id, rating")
        .in("listing_id", listingIds),
    ]);

    const images = imagesRes.data || [];
    const reviews = reviewsRes.data || [];

    // ----------- Helper functions ----------------
    const getReviewSummary = (listingId: string) => {
      const filtered = reviews.filter((r) => r.listing_id === listingId);
      const total = filtered.length;
      const average =
        total > 0
          ? parseFloat(
              (filtered.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(
                2
              )
            )
          : 0;
      return { count: total, average };
    };

    const getPrimaryImage = (listingId: string) => {
      const imgs = images.filter((i) => i.listing_id === listingId);
      const primary = imgs.find((i) => i.is_primary) || imgs[0];
      return primary
        ? { url: primary.image_url, alt_text: primary.alt_text }
        : null;
    };

    // ------------- Final services construction ---------------
    const processedServices = baseServices.map((service) => {
      return {
        id: service.id,
        name: service.name,
        slug: service.slug,
        category: {
          id: service.categories.id,
          name: service.categories.name,
          slug: service.categories.slug,
        },
        description: service.description,
        short_description: service.short_description,
        base_price: service.base_price,
        discounted_price: service.discounted_price,
        currency: service.currency,
        location: service.location,
        district: service.district,
        province: service.province,
        featured: service.featured,
        views_count: service.views_count,
        primary_image: getPrimaryImage(service.id),
        seller: {
          id: service.sellers.id,
          business_name: service.sellers.business_name,
          is_verified: service.sellers.is_verified,
          rating: service.sellers.rating,
          total_reviews: service.sellers.total_reviews,
          district: service.sellers.district,
          province: service.sellers.province,
        },
        review_summary: getReviewSummary(service.id),
        time_info: {
          type: "completion",
          min: service.services.completion_time_min,
          max: service.services.completion_time_max,
          unit: service.services.completion_time_unit,
        },
        availability_info: {
          type: "service",
          availability: service.services.availability,
          service_type: service.services.service_type,
        },
        listing_type: "service",
      };
    });

    res.json({
      services: processedServices,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: processedServices.length,
      },
    });
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
