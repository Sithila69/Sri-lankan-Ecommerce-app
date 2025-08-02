"use client";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import ProductsGrid from "@/components/common/ProductsGrid";
import {
  Search,
  Truck,
  Shield,
  Star,
  MapPin,
  Filter,
  Heart,
  Package,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/listings/all");
        const data = await response.json();
        setListings(data.listings);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  console.log("Listings:", listings);

  const categories = [
    { name: "Food & Beverages", count: "2,547" },
    { name: "Clothing & Fashion", count: "1,832" },
    { name: "Electronics", count: "956" },
    { name: "Home & Garden", count: "1,204" },
    { name: "Handicrafts", count: "687" },
    { name: "Services", count: "3,128" },
  ];

  const quickActions = [
    { title: "Track Order", icon: Package },
    { title: "Saved Items", icon: Heart },
    { title: "Local Stores", icon: MapPin },
    { title: "Customer Support", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-5 gap-20 items-center">
            <div className="md:col-span-3">
              <h1 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
                Everything you need,
                <br />
                <span className="font-normal">right here.</span>
              </h1>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl leading-relaxed">
                Sri Lanka's premier marketplace connecting you with local
                businesses and authentic products.
              </p>

              {/* Search Bar */}
              <div className="bg-white border border-gray-200 rounded-none p-1">
                <div className="flex flex-col md:flex-row ">
                  <div className="flex-1 relative ">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search anything..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-gray-900 border-0 focus:outline-none text-lg"
                    />
                  </div>
                  <div className="md:w-56">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full py-4 px-4 text-gray-900 border-0 border-l border-gray-200 focus:outline-none text-lg bg-white"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button className="bg-black hover:bg-gray-800 text-white px-8 py-4 font-medium text-lg cursor-pointer">
                    Search
                  </button>
                </div>
              </div>
            </div>
            <div className="hidden md:block md:col-span-2">
              <img
                src="/images/base_logo.png"
                alt="placeholder"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="flex items-center justify-center gap-3 p-6 bg-white hover:bg-gray-50 border-r border-gray-200 last:border-r-0"
              >
                <action.icon className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">
                  {action.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
      {/* Main Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Explore Our Marketplace
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover a wide range of products and services from the best local
              businesses across Sri Lanka.
            </p>
            <div className="w-16 h-px bg-black mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Products Card */}
            <Link href="/products">
              <div className="relative overflow-hidden h-96 group cursor-pointer">
                <img
                  src="https://via.placeholder.com/800x600/000000/FFFFFF?text=Products"
                  alt="A collection of various products"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center p-8">
                  <h3 className="text-4xl font-bold text-white mb-2">
                    Products
                  </h3>
                  <p className="text-lg text-gray-200 mb-4">
                    From handmade crafts to daily essentials.
                  </p>
                  <div className="bg-white text-black px-6 py-3 font-medium hover:bg-gray-200 transition-colors">
                    Shop Now
                  </div>
                </div>
              </div>
            </Link>

            {/* Services Card */}
            <Link href="/services">
              <div className="relative  overflow-hidden h-96 group cursor-pointer">
                <img
                  src="https://via.placeholder.com/800x600/333333/FFFFFF?text=Services"
                  alt="A person providing a service"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center p-8">
                  <h3 className="text-4xl font-bold text-white mb-2">
                    Services
                  </h3>
                  <p className="text-lg text-gray-200 mb-4">
                    Find professionals for every need.
                  </p>
                  <div className="bg-white text-black px-6 py-3 font-medium hover:bg-gray-200 transition-colors">
                    Explore
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">
                Fast Delivery
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Same-day delivery in Colombo. Island-wide shipping available for
                all orders.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">
                Secure Shopping
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your payments and personal data are protected with
                enterprise-grade security.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">
                Quality Assured
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every seller is verified and every product meets our quality
                standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-light text-gray-900 mb-4">Featured</h2>
            <div className="w-16 h-px bg-black"></div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-gray-900  space-x-2 bg-white border border-gray-300 px-6 py-3 hover:bg-gray-50 cursor-pointer"
          >
            <Filter className="w-4 h-4 " />
            <span>Filter</span>
          </button>
        </div>

        {showFilters && (
          <div className="text-gray-900  bg-white border border-gray-200 p-8 mb-12 ">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Category
                </label>
                <select className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black cursor-pointer">
                  <option>All Categories</option>
                  <option>Food & Beverages</option>
                  <option>Services</option>
                  <option>Clothing & Textiles</option>
                  <option>Handicrafts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Location
                </label>
                <select className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black">
                  <option>All Locations</option>
                  <option>Colombo</option>
                  <option>Kandy</option>
                  <option>Galle</option>
                  <option>Negombo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Price Range
                </label>
                <select className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black cursor-pointer">
                  <option>All Prices</option>
                  <option>Under LKR 1,000</option>
                  <option>LKR 1,000 - 5,000</option>
                  <option>LKR 5,000 - 10,000</option>
                  <option>Above LKR 10,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Rating
                </label>
                <select className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black cursor-pointer">
                  <option>All Ratings</option>
                  <option>4.5+ Stars</option>
                  <option>4.0+ Stars</option>
                  <option>3.5+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <ProductsGrid listings={listings} isLoading={isLoading} />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
