"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Filter,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Clock,
  Package,
} from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import StatusToggle from "@/components/admin/StatusToggle";
import AdminStatFilterGrid from "@/components/admin/AdminStatFilterGrid";
import CustomSelect from "@/components/admin/CustomSelect";
import AdminPagination, {
  DEFAULT_PAGE_SIZE,
  paginateItems,
} from "@/components/admin/AdminPagination";
import { formatShortDate } from "@/lib/utils";
import { notify } from "@/components/common/AppToaster";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Add / Edit modal state (Title only; status defaults to 1 in DB)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [titleInput, setTitleInput] = useState("");
  const [modalError, setModalError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Toggle & Delete state
  const [togglingId, setTogglingId] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to load categories.");
        }
        setPageError("");
        setCategories(data.categories || []);
      } catch (err) {
        if (!active) return;
        setPageError(err.message || "Unable to connect to database.");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchCategories();
    return () => {
      active = false;
    };
  }, []);

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = cat.title
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());
    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "LINKED"
        ? (cat.products_count || 0) > 0
        : Number(cat.status) === Number(statusFilter);
    return matchesSearch && matchesStatus;
  });

  const {
    paginatedItems: paginatedCategories,
    safePage,
    totalPages,
    totalItems,
    startIndex,
    showingFrom,
    showingTo,
  } = paginateItems(filteredCategories, currentPage, pageSize);

  const handleOpenAdd = () => {
    setCategoryToEdit(null);
    setTitleInput("");
    setModalError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setCategoryToEdit(cat);
    setTitleInput(cat.title);
    setModalError("");
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const trimmed = titleInput.trim();
    if (!trimmed) {
      setModalError("Please enter a category title.");
      return;
    }

    try {
      setIsSaving(true);
      setModalError("");

      const isEditing = Boolean(categoryToEdit);
      const endpoint = isEditing
        ? `/api/categories/${categoryToEdit.id}`
        : "/api/categories";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save category.");
      }

      if (isEditing) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === categoryToEdit.id ? { ...c, ...data.category } : c
          )
        );
        notify.success(`Category "${trimmed}" updated`);
      } else {
        setCategories((prev) => [...prev, data.category]);
        notify.success(`Category "${trimmed}" created`);
      }

      setIsModalOpen(false);
    } catch (err) {
      const msg = err.message || "Something went wrong.";
      setModalError(msg);
      notify.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (cat) => {
    if (togglingId === cat.id) return;

    const previousStatus = Number(cat.status);
    const nextStatus = previousStatus === 1 ? 0 : 1;

    // Optimistic UI update
    setTogglingId(cat.id);
    setPageError("");
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, status: nextStatus } : c))
    );

    try {
      const res = await fetch(`/api/categories/${cat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update status.");
      }

      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, ...data.category } : c))
      );
      notify.success(
        `"${cat.title}" is now ${nextStatus === 1 ? "ON (Active)" : "OFF (Hidden)"}`
      );
    } catch (err) {
      // Rollback on failure
      setCategories((prev) =>
        prev.map((c) =>
          c.id === cat.id ? { ...c, status: previousStatus } : c
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
    if (!categoryToDelete || isDeleting) return;

    try {
      setIsDeleting(true);
      setPageError("");

      const res = await fetch(`/api/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete category.");
      }

      setCategories((prev) =>
        prev.filter((c) => c.id !== categoryToDelete.id)
      );
      notify.success(`Category "${categoryToDelete.title}" deleted`);
      setCategoryToDelete(null);
    } catch (err) {
      const msg = err.message || "Unable to delete category.";
      setPageError(msg);
      notify.error(msg);
      setCategoryToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const activeCount = categories.filter((c) => Number(c.status) === 1).length;
  const inactiveCount = categories.filter((c) => Number(c.status) === 0).length;
  const linkedCategoriesCount = categories.filter(
    (c) => (c.products_count || 0) > 0
  ).length;
  const totalProducts = categories.reduce(
    (sum, c) => sum + (c.products_count || 0),
    0
  );

  const statFilterItems = [
    {
      id: "all",
      label: "Total Categories",
      value: categories.length,
      icon: Layers,
      active: statusFilter === "ALL",
      iconBoxClass: "bg-gray-50 border-gray-200 text-gray-700",
      onClick: () => {
        setStatusFilter("ALL");
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
      id: "linked",
      label: "Linked Products",
      value: totalProducts,
      subLabel: `${linkedCategoriesCount} cats`,
      valueClass: "text-[#E53935]",
      icon: Package,
      active: statusFilter === "LINKED",
      iconBoxClass: "bg-red-50 border-red-200 text-[#E53935]",
      onClick: () => {
        setStatusFilter("LINKED");
        setCurrentPage(1);
      },
    },
  ];

  return (
    <>
      <AdminNavbar title="Category Management" />

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
        <div className="flex-shrink-0 bg-white p-3 sm:p-3.5 border border-gray-200 rounded-[6px] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search category by title..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-300 rounded-[6px] text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#E53935] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <CustomSelect
              prefixIcon={Filter}
              menuMinWidth={190}
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
              ariaLabel="Filter categories by status"
              options={[
                { value: "ALL", label: "All Categories" },
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
                {
                  value: "LINKED",
                  label: "With Linked Products",
                  dotClass: "bg-[#E53935]",
                },
              ]}
            />

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-[6px] shadow-xs transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Categories Table (Fixed Header + Fixed Pagination, Scrolling Rows) */}
        <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden shadow-xs flex flex-col lg:flex-1 lg:min-h-0">
          {loading ? (
            <div className="py-16 lg:flex-1 flex flex-col items-center justify-center gap-2 text-gray-500 text-xs sm:text-sm">
              <Loader2 size={22} className="animate-spin text-[#E53935]" />
              <span>Loading categories from Supabase...</span>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="py-16 lg:flex-1 px-4 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-11 h-11 rounded-[6px] bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                <Layers size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {categories.length === 0
                    ? "No Categories Yet"
                    : "No Matching Categories"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {categories.length === 0
                    ? "Click 'Add Category' to create your first mechanical seal category."
                    : "Try clearing your search or status filter."}
                </p>
              </div>
              {categories.length === 0 && (
                <button
                  onClick={handleOpenAdd}
                  className="inline-flex items-center gap-1.5 bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-semibold px-4 py-2 rounded-[6px] cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add First Category</span>
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-auto lg:flex-1 lg:min-h-0">
                <table className="w-full text-left text-xs sm:text-sm text-gray-600">
                  <thead className="sticky top-0 z-10 bg-gray-50 text-gray-700 text-[11px] uppercase tracking-wider font-semibold shadow-[0_1px_0_0_#E5E7EB]">
                    <tr>
                      <th className="px-5 py-3.5 w-16">#</th>
                      <th className="px-5 py-3.5">Category Title</th>
                      <th className="px-5 py-3.5">Products</th>
                      <th className="px-5 py-3.5">Status (ON / OFF)</th>
                      <th className="px-5 py-3.5">Created Date</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedCategories.map((cat, idx) => (
                        <tr
                          key={cat.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-5 py-3.5 font-mono text-gray-400 text-xs">
                            {String(startIndex + idx + 1).padStart(2, "0")}
                          </td>

                        <td className="px-5 py-3.5">
                          <span className="font-bold text-gray-900 block text-xs sm:text-sm">
                            {cat.title}
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono mt-0.5 block">
                            ID #{cat.id}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <Link
                            href={`/admin/product?category=${cat.id}`}
                            title={`View ${cat.title} products`}
                            className="inline-block text-xs font-mono font-semibold text-gray-700 bg-gray-100 border border-gray-200 hover:border-[#E53935]/40 hover:text-[#E53935] hover:bg-red-50/40 px-2 py-0.5 rounded-[4px] transition-colors"
                          >
                            {cat.products_count || 0}{" "}
                            {(cat.products_count || 0) === 1
                              ? "product"
                              : "products"}
                          </Link>
                        </td>

                        {/* Interactive ON/OFF Toggle Switch */}
                        <td className="px-5 py-3.5">
                          <StatusToggle
                            status={cat.status}
                            disabled={togglingId === cat.id}
                            onToggle={() => handleToggleStatus(cat)}
                          />
                        </td>

                        <td className="px-5 py-3.5 text-xs text-gray-500 font-mono">
                          {formatShortDate(cat.created_at)}
                        </td>

                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEdit(cat)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-[4px] transition-colors cursor-pointer"
                              title="Edit Category"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => setCategoryToDelete(cat)}
                              className="p-1.5 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-[4px] transition-colors cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <AdminPagination
                totalItems={totalItems}
                currentPage={safePage}
                totalPages={totalPages}
                pageSize={pageSize}
                showingFrom={showingFrom}
                showingTo={showingTo}
                onPageChange={setCurrentPage}
                onPageSizeChange={(nextSize) => {
                  setPageSize(nextSize);
                  setCurrentPage(1);
                }}
              />
            </>
          )}
        </div>

        {/* Add / Edit Category Modal (Title Only — Status defaults to 1 automatically) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs font-roboto">
            <div className="relative w-full max-w-md bg-white border border-gray-300 rounded-[6px] shadow-xl overflow-hidden">
              <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#E53935]">
                    Flow Guard Category
                  </div>
                  <h3 className="text-base font-bold text-gray-900">
                    {categoryToEdit ? "Edit Category" : "Add New Category"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-black border border-gray-200 rounded-[4px] hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                {modalError && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-[6px] text-xs">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Category Title <span className="text-[#E53935]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    placeholder="e.g. Single Spring Seals"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-[6px] text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-[#E53935]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-[6px] text-xs font-semibold hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 bg-[#E53935] hover:bg-[#d32f2f] text-white rounded-[6px] text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60 inline-flex items-center gap-1.5"
                  >
                    {isSaving && <Loader2 size={13} className="animate-spin" />}
                    <span>
                      {isSaving
                        ? "Saving..."
                        : categoryToEdit
                        ? "Update Category"
                        : "Save Category"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Common Reusable Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={Boolean(categoryToDelete)}
          onClose={() => setCategoryToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Category?"
          itemName={categoryToDelete?.title}
          isDeleting={isDeleting}
        />
      </main>
    </>
  );
}
