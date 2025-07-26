// components/ui/Breadcrumb.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="hover:underline text-blue-600">
            Home
          </Link>
        </li>
        {crumbs.map((crumb, idx) => (
          <li key={idx} className="flex items-center space-x-2">
            <span className="mx-1">/</span>
            {crumb.current ? (
              <span className="text-gray-700 font-medium">{crumb.name}</span>
            ) : (
              <Link href={crumb.href} className="hover:underline text-blue-600">
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
