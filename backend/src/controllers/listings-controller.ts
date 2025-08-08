// listings.controller.ts
import { Request, Response } from "express";
import { supabase } from "../supabase";
import { ListingFilters, PaginationParams } from "../types";

// DEBUG CONTROLLER - Remove this after testing
export const debugListings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Debug: Checking database connection and data...");

    // 1. Check if we can connect to listings table
    const { data: allListings, error: listingsError } = await supabase
      .from("listings")
      .select("*")
      .limit(5);

    console.log("Listings count:", allListings?.length);
    console.log("Listings error:", listingsError);

    // 2. Check sellers table
    const { data: sellers, error: sellersError } = await supabase
      .from("sellers")
      .select("*")
      .limit(5);

    console.log("Sellers count:", sellers?.length);
    console.log("Sellers error:", sellersError);

    // 3. Try a simple join
    const { data: joinTest, error: joinError } = await supabase
      .from("listings")
      .select(
        `
        id,
        name,
        sellers (
          id,
          business_name
        )
      `
      )
      .limit(3);

    console.log("Join test count:", joinTest?.length);
    console.log("Join error:", joinError);

    res.json({
      raw_listings: allListings,
      sellers: sellers,
      join_test: joinTest,
      errors: {
        listings: listingsError,
        sellers: sellersError,
        join: joinError,
      },
    });
  } catch (err) {
    console.error("Debug error:", err);
    res.status(500).json({ error: "Debug failed", details: err });
  }
};

