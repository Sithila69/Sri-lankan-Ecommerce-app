"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import {
  Package,
  Upload,
  MapPin,
  DollarSign,
  FileText,
  Settings,
  ChevronRight,
  ChevronLeft,
  Save,
  Eye,
  AlertCircle,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ProductFormData {
  // Listing data
  name: string;
  slug: string;
  description: string;
  short_description: string;
  base_price: string;
  discounted_price: string;
  currency: string;
  location: string;
  district: string;
  province: string;
  category_id: string;
  status: string;
  featured: boolean;
  meta_title: string;
  meta_description: string;

  // Product-specific data
  sku: string;
  stock_quantity: string;
  weight: string;
  dimensions: string;
  delivery_available: boolean;
  delivery_time_min: string;
  delivery_time_max: string;
  delivery_cost: string;
  shipping_required: boolean;

  // Images
  images: File[];
  primary_image_index: number;
}

const districts = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Moneragala",
  "Ratnapura",
  "Kegalle",
];

const provinces = [
  "Western",
  "Central",
  "Southern",
  "Northern",
  "Eastern",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa",
];

const AddProductPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    base_price: "",
    discounted_price: "",
    currency: "LKR",
    location: "",
    district: "",
    province: "",
    category_id: "",
    status: "draft",
    featured: false,
    meta_title: "",
    meta_description: "",
    sku: "",
    stock_quantity: "",
    weight: "",
    dimensions: "",
    delivery_available: true,
    delivery_time_min: "",
    delivery_time_max: "",
    delivery_cost: "",
    shipping_required: true,
    images: [],
    primary_image_index: 0,
  });

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/categories/type/product"
        );
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Generate slug from name
  useEffect(() => {
    if (formData.name && !formData.slug) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name]);

  // Auto-generate meta title from name
  useEffect(() => {
    if (formData.name && !formData.meta_title) {
      setFormData((prev) => ({ ...prev, meta_title: formData.name }));
    }
  }, [formData.name]);

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      primary_image_index:
        prev.primary_image_index === index
          ? 0
          : prev.primary_image_index > index
          ? prev.primary_image_index - 1
          : prev.primary_image_index,
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Basic Information
        if (!formData.name.trim()) newErrors.name = "Product name is required";
        if (!formData.category_id)
          newErrors.category_id = "Category is required";
        if (!formData.short_description.trim())
          newErrors.short_description = "Short description is required";
        if (!formData.description.trim())
          newErrors.description = "Description is required";
        break;

      case 2: // Pricing & Location
        if (!formData.base_price || parseFloat(formData.base_price) <= 0) {
          newErrors.base_price = "Valid base price is required";
        }
        if (
          formData.discounted_price &&
          parseFloat(formData.discounted_price) >=
            parseFloat(formData.base_price)
        ) {
          newErrors.discounted_price =
            "Discounted price must be less than base price";
        }
        if (!formData.location.trim())
          newErrors.location = "Location is required";
        if (!formData.district) newErrors.district = "District is required";
        if (!formData.province) newErrors.province = "Province is required";
        break;

      case 3: // Product Details
        if (!formData.sku.trim()) newErrors.sku = "SKU is required";
        if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) {
          newErrors.stock_quantity = "Valid stock quantity is required";
        }
        break;

      case 4: // Images
        if (formData.images.length === 0) {
          newErrors.images = "At least one product image is required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (status: "draft" | "active") => {
    if (!validateStep(4)) return;

    setIsLoading(true);
    try {
      const submitData = new FormData();

      // Add listing data
      submitData.append("name", formData.name);
      submitData.append("slug", formData.slug);
      submitData.append("description", formData.description);
      submitData.append("short_description", formData.short_description);
      submitData.append("base_price", formData.base_price);
      if (formData.discounted_price) {
        submitData.append("discounted_price", formData.discounted_price);
      }
      submitData.append("currency", formData.currency);
      submitData.append("location", formData.location);
      submitData.append("district", formData.district);
      submitData.append("province", formData.province);
      submitData.append("category_id", formData.category_id);
      submitData.append("status", status);
      submitData.append("featured", formData.featured.toString());
      submitData.append("meta_title", formData.meta_title);
      submitData.append("meta_description", formData.meta_description);

      // Add product data
      submitData.append("sku", formData.sku);
      submitData.append("stock_quantity", formData.stock_quantity);
      if (formData.weight) submitData.append("weight", formData.weight);
      if (formData.dimensions)
        submitData.append("dimensions", formData.dimensions);
      submitData.append(
        "delivery_available",
        formData.delivery_available.toString()
      );
      if (formData.delivery_time_min)
        submitData.append("delivery_time_min", formData.delivery_time_min);
      if (formData.delivery_time_max)
        submitData.append("delivery_time_max", formData.delivery_time_max);
      if (formData.delivery_cost)
        submitData.append("delivery_cost", formData.delivery_cost);
      submitData.append(
        "shipping_required",
        formData.shipping_required.toString()
      );

      // Add images
      formData.images.forEach((image, index) => {
        submitData.append("images", image);
        if (index === formData.primary_image_index) {
          submitData.append("primary_image_index", index.toString());
        }
      });

      const response = await fetch("http://localhost:8080/products", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/seller/products/${result.id}`);
      } else {
        throw new Error("Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setErrors({ submit: "Failed to create product. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      number: 1,
      title: "Basic Information",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      number: 2,
      title: "Pricing & Location",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      number: 3,
      title: "Product Details",
      icon: <Package className="w-5 h-5" />,
    },
    { number: 4, title: "Images", icon: <Upload className="w-5 h-5" /> },
    { number: 5, title: "Review & Publish", icon: <Eye className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Add New Product
          </h1>
          <p className="text-gray-600">
            Create a new product listing for your store
          </p>
          <div className="w-16 h-px bg-black mt-4"></div>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center space-x-3 ${
                    step.number === currentStep
                      ? "text-black"
                      : step.number < currentStep
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      step.number === currentStep
                        ? "border-black bg-black text-white"
                        : step.number < currentStep
                        ? "border-green-600 bg-green-600 text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {step.number < currentStep ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-medium">{step.title}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-gray-400 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-gray-900 mb-6">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="product-url-slug"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Auto-generated from product name
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      handleInputChange("category_id", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.category_id}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    value={formData.short_description}
                    onChange={(e) =>
                      handleInputChange("short_description", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Brief description for product cards"
                    maxLength={160}
                  />
                  {errors.short_description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.short_description}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Detailed product description"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Pricing & Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-gray-900 mb-6">
                Pricing & Location
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Price (LKR) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.base_price}
                    onChange={(e) =>
                      handleInputChange("base_price", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="0.00"
                  />
                  {errors.base_price && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.base_price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discounted Price (LKR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discounted_price}
                    onChange={(e) =>
                      handleInputChange("discounted_price", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="0.00"
                  />
                  {errors.discounted_price && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.discounted_price}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="City or area name"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) =>
                      handleInputChange("district", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select district</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.district}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Province *
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) =>
                      handleInputChange("province", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select province</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                  {errors.province && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.province}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={() => handleSubmit("draft")}
                  disabled={isLoading}
                  className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save as Draft</span>
                </button>
                <button
                  onClick={() => handleSubmit("active")}
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-black text-white px-6 py-3 hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Publish Product</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {errors.submit && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{errors.submit}</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AddProductPage;
