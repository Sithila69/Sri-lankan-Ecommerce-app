"use client";
import { useSearchParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Breadcrumb from "@/components/common/Breadcrumb";
import ItemNotFound from "@/components/common/ItemNotFound";

const ItemNotFoundPage = () => {
  const searchParams = useSearchParams();

  const type = searchParams.get("type") as "product" | "service" | null;
  const category = searchParams.get("category");
  const itemName = searchParams.get("name");
  const reason = searchParams.get("reason") as
    | "not_found"
    | "removed"
    | "unavailable"
    | null;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb />
        <ItemNotFound
          type={type || undefined}
          category={category || undefined}
          itemName={itemName || undefined}
          reason={reason || "not_found"}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ItemNotFoundPage;
