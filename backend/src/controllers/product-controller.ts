import { Request, Response } from "express";
import { supabase } from "../supabase";
import { ListingFilters, PaginationParams } from "../types";

export const getProductsByCategory = async (
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
      in_stock,
      page = 1,
      limit = 20,
    } = req.query as ListingFilters & PaginationParams;

    const offset = (Number(page) - 1) * Number(limit);

    // Build base query
    let query = supabase
      .from("products")
      .select(
        `
        id,
        sku,
        stock_quantity,
        weight,
        dimensions,
        delivery_available,
        delivery_time_min,
        delivery_time_max,
        delivery_cost,
        shipping_required,
        listings!inner(
          id,
          name,
          slug,
          description,
          short_description,
          base_price,
          discounted_price,
          currency,
          location,
          district,
          province,
          featured,
          views_count,
          status,
          category_id,
          seller_id,
          created_at,
          sellers!inner(
            id, 
            business_name, 
            is_verified, 
            rating, 
            total_reviews, 
            district, 
            province
          ),
          categories!inner(
            id, 
            name, 
            slug
          )
        )
      `
      )
      .eq("listings.status", status)
      .range(offset, offset + Number(limit) - 1)
      .order("created_at", { ascending: false, foreignTable: "listings" });

    // Filter by category if not "all"
    if (categorySlug !== "all") {
      query = query.eq("listings.categories.slug", categorySlug);
    }

    // Apply other filters
    if (district) query = query.eq("listings.district", district);
    if (province) query = query.eq("listings.province", province);
    if (min_price) query = query.gte("listings.base_price", min_price);
    if (max_price) query = query.lte("listings.base_price", max_price);
    if (featured) query = query.eq("listings.featured", featured);
    if (in_stock) query = query.gt("stock_quantity", 0);
    if (search) {
      query = query.or(
        `listings.name.ilike.%${search}%, listings.description.ilike.%${search}%`
      );
    }

    const { data: baseProducts, error: baseError } = await query;
    if (baseError) {
      res.status(500).json({ error: baseError.message });
      return;
    }
    if (!baseProducts || baseProducts.length === 0) {
      res.json({
        products: [],
        pagination: { page: Number(page), limit: Number(limit), total: 0 },
      });
      return;
    }

    const listingIds = baseProducts.map((p) => {
      const listing = Array.isArray(p.listings) ? p.listings[0] : p.listings;
      return listing.id;
    });

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

    // Process products
    const processedProducts = baseProducts
      .map((product) => {
        const listing = Array.isArray(product.listings)
          ? product.listings[0]
          : product.listings;

        if (!listing) return null;

        const categoryData = Array.isArray(listing.categories)
          ? listing.categories[0]
          : listing.categories;
        const sellerData = Array.isArray(listing.sellers)
          ? listing.sellers[0]
          : listing.sellers;

        const stockQuantity = product.stock_quantity || 0;
        const isAvailable = stockQuantity > 0;

        return {
          id: listing.id,
          name: listing.name,
          slug: listing.slug,
          category: {
            id: categoryData?.id,
            name: categoryData?.name,
            slug: categoryData?.slug,
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
            id: sellerData?.id,
            business_name: sellerData?.business_name,
            is_verified: sellerData?.is_verified,
            rating: sellerData?.rating,
            total_reviews: sellerData?.total_reviews,
            district: sellerData?.district,
            province: sellerData?.province,
          },
          review_summary: getReviewSummary(listing.id),
          product_details: {
            id: product.id,
            sku: product.sku,
            stock_quantity: stockQuantity,
            weight: product.weight,
            dimensions: product.dimensions,
            delivery_available: product.delivery_available,
            delivery_cost: product.delivery_cost,
            shipping_required: product.shipping_required,
          },
          time_info: {
            type: "delivery",
            min: product.delivery_time_min,
            max: product.delivery_time_max,
            unit: "days",
          },
          availability_info: {
            type: "product",
            quantity: stockQuantity,
            available: isAvailable,
            in_stock: isAvailable,
          },
          listing_type: "product",
        };
      })
      .filter(Boolean);

    res.json({
      products: processedProducts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: processedProducts.length,
      },
    });
  } catch (err) {
    console.error("Error fetching products by category:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllProducts = async (
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
      in_stock,
      page = 1,
      limit = 20,
    } = req.query as ListingFilters & PaginationParams;

    const offset = (Number(page) - 1) * Number(limit);

    // Start from products table and join with listings
    // This ensures we only get listings that have product records
    let query = supabase
      .from("products")
      .select(
        `
        id,
        sku,
        stock_quantity,
        weight,
        dimensions,
        delivery_available,
        delivery_time_min,
        delivery_time_max,
        delivery_cost,
        shipping_required,
        listings!inner(
          id,
          name,
          slug,
          description,
          short_description,
          base_price,
          discounted_price,
          currency,
          location,
          district,
          province,
          featured,
          views_count,
          status,
          category_id,
          seller_id,
          created_at,
          sellers!inner(
            id, 
            business_name, 
            is_verified, 
            rating, 
            total_reviews, 
            district, 
            province
          ),
          categories!inner(
            id, 
            name, 
            slug
          )
        )
      `
      )
      .eq("listings.status", status)
      .range(offset, offset + Number(limit) - 1)
      .order("created_at", { ascending: false, foreignTable: "listings" });

    // Apply filters - note the "listings." prefix for listing-related filters
    if (category_id) query = query.eq("listings.category_id", category_id);
    if (district) query = query.eq("listings.district", district);
    if (province) query = query.eq("listings.province", province);
    if (min_price) query = query.gte("listings.base_price", min_price);
    if (max_price) query = query.lte("listings.base_price", max_price);
    if (featured) query = query.eq("listings.featured", featured);
    if (in_stock) query = query.gt("stock_quantity", 0);
    if (search) {
      query = query.or(
        `listings.name.ilike.%${search}%, listings.description.ilike.%${search}%`
      );
    }

    const { data: baseProducts, error: baseError } = await query;

    console.log("Query result:", {
      baseProducts: baseProducts?.slice(0, 2),
      baseError,
      count: baseProducts?.length,
    });

    if (baseError) {
      console.error("Database error:", baseError);
      res.status(500).json({ error: baseError.message });
      return;
    }

    if (!baseProducts || baseProducts.length === 0) {
      res.json({
        products: [],
        pagination: { page: Number(page), limit: Number(limit), total: 0 },
      });
      return;
    }

    const listingIds = baseProducts.map((p) => {
      const listing = Array.isArray(p.listings) ? p.listings[0] : p.listings;
      return listing.id;
    });

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

    // ------------- Final products construction ---------------
    const processedProducts = baseProducts
      .map((product) => {
        const listing = Array.isArray(product.listings)
          ? product.listings[0]
          : product.listings;

        if (!listing) return null;

        const categoryData = Array.isArray(listing.categories)
          ? listing.categories[0]
          : listing.categories;
        const sellerData = Array.isArray(listing.sellers)
          ? listing.sellers[0]
          : listing.sellers;

        console.log(`Processing product ${product.id}:`, {
          productData: product,
          stockQuantity: product.stock_quantity,
        });

        const stockQuantity = product.stock_quantity || 0;
        const isAvailable = stockQuantity > 0;

        return {
          id: listing.id, // Use listing ID as the main ID
          name: listing.name,
          slug: listing.slug,
          category: {
            id: categoryData?.id,
            name: categoryData?.name,
            slug: categoryData?.slug,
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
            id: sellerData?.id,
            business_name: sellerData?.business_name,
            is_verified: sellerData?.is_verified,
            rating: sellerData?.rating,
            total_reviews: sellerData?.total_reviews,
            district: sellerData?.district,
            province: sellerData?.province,
          },
          review_summary: getReviewSummary(listing.id),
          product_details: {
            id: product.id,
            sku: product.sku,
            stock_quantity: stockQuantity,
            weight: product.weight,
            dimensions: product.dimensions,
            delivery_available: product.delivery_available,
            delivery_cost: product.delivery_cost,
            shipping_required: product.shipping_required,
          },
          time_info: {
            type: "delivery",
            min: product.delivery_time_min,
            max: product.delivery_time_max,
            unit: "days",
          },
          availability_info: {
            type: "product",
            quantity: stockQuantity,
            available: isAvailable,
            in_stock: isAvailable,
          },
          listing_type: "product",
        };
      })
      .filter(Boolean);

    res.json({
      products: processedProducts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: processedProducts.length,
      },
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
