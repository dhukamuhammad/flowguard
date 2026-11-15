"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Layers,
  MessageSquareQuote,
  CheckCircle2,
  ArrowRight,
  Plus,
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw,
  Eye,
  Edit2,
} from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import InquiryDetailModal from "@/components/admin/InquiryDetailModal";
import CustomSelect from "@/components/admin/CustomSelect";
import { formatShortDate } from "@/lib/utils";
import { notify } from "@/components/common/AppToaster";
import {
  INQUIRY_STATUS_OPTIONS,
  INQUIRY_STATUS_STYLES,
  formatInquiryRef,
  updateInquiryStatusRequest,
} from "@/lib/inquiryUtils";
import {
  fetchAdminData,
  getCachedAdminData,
  invalidateAdminCache,
} from "@/lib/adminCache";

async function fetchDashboardPayload(force = false) {
  const [inqData, prodData, catData] = await Promise.all([
    fetchAdminData("/api/inquiries", { force }),
    fetchAdminData("/api/products", { force }),
    fetchAdminData("/api/categories", { force }),
  ]);

  if (!inqData?.success) {
    throw new Error(inqData?.error || "Failed to load inquiries.");
  }
  if (!prodData?.success) {
    throw new Error(prodData?.error || "Failed to load products.");
  }
  if (!catData?.success) {
    throw new Error(catData?.error || "Failed to load categories.");
  }

  return {
    inquiries: inqData.inquiries || [],
    products: prodData.products || [],
    categories: catData.categories || [],
  };
}

function shouldSkipImageOptimization(src) {
  if (typeof src !== "string") return true;
  if (src.startsWith("/")) return false;
  return !src.includes(".supabase.co");
}

