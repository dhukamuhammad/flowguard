"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  Layers,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Filter,
} from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ProductTable from "@/components/admin/product/ProductTable";
import ProductViewModal from "@/components/admin/product/ProductViewModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import SearchableSelect from "@/components/admin/SearchableSelect";
import CustomSelect from "@/components/admin/CustomSelect";
import AdminStatFilterGrid from "@/components/admin/AdminStatFilterGrid";
import {
  DEFAULT_PAGE_SIZE,
  paginateItems,
} from "@/components/admin/AdminPagination";
import { notify } from "@/components/common/AppToaster";
import {
  fetchAdminData,
  getCachedAdminData,
  invalidateAdminCache,
} from "@/lib/adminCache";

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";

  const cachedProd = getCachedAdminData("/api/products");
  const cachedCat = getCachedAdminData("/api/categories");
  const hasCache = Boolean(cachedProd && cachedCat);

  const [products, setProducts] = useState(cachedProd?.products || []);
  const [categories, setCategories] = useState(cachedCat?.categories || []);
  const [loading, setLoading] = useState(!hasCache);
  const [pageError, setPageError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // View, Toggle & Delete state
  const [togglingId, setTogglingId] = useState(null);
  const [productToView, setProductToView] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        const [prodData, catData] = await Promise.all([
          fetchAdminData("/api/products"),
          fetchAdminData("/api/categories"),
        ]);

        if (!active) return;

        if (!prodData || !prodData.success) {
          throw new Error(prodData?.error || "Failed to load products.");
        }

        setPageError("");
        setProducts(prodData.products || []);
        setCategories(catData?.success ? catData.categories || [] : []);
      } catch (err) {
        if (!active) return;
        setPageError(err.message || "Unable to load product inventory.");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();
    return () => {
      active = false;
    };
  }, []);

  const handleToggleStatus = async (item) => {
    if (togglingId === item.id) return;

    const previousStatus = Number(item.status);
    const nextStatus = previousStatus === 1 ? 0 : 1;

    setTogglingId(item.id);
    setPageError("");
    setProducts((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, status: nextStatus } : p))
    );

    try {
      const res = await fetch(`/api/products/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update product status.");
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === item.id ? data.product : p))
      );
      invalidateAdminCache("products");
      notify.success(
        `"${item.title}" is now ${nextStatus === 1 ? "ON (Active)" : "OFF (Hidden)"}`
      );
    } catch (err) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, status: previousStatus } : p
        )
      );
      const msg = err.message || "Status update failed.";
      setPageError(msg);
      notify.error(msg);
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete || isDeleting) return;

    try {
      setIsDeleting(true);
      setPageError("");

      const res = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete product.");
      }

      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      invalidateAdminCache("products");
      notify.success(`Product "${productToDelete.title}" deleted`);
      setProductToDelete(null);
    } catch (err) {
      const msg = err.message || "Unable to delete product.";
      setPageError(msg);
      notify.error(msg);
      setProductToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.title?.toLowerCase().includes(q) ||
      p.slug?.toLowerCase().includes(q) ||
      p.categories?.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q);

    const matchesCategory =
      categoryFilter === "ALL" ||
      String(p.category_id) === String(categoryFilter);

    const matchesStatus =
      statusFilter === "ALL" || Number(p.status) === Number(statusFilter);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const {
    paginatedItems: paginatedProducts,
    safePage,
    totalPages,
    totalItems,
    startIndex,
    showingFrom,
    showingTo,
  } = paginateItems(filteredProducts, currentPage, pageSize);

  const activeCount = products.filter((p) => Number(p.status) === 1).length;
  const inactiveCount = products.filter((p) => Number(p.status) === 0).length;

  const statFilterItems = [
    {
      id: "all",
      label: "Total Seals",
      value: products.length,
      icon: Package,
      active: statusFilter === "ALL" && categoryFilter === "ALL",
      iconBoxClass: "bg-red-50 border-red-100 text-[#E53935]",
      onClick: () => {
        setStatusFilter("ALL");
        setCategoryFilter("ALL");
        setCurrentPage(1);
      },
    },
    {
      id: "active",
      label: "Active (ON)",
      value: activeCount,
      valueClass: "text-emerald-600",
      icon: CheckCircle2,
      active: statusFilter === "1",
      iconBoxClass: "bg-emerald-50 border-emerald-200 text-emerald-600",
      onClick: () => {
        setStatusFilter("1");
        setCurrentPage(1);
      },
    },
    {
      id: "inactive",
      label: "Inactive (OFF)",
      value: inactiveCount,
      valueClass: "text-gray-500",
      icon: Clock,
      active: statusFilter === "0",
      iconBoxClass: "bg-gray-100 border-gray-200 text-gray-500",
      onClick: () => {
        setStatusFilter("0");
        setCurrentPage(1);
      },
    },
    {
      id: "categories",
      label: "Categories",
      value: categories.length,
      subLabel: categoryFilter !== "ALL" ? "Reset filter" : "All groups",
      icon: Layers,
      active: categoryFilter !== "ALL",
      iconBoxClass: "bg-gray-50 border-gray-200 text-gray-700",
      onClick: () => {
        setCategoryFilter("ALL");
        setCurrentPage(1);
      },
    },
  ];

  return (
    <>
      <AdminNavbar title="Product Management" />

      <main className="lg:flex-1 lg:min-h-0 flex flex-col p-4 sm:p-5 max-w-7xl w-full mx-auto gap-3.5 lg:overflow-hidden font-roboto">
        {/* Compact Clickable Filter Cards */}
        <AdminStatFilterGrid items={statFilterItems} />

        {/* Error Notification Banner */}
        {pageError && (
          <div className="flex-shrink-0 flex items-center justify-between gap-3 px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-[6px] text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{pageError}</span>
            </div>
            <button
              onClick={() => setPageError("")}
              className="text-red-500 hover:text-red-700 cursor-pointer"
              aria-label="Dismiss error"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Action & Filter Bar */}
        <div className="flex-shrink-0 bg-white p-3 sm:p-3.5 border border-gray-200 rounded-[6px] shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by seal title, slug, category..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-300 rounded-[6px] text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#E53935] transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <SearchableSelect
              options={[
                { value: "ALL", label: "All Categories" },
                ...categories.map((c) => ({
                  value: String(c.id),
                  label: c.title,
                  badge: Number(c.status) === 0 ? "OFF" : "",
                })),
              ]}
              value={categoryFilter}
              onChange={(val) => {
                setCategoryFilter(val);
                setCurrentPage(1);
              }}
              placeholder="All Categories"
              searchPlaceholder="Search category..."
              className="w-52"
            />

            <CustomSelect
              prefixIcon={Filter}
              menuMinWidth={175}
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
              ariaLabel="Filter products by status"
              options={[
                { value: "ALL", label: "All Status" },
                {
                  value: "1",
                  label: "Active Only (ON)",
                  dotClass: "bg-emerald-500",
                },
                {
                  value: "0",
                  label: "Inactive Only (OFF)",
                  dotClass: "bg-gray-400",
                },
              ]}
            />

            <Link
              href="/admin/product/addproduct"
              prefetch={true}
              className="flex items-center gap-1.5 bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-[6px] shadow-xs transition-all ml-auto"
            >
              <Plus size={15} />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Table View */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-[6px] p-16 text-center shadow-xs lg:flex-1 lg:min-h-0 flex flex-col items-center justify-center">
            <div className="w-7 h-7 border-2 border-[#E53935] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Loading Flow Guard Seal Inventory...
            </p>
          </div>
        ) : (
          <ProductTable
            products={paginatedProducts}
            startIndex={startIndex}
            pagination={{
              totalItems,
              currentPage: safePage,
              totalPages,
              pageSize,
              showingFrom,
              showingTo,
              onPageChange: setCurrentPage,
              onPageSizeChange: (nextSize) => {
                setPageSize(nextSize);
                setCurrentPage(1);
              },
            }}
            togglingId={togglingId}
            onToggleStatus={handleToggleStatus}
            onView={(item) => setProductToView(item)}
            onDelete={(item) => setProductToDelete(item)}
          />
        )}

        {/* Quick View Product Modal */}
        <ProductViewModal
          product={productToView}
          onClose={() => setProductToView(null)}
        />

        {/* Common Reusable Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={Boolean(productToDelete)}
          onClose={() => setProductToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Product?"
          itemName={productToDelete?.title}
          isDeleting={isDeleting}
        />
      </main>
    </>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<AdminNavbar title="Product Management" />}>
      <AdminProductsContent />
    </Suspense>
  );
}
