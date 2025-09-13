import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FilterType, ListingsFilters, SortOption } from "@/types/listings";
import { urlUtils } from "@/utils/urlUtils";

export const useListingsFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<ListingsFilters>({
    type: "all",
    category: "all",
    sort: "newest",
  });

  const [showFilters, setShowFilters] = useState(false);

  // Initialize filters from URL on mount
  useEffect(() => {
    const urlFilters = urlUtils.parseFiltersFromUrl(searchParams);
    setFilters(urlFilters);
  }, [searchParams]);

  // Update URL when filters change
  const updateFilters = (newFilters: Partial<ListingsFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    const newUrl = urlUtils.buildUrlFromFilters(updatedFilters);
    router.push(newUrl, { scroll: false });

    // Close filter dropdown if category changed
    if (newFilters.category !== undefined) {
      setShowFilters(false);
    }
  };

  const handleTypeChange = (type: FilterType) => {
    updateFilters({ type });
  };

  const handleCategoryChange = (category: string) => {
    updateFilters({ category });
  };

  const handleSortChange = (sort: SortOption) => {
    updateFilters({ sort });
  };

  return {
    filters,
    showFilters,
    setShowFilters,
    handleTypeChange,
    handleCategoryChange,
    handleSortChange,
  };
};
