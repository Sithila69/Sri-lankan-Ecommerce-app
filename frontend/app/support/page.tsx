"use client";
import { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Breadcrumb from "@/components/common/Breadcrumb";
import {
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  User,
  Package,
  CreditCard,
  Truck,
  Shield,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
} from "lucide-react";

const SupportPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const supportCategories = [
    { id: "all", name: "All Topics", icon: <HelpCircle className="w-5 h-5" /> },
    {
      id: "account",
      name: "Account & Profile",
      icon: <User className="w-5 h-5" />,
    },
    {
      id: "orders",
      name: "Orders & Tracking",
      icon: <Package className="w-5 h-5" />,
    },
    {
      id: "payments",
      name: "Payments & Billing",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: "shipping",
      name: "Shipping & Delivery",
      icon: <Truck className="w-5 h-5" />,
    },
    {
      id: "returns",
      name: "Returns & Refunds",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: "seller",
      name: "Seller Support",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const quickActions = [
    {
      title: "Track Your Order",
      description: "Get real-time updates on your order status",
      icon: <Package className="w-8 h-8" />,
      action: "Track Order",
      href: "/orders/track",
    },
    {
      title: "Contact Support",
      description: "Get help from our customer service team",
      icon: <MessageCircle className="w-8 h-8" />,
      action: "Contact Us",
      href: "/support/contact-us",
    },
    {
      title: "Return an Item",
      description: "Start a return or exchange request",
      icon: <Shield className="w-8 h-8" />,
      action: "Start Return",
      href: "/returns",
    },
    {
      title: "Seller Center",
      description: "Manage your seller account and listings",
      icon: <Settings className="w-8 h-8" />,
      action: "Seller Portal",
      href: "/seller",
    },
  ];

  const faqData = [
    {
      id: 1,
      category: "account",
      question: "How do I create an account?",
      answer:
        "Click 'Sign Up' in the top right corner, enter your email and create a password. You'll receive a verification email to activate your account.",
    },
    {
      id: 2,
      category: "account",
      question: "I forgot my password. How can I reset it?",
      answer:
        "Click 'Forgot Password' on the login page, enter your email address, and we'll send you a password reset link.",
    },
    {
      id: 3,
      category: "orders",
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email and SMS. You can also track orders in your account dashboard under 'My Orders'.",
    },
    {
      id: 4,
      category: "orders",
      question: "Can I cancel my order?",
      answer:
        "You can cancel orders within 1 hour of placing them if they haven't been processed yet. Go to 'My Orders' and click 'Cancel Order'.",
    },
    {
      id: 5,
      category: "payments",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), bank transfers, and mobile payments like eZ Cash and mCash.",
    },
    {
      id: 6,
      category: "payments",
      question: "Is my payment information secure?",
      answer:
        "Yes, we use industry-standard SSL encryption and PCI DSS compliance to protect your payment information. We never store your full card details.",
    },
    {
      id: 7,
      category: "shipping",
      question: "How much does shipping cost?",
      answer:
        "Shipping costs vary by location and seller. You can see exact shipping costs at checkout before completing your purchase.",
    },
    {
      id: 8,
      category: "shipping",
      question: "How long does delivery take?",
      answer:
        "Delivery times vary by location: Colombo (1-2 days), Western Province (2-3 days), Other areas (3-7 days). Express delivery is available for select areas.",
    },
    {
      id: 9,
      category: "returns",
      question: "What is your return policy?",
      answer:
        "Most items can be returned within 7 days of delivery in original condition. Some categories like perishables and custom items are not returnable.",
    },
    {
      id: 10,
      category: "returns",
      question: "How do I return an item?",
      answer:
        "Go to 'My Orders', find your order, and click 'Return Item'. Follow the instructions to print a return label and schedule pickup.",
    },
    {
      id: 11,
      category: "seller",
      question: "How do I become a seller?",
      answer:
        "Visit our Seller Center and complete the registration process. You'll need to provide business documents and bank details for verification.",
    },
    {
      id: 12,
      category: "seller",
      question: "What are the seller fees?",
      answer:
        "We charge a small commission on each sale (3-8% depending on category) plus payment processing fees. No monthly subscription fees.",
    },
  ];

  const filteredFaqs =
    selectedCategory === "all"
      ? faqData
      : faqData.filter((faq) => faq.category === selectedCategory);

  const searchFilteredFaqs = searchQuery
    ? filteredFaqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredFaqs;

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const supportStats = [
    {
      label: "Average Response Time",
      value: "< 2 hours",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      label: "Customer Satisfaction",
      value: "98.5%",
      icon: <Star className="w-5 h-5" />,
    },
    {
      label: "Issues Resolved",
      value: "99.2%",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    {
      label: "Support Languages",
      value: "3",
      icon: <MessageCircle className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb />

        <div className="mt-8">
          <div className="flex items-center space-x-3 mb-4">
            <HelpCircle className="w-8 h-8 text-gray-700" />
            <h1 className="text-4xl font-light text-gray-900">
              Support Center
            </h1>
          </div>
          <div className="w-16 h-px bg-black"></div>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl">
            Find answers to your questions, get help with your orders, and learn
            how to make the most of Kadey.lk
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-16">
          <h2 className="text-2xl font-light text-gray-900 mb-8 text-center">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-gray-100 rounded-lg mb-4 group-hover:bg-gray-200 transition-colors">
                    {action.icon}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {action.description}
                  </p>
                  <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 group-hover:text-black transition-colors">
                    <span>{action.action}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Stats */}
        <div className="mt-16 bg-gray-50 border border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-light text-gray-900 mb-8 text-center">
            Our Support Promise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-3">
                  {stat.icon}
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find quick answers to the most common questions
            </p>
            <div className="w-16 h-px bg-black mx-auto mt-6"></div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {supportCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  selectedCategory === category.id
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {category.icon}
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="max-w-4xl mx-auto">
            {searchFilteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {searchFilteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white border border-gray-200 rounded-lg"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900 pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                          expandedFaq === faq.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-6 pb-6">
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or browse different categories
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Options */}
        <div className="mt-20 border-t border-gray-200 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to
              help
            </p>
            <div className="w-16 h-px bg-black mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                Live Chat
              </h3>
              <p className="text-gray-600 mb-6">
                Get instant help from our support team. Available 24/7 for
                urgent issues.
              </p>
              <button className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors font-medium rounded-lg">
                Start Chat
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                Email Support
              </h3>
              <p className="text-gray-600 mb-6">
                Send us a detailed message and we'll respond within 24 hours.
              </p>
              <button
                onClick={() => (window.location.href = "/support/contact-us")}
                className="bg-white border border-gray-300 text-gray-900 px-6 py-3 hover:border-gray-400 transition-colors font-medium rounded-lg"
              >
                Send Email
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                Phone Support
              </h3>
              <p className="text-gray-600 mb-6">
                Call us directly for immediate assistance. Mon-Fri, 8AM-6PM.
              </p>
              <button className="bg-white border border-gray-300 text-gray-900 px-6 py-3 hover:border-gray-400 transition-colors font-medium rounded-lg">
                +94 11 234 5678
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SupportPage;