export default function AdminDashboardPage() {
  const cachedInq = getCachedAdminData("/api/inquiries");
  const cachedProd = getCachedAdminData("/api/products");
  const cachedCat = getCachedAdminData("/api/categories");
  const hasCache = Boolean(cachedInq && cachedProd && cachedCat);

  const [inquiries, setInquiries] = useState(cachedInq?.inquiries || []);
  const [products, setProducts] = useState(cachedProd?.products || []);
  const [categories, setCategories] = useState(cachedCat?.categories || []);
  const [loading, setLoading] = useState(!hasCache);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let active = true;

    async function init() {
      try {
        const data = await fetchDashboardPayload();
        if (!active) return;
        setErrorMsg("");
        setInquiries(data.inquiries);
        setProducts(data.products);
        setCategories(data.categories);
      } catch (err) {
        if (!active) return;
        setErrorMsg(err.message || "Unable to fetch dashboard overview.");
      } finally {
        if (active) setLoading(false);
      }
    }

    init();
    return () => {
      active = false;
    };
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await fetchDashboardPayload(true);
      setErrorMsg("");
      setInquiries(data.inquiries);
      setProducts(data.products);
      setCategories(data.categories);
      notify.success("Dashboard synced with latest data");
    } catch (err) {
      const msg = err.message || "Failed to refresh dashboard.";
      setErrorMsg(msg);
      notify.error(msg);
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const updated = await updateInquiryStatusRequest(id, newStatus);
      invalidateAdminCache("inquiries");
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(updated);
      }
      notify.success(`Inquiry status updated to "${newStatus}"`);
    } catch (err) {
      notify.error(err.message || "Status update failed.");
    } finally {
      setUpdatingId(null);
    }
  };

  const activeProductsCount = products.filter((p) => Number(p.status) === 1).length;
  const activeCategoriesCount = categories.filter(
    (c) => Number(c.status) === 1
  ).length;
  const newInquiriesCount = inquiries.filter((i) => i.status === "New").length;
  const inProgressCount = inquiries.filter(
    (i) => i.status === "In Progress"
  ).length;
  const completedCount = inquiries.filter(
    (i) => i.status === "Completed"
  ).length;

  const emptyActiveCategoriesCount = categories.filter(
    (c) => Number(c.status) === 1 && (c.products_count || 0) === 0
  ).length;

  const totalInquiries = inquiries.length;
  const pipelinePercents = {
    New: totalInquiries ? Math.round((newInquiriesCount / totalInquiries) * 100) : 0,
    InProgress: totalInquiries
      ? Math.round((inProgressCount / totalInquiries) * 100)
      : 0,
    Completed: totalInquiries
      ? Math.round((completedCount / totalInquiries) * 100)
      : 0,
  };

  const maxCatProducts = Math.max(
    1,
    ...categories.map((c) => Number(c.products_count) || 0)
  );

  const recentCategories = categories.slice(0, 5);
  const recentInquiries = inquiries.slice(0, 5);
  const recentProducts = products.slice(0, 5);

  return (
    <>
      <AdminNavbar title="Dashboard Overview" />

      <main className="p-5 sm:p-7 max-w-7xl w-full mx-auto space-y-6 font-roboto">
        {/* Welcome Banner */}
        <div className="bg-white text-gray-900 p-6 border border-gray-200 border-l-4 border-l-[#E53935] rounded-[6px] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="inline-block bg-red-50 text-[#E53935] border border-red-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] mb-1">
              Flow Guard Administration
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A]">
              Welcome to Industrial Management
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm max-w-xl leading-relaxed">
              Manage mechanical seal technical specifications, industrial categories, operating limits, and live client quote inquiries.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap flex-shrink-0">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="flex items-center gap-1.5 whitespace-nowrap bg-white hover:bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold px-3 py-2 rounded-[6px] border border-gray-300 transition-all cursor-pointer disabled:opacity-60"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin text-[#E53935]" : ""}
              />
              <span>{refreshing ? "Syncing..." : "Refresh"}</span>
            </button>

            <Link href="/admin/category">
              <button
                type="button"
                className="flex items-center gap-1.5 whitespace-nowrap bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-[6px] border border-gray-300 transition-all cursor-pointer"
              >
                <Layers size={15} />
                <span>Categories</span>
              </button>
            </Link>

            <Link href="/admin/product/addproduct">
              <button
                type="button"
                className="flex items-center gap-1.5 whitespace-nowrap bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-[6px] shadow-xs transition-all cursor-pointer"
              >
                <Plus size={15} />
                <span>Add Product</span>
              </button>
            </Link>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[6px] text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 4 Clickable Live Executive Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/product"
            className="bg-white p-5 border border-gray-200 hover:border-[#E53935]/60 hover:shadow-sm rounded-[6px] shadow-xs flex items-center justify-between transition-all group"
          >
            <div>
              <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Total Products
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] group-hover:text-[#E53935] transition-colors mt-1 block font-mono">
                {loading ? "—" : products.length}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 mt-0.5 block">
                {loading ? "Loading..." : `${activeProductsCount} active live`}
              </span>
            </div>
            <div className="w-11 h-11 rounded-[6px] bg-red-50 border border-red-100 flex items-center justify-center text-[#E53935]">
              <Package size={20} />
            </div>
          </Link>

          <Link
            href="/admin/category"
            className="bg-white p-5 border border-gray-200 hover:border-[#E53935]/60 hover:shadow-sm rounded-[6px] shadow-xs flex items-center justify-between transition-all group"
          >
            <div>
              <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Active Categories
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] group-hover:text-[#E53935] transition-colors mt-1 block font-mono">
                {loading ? "—" : activeCategoriesCount}
              </span>
              <span className="text-[11px] font-semibold text-gray-500 mt-0.5 block">
                {loading
                  ? "Loading..."
                  : emptyActiveCategoriesCount > 0
                  ? `${categories.length} total · ${emptyActiveCategoriesCount} empty`
                  : `${categories.length} total groups`}
              </span>
            </div>
            <div className="w-11 h-11 rounded-[6px] bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700">
              <Layers size={20} />
            </div>
          </Link>

          <Link
            href="/admin/inquiries"
            className="bg-white p-5 border border-gray-200 hover:border-[#E53935]/60 hover:shadow-sm rounded-[6px] shadow-xs flex items-center justify-between transition-all group"
          >
            <div>
              <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Quote Inquiries
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-[#E53935] mt-1 block font-mono">
                {loading ? "—" : inquiries.length}
              </span>
              <span className="text-[11px] font-semibold text-amber-600 mt-0.5 block">
                {loading ? "Loading..." : `${newInquiriesCount} new pending`}
              </span>
            </div>
            <div className="w-11 h-11 rounded-[6px] bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <MessageSquareQuote size={20} />
            </div>
          </Link>

          <Link
            href="/admin/inquiries"
            className="bg-white p-5 border border-gray-200 hover:border-[#E53935]/60 hover:shadow-sm rounded-[6px] shadow-xs flex items-center justify-between transition-all group"
          >
            <div>
              <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Completed Quotes
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] group-hover:text-emerald-600 transition-colors mt-1 block font-mono">
                {loading ? "—" : completedCount}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 mt-0.5 block">
                {loading ? "Loading..." : `${inProgressCount} in progress`}
              </span>
            </div>
            <div className="w-11 h-11 rounded-[6px] bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
          </Link>
        </div>

        {/* Middle Visual Analytics Row: Inquiry Pipeline + Category Coverage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inquiry Pipeline Breakdown */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-[6px] shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                  Inquiry Pipeline
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Quote resolution workflow breakdown
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-gray-700 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-[4px]">
                {totalInquiries} Total
              </span>
            </div>

            {/* Stacked Progress Bar */}
            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
              {totalInquiries > 0 && (
                <>
                  <div
                    style={{ width: `${pipelinePercents.New}%` }}
                    className="bg-[#E53935] transition-all duration-500"
                    title={`New: ${newInquiriesCount}`}
                  />
                  <div
                    style={{ width: `${pipelinePercents.InProgress}%` }}
                    className="bg-amber-500 transition-all duration-500"
                    title={`In Progress: ${inProgressCount}`}
                  />
                  <div
                    style={{ width: `${pipelinePercents.Completed}%` }}
                    className="bg-emerald-500 transition-all duration-500"
                    title={`Completed: ${completedCount}`}
                  />
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="p-2.5 rounded-[6px] bg-red-50/70 border border-red-100">
                <span className="block text-[10px] font-bold uppercase text-[#E53935]">
                  New
                </span>
                <span className="text-lg font-bold font-mono text-gray-900">
                  {loading ? "—" : newInquiriesCount}
                </span>
              </div>
              <div className="p-2.5 rounded-[6px] bg-amber-50/70 border border-amber-100">
                <span className="block text-[10px] font-bold uppercase text-amber-700">
                  In Progress
                </span>
                <span className="text-lg font-bold font-mono text-gray-900">
                  {loading ? "—" : inProgressCount}
                </span>
              </div>
              <div className="p-2.5 rounded-[6px] bg-emerald-50/70 border border-emerald-100">
                <span className="block text-[10px] font-bold uppercase text-emerald-700">
                  Completed
                </span>
                <span className="text-lg font-bold font-mono text-gray-900">
                  {loading ? "—" : completedCount}
                </span>
              </div>
            </div>
          </div>

          {/* Category Coverage Matrix */}
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-[6px] shadow-xs p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                  Category Catalog Coverage
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Categories with 0 seals remain hidden on homepage seal range
                </p>
              </div>
              <Link
                href="/admin/category"
                prefetch={true}
                className="text-xs font-semibold text-[#E53935] hover:underline flex items-center gap-1"
              >
                <span>All Categories</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {loading ? (
              <div className="py-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Loader2 size={15} className="animate-spin text-[#E53935]" />
                <span>Analyzing categories...</span>
              </div>
            ) : categories.length === 0 ? (
              <p className="text-xs text-gray-500 py-4">
                No categories created yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {recentCategories.map((cat) => {
                  const count = Number(cat.products_count) || 0;
                  const widthPct =
                    count > 0 ? Math.max(12, Math.round((count / maxCatProducts) * 100)) : 0;
                  const isActive = Number(cat.status) === 1;

                  return (
                    <div key={cat.id} className="space-y-1">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-semibold text-gray-900 truncate">
                            {cat.title}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-[4px] border ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-gray-100 text-gray-500 border-gray-200"
                            }`}
                          >
                            {isActive ? "ON" : "OFF"}
                          </span>
                          {isActive && count === 0 && (
                            <Link
                              href="/admin/product/addproduct"
                              className="text-[10px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-[4px] transition-colors flex-shrink-0"
                            >
                              0 seals · + Add
                            </Link>
                          )}
                        </div>
                        <span className="text-[11px] font-mono font-bold text-gray-600 flex-shrink-0">
                          {count} {count === 1 ? "model" : "models"}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${widthPct}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            count > 0 ? "bg-[#E53935]" : "bg-transparent"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom 2-Column Interactive Data Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Recent Quote Inquiries */}
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-[6px] shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                  Recent Quote Inquiries
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  View message details or update status directly
                </p>
              </div>
              <Link
                href="/admin/inquiries"
                prefetch={true}
                className="text-xs font-semibold text-[#E53935] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {loading ? (
              <div className="py-14 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Loader2 size={16} className="animate-spin text-[#E53935]" />
                <span>Loading recent inquiries...</span>
              </div>
            ) : recentInquiries.length === 0 ? (
              <div className="py-14 px-6 text-center text-xs sm:text-sm text-gray-500">
                No contact inquiries received yet. Submissions from your website Contact form will appear here automatically.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-gray-600">
                  <thead className="bg-gray-50 text-gray-700 text-[11px] uppercase tracking-wider font-semibold border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentInquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-semibold text-gray-900 block text-xs sm:text-sm">
                            {inq.name}
                          </span>
                          <span className="text-[11px] text-gray-500 block">
                            {inq.company} ·{" "}
                            <span className="font-mono text-[10px]">
                              {formatInquiryRef(inq.id)}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-gray-700 font-medium line-clamp-1">
                            {inq.product}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <CustomSelect
                            variant="badge"
                            menuMinWidth={140}
                            disabled={updatingId === inq.id}
                            value={inq.status}
                            onChange={(val) => handleStatusChange(inq.id, val)}
                            ariaLabel={`Change status for ${inq.name}`}
                            options={INQUIRY_STATUS_OPTIONS}
                            buttonClassName={
                              INQUIRY_STATUS_STYLES[inq.status] ||
                              INQUIRY_STATUS_STYLES.New
                            }
                          />
                        </td>
                        <td className="px-4 py-3 text-[11px] text-gray-400 font-mono whitespace-nowrap">
                          {formatShortDate(inq.created_at)}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedInquiry(inq)}
                            title="Quick View Inquiry"
                            className="p-1.5 text-gray-600 hover:text-black border border-transparent hover:border-gray-200 rounded-[4px] transition-colors cursor-pointer"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Column: Mechanical Seals Catalog with Thumbnails & Quick Edit */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-[6px] shadow-xs overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                    Mechanical Seals Catalog
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Latest product models with quick edit
                  </p>
                </div>
                <Link
                  href="/admin/product"
                  prefetch={true}
                  className="text-xs font-semibold text-[#E53935] hover:underline flex items-center gap-1"
                >
                  <span>Manage</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {loading ? (
                <div className="py-14 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Loader2 size={16} className="animate-spin text-[#E53935]" />
                  <span>Loading catalog...</span>
                </div>
              ) : recentProducts.length === 0 ? (
                <div className="py-14 px-6 text-center text-xs text-gray-500">
                  No products added yet.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentProducts.map((p) => {
                    const thumbSrc =
                      (Array.isArray(p.images) && p.images[0]) ||
                      "/client/product/Seals.png";
                    const limitSummary = Array.isArray(p.operating_limits)
                      ? p.operating_limits
                          .slice(0, 2)
                          .map((l) => `${l.label}: ${l.value}`)
                          .join(" | ")
                      : "";
                    const isActive = Number(p.status) === 1;

                    return (
                      <div
                        key={p.id}
                        className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-10 h-10 rounded-[6px] border border-gray-200 bg-white flex-shrink-0 overflow-hidden">
                            <Image
                              src={thumbSrc}
                              alt={p.title}
                              fill
                              unoptimized={shouldSkipImageOptimization(thumbSrc)}
                              sizes="40px"
                              className="object-contain p-1"
                            />
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <span className="font-bold text-gray-900 text-xs sm:text-sm block truncate">
                              {p.title}
                            </span>
                            <span className="text-[11px] text-gray-500 block truncate">
                              {p.categories?.title || "Uncategorized"}
                            </span>
                            <span className="text-[10px] font-mono text-[#E53935] block truncate">
                              {limitSummary || `/${p.slug}`}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] border ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-gray-100 text-gray-600 border-gray-200"
                            }`}
                          >
                            {isActive ? "ON" : "OFF"}
                          </span>

                          <Link
                            href={`/admin/product/addproduct?id=${p.id}`}
                            title={`Edit ${p.title}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-[4px] transition-colors"
                          >
                            <Edit2 size={13} />
                          </Link>

                          {isActive && (
                            <Link
                              href={`/products/${p.slug}`}
                              target="_blank"
                              title={`Preview ${p.title} on site`}
                              className="p-1.5 text-gray-500 hover:text-black border border-transparent hover:border-gray-200 rounded-[4px] transition-colors"
                            >
                              <ExternalLink size={13} />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
              <Link
                href="/products"
                target="_blank"
                className="text-xs text-gray-600 hover:text-black font-semibold inline-flex items-center gap-1.5"
              >
                <span>Preview live catalog on client portal</span>
                <ExternalLink size={12} className="text-[#E53935]" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <InquiryDetailModal
        inquiry={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        onStatusChange={handleStatusChange}
        isUpdating={updatingId === selectedInquiry?.id}
      />
    </>
  );
}
