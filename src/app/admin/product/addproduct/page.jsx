"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ProductForm from "@/components/admin/product/ProductForm";
import { notify } from "@/components/common/AppToaster";

function AddProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEditing = Boolean(editId);

  const [categories, setCategories] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      try {
        const requests = [fetch("/api/categories", { cache: "no-store" })];
        if (editId) {
          requests.push(fetch(`/api/products/${editId}`, { cache: "no-store" }));
        }

        const responses = await Promise.all(requests);
        const catData = await responses[0].json();
        if (!active) return;

        setLoadError("");
        setCategories(catData.success ? catData.categories || [] : []);

        if (editId) {
          const prodRes = responses[1];
          const prodData = await prodRes.json();
          if (!active) return;

          if (!prodRes.ok || !prodData.success) {
            throw new Error(prodData.error || "Product not found.");
          }
          setProductToEdit(prodData.product);
        } else {
          setProductToEdit(null);
        }
      } catch (err) {
        if (!active) return;
        setLoadError(err.message || "Unable to load form data.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInitialData();
    return () => {
      active = false;
    };
  }, [editId]);

  const handleSave = async (payload) => {
    try {
      setIsSaving(true);
      setSaveError("");

      const url = isEditing ? `/api/products/${editId}` : "/api/products";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save product.");
      }

      notify.success(
        isEditing
          ? "Product updated successfully"
          : "New product created successfully"
      );
      router.push("/admin/product");
      router.refresh();
    } catch (err) {
      const msg = err.message || "Error saving product.";
      setSaveError(msg);
      notify.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <AdminNavbar title={isEditing ? "Edit Product" : "Add Product"} />

      <main className="p-5 sm:p-7 max-w-5xl w-full mx-auto space-y-5 font-roboto">
        {/* Top Bar with Back Link */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href="/admin/product"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#E53935] transition-colors mb-1"
            >
              <ArrowLeft size={14} />
              <span>Back to Products</span>
            </Link>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              {isEditing ? "Edit Mechanical Seal Model" : "Add New Mechanical Seal"}
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-200 rounded-[6px] p-16 text-center shadow-xs">
            <Loader2
              size={26}
              className="animate-spin text-[#E53935] mx-auto mb-3"
            />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Loading Product Form...
            </p>
          </div>
        ) : loadError ? (
          <div className="bg-white border border-red-200 rounded-[6px] p-8 text-center space-y-3 shadow-xs">
            <p className="text-sm font-semibold text-red-600">{loadError}</p>
            <Link
              href="/admin/product"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E53935] text-white text-xs font-semibold rounded-[6px]"
            >
              Return to Product List
            </Link>
          </div>
        ) : (
          <ProductForm
            key={productToEdit?.id || "new"}
            categories={categories}
            productToEdit={productToEdit}
            onSave={handleSave}
            isSaving={isSaving}
            saveError={saveError}
          />
        )}
      </main>
    </>
  );
}

export default function AddProductPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 flex flex-col items-center justify-center text-gray-500 text-xs font-roboto">
          <Loader2 size={24} className="animate-spin text-[#E53935] mb-2" />
          <span>Loading page...</span>
        </div>
      }
    >
      <AddProductContent />
    </Suspense>
  );
}

