"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Phone,
  Mail,
  Building,
  Filter,
  Eye,
  Trash2,
  Loader2,
  AlertCircle,
  MessageSquareQuote,
  Inbox,
  Clock,
  CheckCircle2,
} from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import InquiryDetailModal from "@/components/admin/InquiryDetailModal";
import AdminStatFilterGrid from "@/components/admin/AdminStatFilterGrid";
import CustomSelect from "@/components/admin/CustomSelect";
import AdminPagination, {
  DEFAULT_PAGE_SIZE,
  paginateItems,
} from "@/components/admin/AdminPagination";
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

export default function AdminInquiriesPage() {
  const cached = getCachedAdminData("/api/inquiries");
  const [inquiries, setInquiries] = useState(cached?.inquiries || []);
  const [loading, setLoading] = useState(!cached);
  const [pageError, setPageError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchInquiries() {
      try {
        const data = await fetchAdminData("/api/inquiries");
        if (!active) return;

        if (!data || !data.success) {
          throw new Error(data?.error || "Failed to load inquiries.");
        }

        setPageError("");
        setInquiries(data.inquiries || []);
      } catch (err) {
        if (!active) return;
        setPageError(err.message || "Unable to connect to inquiries database.");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchInquiries();
    return () => {
      active = false;
    };
  }, []);

  const filteredInquiries = inquiries.filter((inq) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      inq.name.toLowerCase().includes(q) ||
      inq.company.toLowerCase().includes(q) ||
      inq.product.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      inq.phone.toLowerCase().includes(q) ||
      formatInquiryRef(inq.id).toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "ALL" || inq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const {
    paginatedItems: paginatedInquiries,
    safePage,
    totalPages,
    totalItems,
    showingFrom,
    showingTo,
  } = paginateItems(filteredInquiries, currentPage, pageSize);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      setPageError("");
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
      const msg = err.message || "Status update failed.";
      setPageError(msg);
      notify.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!inquiryToDelete) return;
    try {
      setIsDeleting(true);
      setPageError("");
      const res = await fetch(`/api/inquiries/${inquiryToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete inquiry.");
      }

      setInquiries((prev) =>
        prev.filter((item) => item.id !== inquiryToDelete.id)
      );
      invalidateAdminCache("inquiries");
      if (selectedInquiry?.id === inquiryToDelete.id) {
        setSelectedInquiry(null);
      }
      notify.success(`Inquiry from "${inquiryToDelete.name}" deleted`);
      setInquiryToDelete(null);
    } catch (err) {
      const msg = err.message || "Unable to delete inquiry.";
      setPageError(msg);
      notify.error(msg);
      setInquiryToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const newCount = inquiries.filter((i) => i.status === "New").length;
  const inProgressCount = inquiries.filter(
    (i) => i.status === "In Progress"
  ).length;
  const completedCount = inquiries.filter(
    (i) => i.status === "Completed"
  ).length;

  const statFilterItems = [
    {
      id: "all",
      label: "Total Inquiries",
      value: loading ? "—" : inquiries.length,
      icon: MessageSquareQuote,
      active: statusFilter === "ALL",
      iconBoxClass: "bg-gray-50 border-gray-200 text-gray-700",
      onClick: () => {
        setStatusFilter("ALL");
        setCurrentPage(1);
      },
    },
    {
      id: "new",
      label: "New Requests",
      value: loading ? "—" : newCount,
      valueClass: "text-[#E53935]",
      icon: Inbox,
      active: statusFilter === "New",
      iconBoxClass: "bg-red-50 border-red-200 text-[#E53935]",
      onClick: () => {
        setStatusFilter("New");
        setCurrentPage(1);
      },
    },
    {
      id: "in-progress",
      label: "In Progress",
      value: loading ? "—" : inProgressCount,
      valueClass: "text-amber-600",
      icon: Clock,
      active: statusFilter === "In Progress",
      iconBoxClass: "bg-amber-50 border-amber-200 text-amber-600",
      onClick: () => {
        setStatusFilter("In Progress");
        setCurrentPage(1);
      },
    },
    {
      id: "completed",
      label: "Completed",
      value: loading ? "—" : completedCount,
      valueClass: "text-emerald-600",
      icon: CheckCircle2,
      active: statusFilter === "Completed",
      iconBoxClass: "bg-emerald-50 border-emerald-200 text-emerald-600",
      onClick: () => {
        setStatusFilter("Completed");
        setCurrentPage(1);
      },
    },
  ];

  return (
    <>
      <AdminNavbar title="Quote Inquiries & Leads" />

      <main className="lg:flex-1 lg:min-h-0 flex flex-col p-4 sm:p-5 max-w-7xl w-full mx-auto gap-3.5 lg:overflow-hidden font-roboto">
        {/* Compact Clickable Filter Cards */}
        <AdminStatFilterGrid items={statFilterItems} />

        {pageError && (
          <div className="flex-shrink-0 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-[6px] text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{pageError}</span>
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
              placeholder="Search by client name, company, product, INQ ref..."
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
              menuMinWidth={170}
              align="right"
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
              ariaLabel="Filter inquiries by status"
              options={[
                { value: "ALL", label: "All Inquiries" },
                ...INQUIRY_STATUS_OPTIONS,
              ]}
            />
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden shadow-xs flex flex-col lg:flex-1 lg:min-h-0">
          {loading ? (
            <div className="py-16 lg:flex-1 flex items-center justify-center gap-2.5 text-xs sm:text-sm text-gray-500">
              <Loader2 size={18} className="animate-spin text-[#E53935]" />
              <span>Loading client quote inquiries...</span>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="py-16 px-6 lg:flex-1 flex items-center justify-center text-center text-xs sm:text-sm text-gray-500">
              {inquiries.length === 0
                ? "No quote inquiries submitted from the website yet."
                : "No inquiries match your current search or status filter."}
            </div>
          ) : (
            <>
              <div className="overflow-auto lg:flex-1 lg:min-h-0">
                <table className="w-full text-left text-xs sm:text-sm text-gray-600">
                  <thead className="sticky top-0 z-10 bg-gray-50 text-gray-700 text-[11px] uppercase tracking-wider font-semibold shadow-[0_1px_0_0_#E5E7EB]">
                  <tr>
                    <th className="px-5 py-3.5">Client & Company</th>
                    <th className="px-5 py-3.5">Product Required</th>
                    <th className="px-5 py-3.5">Contact Details</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedInquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-xs sm:text-sm">
                              {inq.name}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400">
                              {formatInquiryRef(inq.id)}
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <Building size={11} className="text-gray-400" />
                            <span>{inq.company}</span>
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-[4px] bg-gray-100 text-gray-800 border border-gray-200">
                          {inq.product}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <Mail size={11} className="text-gray-400" />
                            <span>{inq.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600 font-mono text-[11px]">
                            <Phone size={11} className="text-[#E53935]" />
                            <span>{inq.phone}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap text-xs text-gray-500">
                        {formatShortDate(inq.created_at)}
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
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

                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedInquiry(inq)}
                            className="p-1.5 text-gray-600 hover:text-black border border-transparent hover:border-gray-200 rounded-[4px] transition-colors cursor-pointer"
                            title="View Inquiry Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setInquiryToDelete(inq)}
                            className="p-1.5 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-[4px] transition-colors cursor-pointer"
                            title="Delete Inquiry"
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

        <InquiryDetailModal
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onStatusChange={handleStatusChange}
          isUpdating={updatingId === selectedInquiry?.id}
        />

        <DeleteConfirmModal
          isOpen={Boolean(inquiryToDelete)}
          onClose={() => setInquiryToDelete(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
          title="Delete Quote Inquiry"
          itemName={
            inquiryToDelete
              ? `${inquiryToDelete.name} (${formatInquiryRef(inquiryToDelete.id)})`
              : ""
          }
          description="This will permanently delete this client inquiry record from the database."
        />
      </main>
    </>
  );
}
