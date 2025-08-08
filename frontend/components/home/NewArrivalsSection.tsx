"use client";
import { useEffect, useState } from "react";
import { Clock, ArrowRight, Package, Wrench } from "lucide-react";
import Link from "next/link";
import { Listing } from "@/types";
import ProductCard from "../common/ProductCard";

const NewArrivalsSection = () => {
  const [newArrivals, setNewArrivals] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/listings/new-arrivals?days_back=7&limit=8"
        );
        const data = await response.json();
        setNewArrivals(data.listings || []);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
        setNewArrivals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-32 h-8 bg-gray-300 animate-pulse rounded mx-auto mb-4"></div>
            <div className="w-64 h-4 bg-gray-200 animate-pulse rounded mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 animate-pulse border border-gray-200"
              >
                <div className="aspect-square bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-100 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (newArrivals.length === 0) {
    return null; // Don't show section if no new arrivals
  }

  return (
    <section className="py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Clock className="w-6 h-6 text-gray-700" />
            </div>
            <h2 className="text-3xl font-light text-gray-900">New Arrivals</h2>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover the latest products and services added to our marketplace
            this week
          </p>
          <div className="w-16 h-px bg-black mx-auto mt-6"></div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center space-x-8 mt-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Package className="w-4 h-4 text-gray-500" />
              <span>Fresh Products</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Wrench className="w-4 h-4 text-gray-500" />
              <span>New Services</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>Last 7 Days</span>
            </div>
          </div>
        </div>

        {/* New Arrivals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {newArrivals.map((listing) => (
            <ProductCard key={listing.id} listing={listing} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/new-arrivals"
            className="inline-flex items-center space-x-2 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;
