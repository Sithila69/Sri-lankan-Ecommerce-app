// components/ui/Breadcrumb.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  href: string;
  current: boolean;
}

const Breadcrumb = () => {
  const pathname = usePathname(); // eg: /category/product/123
  const segments = pathname.split("/").filter(Boolean);

  const crumbs: BreadcrumbItem[] = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const name = decodeURIComponent(segment).replace(/-/g, " ");
    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      href,
      current: index === segments.length - 1,
    };
  });

  return (
    <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      {/* Desktop View - Single Line */}
      <ol className="hidden md:flex items-center flex-wrap gap-x-1 gap-y-2">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center hover:text-gray-700 transition-colors"
          >
            Home
          </Link>
        </li>
        {crumbs.map((crumb, idx) => (
          <li key={idx} className="flex items-center space-x-1">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {crumb.current ? (
              <span className="text-gray-900 font-medium">{crumb.name}</span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-gray-700 transition-colors"
              >
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>

      {/* Mobile View - Multi-line with flex wrap */}
      <div className="md:hidden">
        <ol className="flex items-center flex-wrap gap-x-1 gap-y-2">
          <li className="flex items-center">
            <Link
              href="/"
              className="flex items-center hover:text-gray-700 transition-colors"
            >
              <Home className="w-4 h-4" />
            </Link>
          </li>
          {crumbs.map((crumb, idx) => (
            <li key={idx} className="flex items-center space-x-1">
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              {crumb.current ? (
                <span className="text-gray-900 font-medium break-words">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-gray-700 transition-colors break-words"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
