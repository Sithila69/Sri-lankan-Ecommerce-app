import { useQuery } from "@tanstack/react-query";
import { listingsApi } from "@/services/listingsApi";

export const useCategoriesData = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: listingsApi.fetchCategories,
  });
};
