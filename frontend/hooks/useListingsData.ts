import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Listing, ListingsFilters } from "@/types/listings";
import { listingsApi } from "@/services/listingsApi";

export const useListingsData = (filters: ListingsFilters) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch listings when filters change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await listingsApi.fetchListings(filters);
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters.type, filters.category, filters.sort]);

  return {
    listings,
    isLoading,
  };
};