export const getAllListings = async (
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
      page = 1,
      limit = 20,
      listing_type,
      days_back,
    } = req.query as ListingFilters &
      PaginationParams & {
        listing_type?: "product" | "service";
        days_back?: number;
      };

    const offset = (Number(page) - 1) * Number(limit);

    // ----------- Base Listing Query -------------
    let query = supabase
      .from("listings")
      .select(
        "*, sellers!inner(id, business_name, is_verified, rating, total_reviews, district, province), categories!inner(id, name, slug)"
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
    if (search) {
      query = query.or(`name.ilike.%${search}%, description.ilike.%${search}%`);
    }
    if (listing_type) {
      if (listing_type === "product") {
        query = query.not("product_id", "is", null);
      } else if (listing_type === "service") {
        query = query.not("service_id", "is", null);
      }
    }
    if (days_back) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - Number(days_back));
      query = query.gte("created_at", daysAgo.toISOString());
    }

    const { data: baseListings, error: baseError } = await query;
    if (baseError) {
      res.status(500).json({ error: baseError.message });
      return;
    }
    if (!baseListings || baseListings.length === 0) {
      res.json({ listings: [], pagination: { page, limit, total: 0 } });
      return;
    }

    const listingIds = baseListings.map((l) => l.id);

    // ---------- Parallel Fetch: products, services, images, reviews ----------
    const [productsRes, servicesRes, imagesRes, reviewsRes] = await Promise.all(
      [
        supabase.from("products").select("*").in("listing_id", listingIds),
        supabase.from("services").select("*").in("listing_id", listingIds),
        supabase
          .from("listing_images")
          .select("*")
          .eq("status", "active")
          .in("listing_id", listingIds),
        supabase
          .from("reviews")
          .select("listing_id, rating")
          .in("listing_id", listingIds),
      ]
    );

    const products = productsRes.data || [];
    const services = servicesRes.data || [];
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

    const getTimeAndAvailabilityInfo = (listingId: string) => {
      const product = products.find((p) => p.listing_id === listingId);
      const service = services.find((s) => s.listing_id === listingId);

      if (product) {
        return {
          listing_type: "product",
          time_info: {
            type: "delivery",
            min: product.delivery_time_min,
            max: product.delivery_time_max,
            unit: "days",
          },
          availability_info: {
            type: "product",
            quantity: product.stock_quantity,
            available: product.stock_quantity > 0,
          },
        };
      }

      if (service) {
        return {
          listing_type: "service",
          time_info: {
            type: "completion",
            min: service.completion_time_min,
            max: service.completion_time_max,
            unit: service.completion_time_unit,
          },
          availability_info: {
            type: "service",
            availability: service.availability,
            service_type: service.service_type,
          },
        };
      }

      return {
        listing_type: "unknown",
        time_info: null,
        availability_info: null,
      };
    };

    // ------------- Final listing construction ---------------
    const processedListings = baseListings.map((listing) => {
      const { listing_type, time_info, availability_info } =
        getTimeAndAvailabilityInfo(listing.id);

      return {
        id: listing.id,
        name: listing.name,
        slug: listing.slug,
        category: {
          id: listing.categories.id,
          name: listing.categories.name,
          slug: listing.categories.slug,
        },
        description: listing.description,
        short_description: listing.short_description,
        base_price: listing.base_price,
        discounted_price: listing.discounted_price,
        currency: listing.currency,
        location: listing.location,
        district: listing.district,
        province: listing.province,
        featured: listing.featured,
        views_count: listing.views_count,
        primary_image: getPrimaryImage(listing.id),
        seller: {
          id: listing.sellers.id,
          business_name: listing.sellers.business_name,
          is_verified: listing.sellers.is_verified,
          rating: listing.sellers.rating,
          total_reviews: listing.sellers.total_reviews,
          district: listing.sellers.district,
          province: listing.sellers.province,
        },
        review_summary: getReviewSummary(listing.id),
        time_info,
        availability_info,
        listing_type,
      };
    });

    res.json({
      listings: processedListings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: processedListings.length,
      },
    });
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getListingsByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { categorySlug } = req.params;
    const {
      type,
      page = 1,
      limit = 20,
      district,
      province,
      min_price,
      max_price,
      search,
      status = "active",
      featured,
      days_back,
    } = req.query as ListingFilters &
      PaginationParams & {
        type?: "product" | "service";
        days_back?: number;
      };

    const offset = (Number(page) - 1) * Number(limit);

    // Build base query
    let query = supabase
      .from("listings")
      .select(
        "*, sellers!inner(id, business_name, is_verified, rating, total_reviews, district, province), categories!inner(id, name, slug)"
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
    if (search) {
      query = query.or(`name.ilike.%${search}%, description.ilike.%${search}%`);
    }

    // Filter by listing type
    if (type === "product") {
      query = query.not("product_id", "is", null);
    } else if (type === "service") {
      query = query.not("service_id", "is", null);
    }

    // Filter by date range
    if (days_back) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - Number(days_back));
      query = query.gte("created_at", daysAgo.toISOString());
    }

    const { data: baseListings, error: baseError } = await query;

    if (baseError) {
      res.status(500).json({ error: baseError.message });
      return;
    }

    if (!baseListings || baseListings.length === 0) {
      res.json({
        listings: [],
        pagination: { page: Number(page), limit: Number(limit), total: 0 },
      });
      return;
    }

    const listingIds = baseListings.map((l) => l.id);

    // Fetch additional data in parallel
    const [productsRes, servicesRes, imagesRes, reviewsRes] = await Promise.all(
      [
        supabase.from("products").select("*").in("listing_id", listingIds),
        supabase.from("services").select("*").in("listing_id", listingIds),
        supabase
          .from("listing_images")
          .select("*")
          .eq("status", "active")
          .in("listing_id", listingIds),
        supabase
          .from("reviews")
          .select("listing_id, rating")
          .in("listing_id", listingIds),
      ]
    );

    const products = productsRes.data || [];
    const services = servicesRes.data || [];
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

    const getTimeAndAvailabilityInfo = (listingId: string) => {
      const product = products.find((p) => p.listing_id === listingId);
      const service = services.find((s) => s.listing_id === listingId);

      if (product) {
        return {
          listing_type: "product",
          time_info: {
            type: "delivery",
            min: product.delivery_time_min,
            max: product.delivery_time_max,
            unit: "days",
          },
          availability_info: {
            type: "product",
            quantity: product.stock_quantity,
            available: product.stock_quantity > 0,
          },
        };
      }

      if (service) {
        return {
          listing_type: "service",
          time_info: {
            type: "completion",
            min: service.completion_time_min,
            max: service.completion_time_max,
            unit: service.completion_time_unit,
          },
          availability_info: {
            type: "service",
            availability: service.availability,
            service_type: service.service_type,
          },
        };
      }

      return {
        listing_type: "unknown",
        time_info: null,
        availability_info: null,
      };
    };

    // Process listings
    const processedListings = baseListings.map((listing) => {
      const { listing_type, time_info, availability_info } =
        getTimeAndAvailabilityInfo(listing.id);

      return {
        id: listing.id,
        name: listing.name,
        slug: listing.slug,
        category: {
          id: listing.categories.id,
          name: listing.categories.name,
          slug: listing.categories.slug,
        },
        description: listing.description,
        short_description: listing.short_description,
        base_price: listing.base_price,
        discounted_price: listing.discounted_price,
        currency: listing.currency,
        location: listing.location,
        district: listing.district,
        province: listing.province,
        featured: listing.featured,
        views_count: listing.views_count,
        primary_image: getPrimaryImage(listing.id),
        seller: {
          id: listing.sellers.id,
          business_name: listing.sellers.business_name,
          is_verified: listing.sellers.is_verified,
          rating: listing.sellers.rating,
          total_reviews: listing.sellers.total_reviews,
          district: listing.sellers.district,
          province: listing.sellers.province,
        },
        review_summary: getReviewSummary(listing.id),
        time_info,
        availability_info,
        listing_type,
      };
    });

    res.json({
      listings: processedListings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: processedListings.length,
      },
    });
  } catch (err) {
    console.error("Error fetching listings by category:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getNewArrivals = async (
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
      page = 1,
      limit = 20,
      listing_type,
      days_back = 30, // Default to 30 days for new arrivals
    } = req.query as ListingFilters &
      PaginationParams & {
        listing_type?: "product" | "service";
        days_back?: number;
      };

    const offset = (Number(page) - 1) * Number(limit);

    // Calculate date threshold
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number(days_back));

    // Base query with date filter for new arrivals
    let query = supabase
      .from("listings")
      .select(
        "*, sellers!inner(id, business_name, is_verified, rating, total_reviews, district, province), categories!inner(id, name, slug)"
      )
      .eq("status", status)
      .gte("created_at", daysAgo.toISOString())
      .range(offset, offset + Number(limit) - 1)
      .order("created_at", { ascending: false });

    // Apply additional filters
    if (category_id) query = query.eq("category_id", category_id);
    if (district) query = query.eq("district", district);
    if (province) query = query.eq("province", province);
    if (min_price) query = query.gte("base_price", min_price);
    if (max_price) query = query.lte("base_price", max_price);
    if (featured) query = query.eq("featured", featured);
    if (search) {
      query = query.or(`name.ilike.%${search}%, description.ilike.%${search}%`);
    }
    if (listing_type) {
      if (listing_type === "product") {
        query = query.not("product_id", "is", null);
      } else if (listing_type === "service") {
        query = query.not("service_id", "is", null);
      }
    }

    const { data: baseListings, error: baseError } = await query;
    if (baseError) {
      res.status(500).json({ error: baseError.message });
      return;
    }
    if (!baseListings || baseListings.length === 0) {
      res.json({
        listings: [],
        pagination: { page, limit, total: 0 },
        date_range: {
          days_back: Number(days_back),
          from_date: daysAgo.toISOString(),
          to_date: new Date().toISOString(),
        },
      });
      return;
    }

    const listingIds = baseListings.map((l) => l.id);

    // Fetch additional data in parallel
    const [productsRes, servicesRes, imagesRes, reviewsRes] = await Promise.all(
      [
        supabase.from("products").select("*").in("listing_id", listingIds),
        supabase.from("services").select("*").in("listing_id", listingIds),
        supabase
          .from("listing_images")
          .select("*")
          .eq("status", "active")
          .in("listing_id", listingIds),
        supabase
          .from("reviews")
          .select("listing_id, rating")
          .in("listing_id", listingIds),
      ]
    );

    const products = productsRes.data || [];
    const services = servicesRes.data || [];
    const images = imagesRes.data || [];
    const reviews = reviewsRes.data || [];

    // Helper functions (same as getAllListings)
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

    const getTimeAndAvailabilityInfo = (listingId: string) => {
      const product = products.find((p) => p.listing_id === listingId);
      const service = services.find((s) => s.listing_id === listingId);

      if (product) {
        return {
          listing_type: "product",
          time_info: {
            type: "delivery",
            min: product.delivery_time_min,
            max: product.delivery_time_max,
            unit: "days",
          },
          availability_info: {
            type: "product",
            quantity: product.stock_quantity,
            available: product.stock_quantity > 0,
          },
        };
      }

      if (service) {
        return {
          listing_type: "service",
          time_info: {
            type: "completion",
            min: service.completion_time_min,
            max: service.completion_time_max,
            unit: service.completion_time_unit,
          },
          availability_info: {
            type: "service",
            availability: service.availability,
            service_type: service.service_type,
          },
        };
      }

      return {
        listing_type: "unknown",
        time_info: null,
        availability_info: null,
      };
    };

    // Process listings
    const processedListings = baseListings.map((listing) => {
      const { listing_type, time_info, availability_info } =
        getTimeAndAvailabilityInfo(listing.id);

      return {
        id: listing.id,
        name: listing.name,
        slug: listing.slug,
        category: {
          id: listing.categories.id,
          name: listing.categories.name,
          slug: listing.categories.slug,
        },
        description: listing.description,
        short_description: listing.short_description,
        base_price: listing.base_price,
        discounted_price: listing.discounted_price,
        currency: listing.currency,
        location: listing.location,
        district: listing.district,
        province: listing.province,
        featured: listing.featured,
        views_count: listing.views_count,
        created_at: listing.created_at,
        primary_image: getPrimaryImage(listing.id),
        seller: {
          id: listing.sellers.id,
          business_name: listing.sellers.business_name,
          is_verified: listing.sellers.is_verified,
          rating: listing.sellers.rating,
          total_reviews: listing.sellers.total_reviews,
          district: listing.sellers.district,
          province: listing.sellers.province,
        },
        review_summary: getReviewSummary(listing.id),
        time_info,
        availability_info,
        listing_type,
      };
    });

    res.json({
      listings: processedListings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: processedListings.length,
      },
      date_range: {
        days_back: Number(days_back),
        from_date: daysAgo.toISOString(),
        to_date: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Error fetching new arrivals:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { data: categories, error } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("name", { ascending: true });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ categories: categories || [] });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getListingDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { idOrSlug } = req.params;
    const isUUID = /^[0-9a-fA-F\-]{36}$/.test(idOrSlug);

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select(
        `
        *,
        sellers!inner (
          id,
          business_name,
          business_type,
          description,
          logo_url,
          rating,
          total_reviews,
          total_sales,
          location,
          district,
          province,
          contact_email,
          contact_phone,
          whatsapp_number,
          is_verified,
          created_at
        ),
        products (
          id,
          sku,
          stock_quantity,
          weight,
          dimensions,
          delivery_available,
          delivery_time_min,
          delivery_time_max,
          delivery_cost,
          shipping_required
        ),
        categories!inner (id, name, slug),
        services (
          id,
          service_pricing_type_id,
          minimum_order_amount,
          completion_time_min,
          completion_time_max,
          completion_time_unit,
          service_type,
          travel_required,
          travel_cost,
          service_radius_km,
          estimated_duration_hours,
          availability_schedule,
          advance_booking_required,
          advance_booking_days
        )
      `
      )
      .eq(isUUID ? "id" : "slug", idOrSlug)
      .single();

    if (listingError || !listing) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }

    // Helper to get time and availability info for a single listing
    const getTimeAndAvailabilityInfo = (listing: any) => {
      if (listing.products && listing.products.length > 0) {
        const product = listing.products[0];
        return {
          listing_type: "product",
          time_info: {
            type: "delivery",
            min: product.delivery_time_min,
            max: product.delivery_time_max,
            unit: "days",
          },
          availability_info: {
            type: "product",
            quantity: product.stock_quantity,
            available: product.stock_quantity > 0,
          },
        };
      }

      if (listing.services && listing.services.length > 0) {
        const service = listing.services[0];
        return {
          listing_type: "service",
          time_info: {
            type: "completion",
            min: service.completion_time_min,
            max: service.completion_time_max,
            unit: service.completion_time_unit,
          },
          availability_info: {
            type: "service",
            availability: service.availability,
            service_type: service.service_type,
          },
        };
      }

      return {
        listing_type: "unknown",
        time_info: null,
        availability_info: null,
      };
    };

    const { listing_type, time_info, availability_info } =
      getTimeAndAvailabilityInfo(listing);

    // Get images for this listing
    const { data: images, error: imageError } = await supabase
      .from("listing_images")
      .select(
        `
        id,
        image_url,
        alt_text,
        caption,
        thumbnail_url,
        medium_url,
        large_url,
        display_order,
        is_primary,
        file_size,
        mime_type,
        width,
        height
      `
      )
      .eq("listing_id", listing.id)
      .eq("status", "active")
      .order("display_order", { ascending: true });

    if (imageError) {
      res.status(500).json({ error: imageError.message });
      return;
    }

    // Get reviews for this listing
    const { data: reviews, error: reviewError } = await supabase
      .from("reviews")
      .select(
        `
        id,
        rating,
        title,
        comment,
        review_type,
        service_quality_rating,
        communication_rating,
        timeliness_rating,
        is_verified_purchase,
        helpful_count,
        created_at,
        users!inner (
          id,
          first_name,
          last_name
        )
      `
      )
      .eq("listing_id", listing.id)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (reviewError) {
      res.status(500).json({ error: reviewError.message });
      return;
    }

    // Calculate review statistics
    const totalReviews = reviews?.length || 0;
    const avgRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    // Rating distribution
    const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: reviews?.filter((r) => r.rating === rating).length || 0,
    }));

    // Update view count
    await supabase
      .from("listings")
      .update({ views_count: listing.views_count + 1 })
      .eq("id", listing.id);

    res.json({
      ...listing,
      listing_type,
      time_info,
      availability_info,
      images: images || [],
      review_summary: {
        total: totalReviews,
        average: Number(avgRating.toFixed(2)),
        distribution: ratingDistribution,
      },
      reviews:
        reviews?.map((review) => ({
          id: review.id,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          review_type: review.review_type,
          service_quality_rating: review.service_quality_rating,
          communication_rating: review.communication_rating,
          timeliness_rating: review.timeliness_rating,
          is_verified_purchase: review.is_verified_purchase,
          helpful_count: review.helpful_count,
          created_at: review.created_at,
        })) || [],
    });
  } catch (err) {
    console.error("Error fetching listing details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
