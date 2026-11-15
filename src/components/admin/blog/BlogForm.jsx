"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  X,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Save,
} from "lucide-react";
import { slugify } from "@/lib/blogUtils";
import BlogDescriptionEditor from "./BlogDescriptionEditor";
import { notify } from "@/components/common/AppToaster";

export default function BlogForm({ blogToEdit = null }) {
  const router = useRouter();
  const isEditing = Boolean(blogToEdit);

  const [title, setTitle] = useState(blogToEdit?.title || "");
  const [slug, setSlug] = useState(blogToEdit?.slug || "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    Boolean(blogToEdit?.slug)
  );
  const [coverImage, setCoverImage] = useState(blogToEdit?.cover_image || "");
  const [description, setDescription] = useState(
    blogToEdit?.description || ""
  );

  const [formError, setFormError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleTitleChange = (e) => {
    const nextTitle = e.target.value;
    setTitle(nextTitle);
    if (!slugManuallyEdited) {
      setSlug(slugify(nextTitle));
    }
  };

  const handleSlugChange = (e) => {
    setSlugManuallyEdited(true);
    setSlug(slugify(e.target.value));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify.error("Please upload an image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notify.error("Image size must be 5MB or less.");
      return;
    }

    try {
      setIsUploading(true);
      setFormError("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blogs");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setCoverImage(data.imageUrl);
      notify.success("Cover image uploaded successfully.");
    } catch (err) {
      const msg = err.message || "Failed to upload cover image.";
      setFormError(msg);
      notify.error(msg);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanTitle = title.trim();
    const cleanSlug = slug.trim() || slugify(cleanTitle);
    const cleanDescription = description.trim();

    if (!cleanTitle) {
      setFormError("Blog Title is required.");
      notify.error("Blog Title is required.");
      return;
    }

    if (!cleanSlug) {
      setFormError("A valid URL slug is required.");
      notify.error("A valid URL slug is required.");
      return;
    }

    if (!cleanDescription) {
      setFormError("Blog Description content cannot be empty.");
      notify.error("Blog Description content cannot be empty.");
      return;
    }

    try {
      setIsSaving(true);
      setFormError("");

      const payload = {
        title: cleanTitle,
        slug: cleanSlug,
        cover_image: coverImage.trim(),
        description: cleanDescription,
        status: 1, // Always active
      };

      const url = isEditing
        ? `/api/blogs/${blogToEdit.id}`
        : "/api/blogs";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save blog post.");
      }

      notify.success(
        isEditing
          ? `Blog "${cleanTitle}" updated successfully.`
          : `Blog "${cleanTitle}" saved successfully.`
      );

      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      const msg = err.message || "Failed to save blog post.";
      setFormError(msg);
      notify.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-roboto pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-[6px] border border-gray-200 shadow-xs">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 hover:text-black transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Blog List</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/blog"
            className="px-4 py-2 border border-gray-300 rounded-[6px] text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E53935] hover:bg-[#d32f2f] text-white rounded-[6px] text-xs font-semibold shadow-xs disabled:opacity-60 transition-all cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>{isEditing ? "Update Blog" : "Save Blog"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {formError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[6px] text-xs sm:text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Top Row: Left for Title & Slug, Right for Cover Image (Unchanged placement as requested) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Title & Slug */}
        <div className="lg:col-span-8 space-y-5 bg-white p-5 sm:p-6 rounded-[6px] border border-gray-200 shadow-xs flex flex-col justify-between">
          {/* Blog Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Blog Title <span className="text-[#E53935]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. How to Choose Between Single and Double Mechanical Seals"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-[6px] text-sm font-semibold text-gray-900 focus:outline-none focus:bg-white focus:border-[#E53935] transition-colors"
            />
          </div>

          {/* URL Slug */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              URL Slug <span className="text-[#E53935]">*</span>
            </label>
            <div className="flex items-center rounded-[6px] border border-gray-300 bg-gray-50 overflow-hidden focus-within:border-[#E53935] focus-within:bg-white transition-colors">
              <span className="px-3 text-xs text-gray-400 font-mono select-none">
                /blog/
              </span>
              <input
                type="text"
                value={slug}
                onChange={handleSlugChange}
                placeholder="single-vs-double-mechanical-seals-guide"
                className="flex-1 py-2 pr-3 bg-transparent text-xs font-mono text-gray-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Cover Image Upload */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-[6px] border border-gray-200 shadow-xs flex flex-col">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Cover Image
          </label>

          <div className="flex-1 flex flex-col justify-center">
            {coverImage ? (
              <div className="relative aspect-[16/10] w-full rounded-[6px] overflow-hidden border border-gray-200 bg-gray-50 group">
                <Image
                  src={coverImage}
                  alt="Blog Cover Preview"
                  fill
                  sizes="350px"
                  unoptimized={coverImage.startsWith("http")}
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer transition-colors"
                  title="Remove Image"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-300 hover:border-[#E53935] rounded-[6px] p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-red-50/20 h-full min-h-[140px]">
                {isUploading ? (
                  <>
                    <Loader2 size={24} className="animate-spin text-[#E53935] mb-2" />
                    <span className="text-xs font-semibold text-gray-600">
                      Uploading image...
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={26} className="text-gray-400 mb-1.5" />
                    <span className="text-xs font-semibold text-gray-700">
                      Click to upload cover image
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5">
                      PNG, JPG, WebP up to 5MB
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  disabled={isUploading}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Full-Width Description Editor (Stretches completely across the full container) */}
      <div className="bg-white p-5 sm:p-6 rounded-[6px] border border-gray-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Article Description &amp; Content{" "}
            <span className="text-[#E53935]">*</span>
          </label>
          <span className="text-[11px] text-gray-400">
            Card summary will be auto-truncated from this
          </span>
        </div>

        <BlogDescriptionEditor
          value={description}
          onChange={setDescription}
          disabled={isSaving}
        />
      </div>
    </form>
  );
}
