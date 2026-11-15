"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  UploadCloud,
  X,
  Check,
  Plus,
  Trash2,
  Zap,
  Loader2,
  AlertCircle,
  Star,
} from "lucide-react";
import { slugify } from "@/lib/productUtils";
import SearchableSelect from "@/components/admin/SearchableSelect";
import CustomSelect from "@/components/admin/CustomSelect";
import { SECTOR_LIST } from "@/components/common/SectorIcons";
import { notify } from "@/components/common/AppToaster";

function createInitialForm(categories, productToEdit) {
  if (productToEdit) {
    return {
      category_id: String(productToEdit.category_id || categories[0]?.id || ""),
      title: productToEdit.title || "",
      slug: productToEdit.slug || "",
      images: Array.isArray(productToEdit.images) ? productToEdit.images : [],
      sectors: Array.isArray(productToEdit.sectors)
        ? productToEdit.sectors
        : [],
      description: productToEdit.description || "",
      characteristicsText: Array.isArray(productToEdit.characteristics)
        ? productToEdit.characteristics.join("\n")
        : "",
      operating_limits: Array.isArray(productToEdit.operating_limits)
        ? productToEdit.operating_limits.map((r) => ({
            label: r.label || "",
            value: r.value || "",
          }))
        : [],
      extra_sections: Array.isArray(productToEdit.extra_sections)
        ? productToEdit.extra_sections.map((s) => ({
            heading: s.heading || "",
            layout: s.layout || "list",
            items: Array.isArray(s.items)
              ? s.layout === "key_value"
                ? s.items.map((kv) => ({
                    label: kv.label || "",
                    value: kv.value || "",
                  }))
                : [...s.items]
              : [],
          }))
        : [],
    };
  }

  const firstCatId =
    Array.isArray(categories) && categories.length > 0
      ? String(categories[0].id)
      : "";
  return {
    category_id: firstCatId,
    title: "",
    slug: "",
    images: [],
    sectors: ["Fluids / Water", "Chemical"],
    description: "",
    characteristicsText: "",
    operating_limits: [
      { label: "d1", value: "" },
      { label: "p", value: "" },
      { label: "v", value: "" },
      { label: "t", value: "" },
    ],
    extra_sections: [],
  };
}

export default function ProductForm({
  categories = [],
  productToEdit = null,
  onSave,
  isSaving = false,
  saveError = "",
}) {
  const [formData, setFormData] = useState(() =>
    createInitialForm(categories, productToEdit)
  );
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(() =>
    Boolean(productToEdit)
  );
  const [isUploading, setIsUploading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleTitleChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: slugManuallyEdited ? prev.slug : slugify(val),
    }));
  };

  const handleSlugChange = (val) => {
    setSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, slug: slugify(val) }));
  };

  const handleFilesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setLocalError("");

    try {
      const uploadedUrls = [];
      for (const file of files) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || `Failed to upload ${file.name}`);
        }
        uploadedUrls.push(data.imageUrl);
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
      notify.success(
        `${uploadedUrls.length} image${uploadedUrls.length > 1 ? "s" : ""} uploaded`
      );
    } catch (err) {
      const msg = err.message || "Image upload failed.";
      setLocalError(msg);
      notify.error(msg);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const addImageUrl = (url) => {
    setFormData((prev) =>
      prev.images.includes(url)
        ? prev
        : { ...prev, images: [...prev.images, url] }
    );
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const makePrimaryImage = (index) => {
    if (index === 0) return;
    setFormData((prev) => {
      const copy = [...prev.images];
      const [picked] = copy.splice(index, 1);
      return { ...prev, images: [picked, ...copy] };
    });
  };

  const toggleSector = (sector) => {
    setFormData((prev) => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter((s) => s !== sector)
        : [...prev.sectors, sector],
    }));
  };

  const loadDpvPreset = () => {
    setFormData((prev) => ({
      ...prev,
      operating_limits: [
        { label: "d1", value: "10 ÷ 100 mm" },
        { label: "p", value: "10 kg/cm²" },
        { label: "v", value: "20 m/s" },
        { label: "t", value: "-20°C ÷ +200°C (*)" },
      ],
    }));
  };

  const addLimitRow = () => {
    setFormData((prev) => ({
      ...prev,
      operating_limits: [...prev.operating_limits, { label: "", value: "" }],
    }));
  };

  const updateLimitRow = (idx, field, val) => {
    setFormData((prev) => ({
      ...prev,
      operating_limits: prev.operating_limits.map((row, i) =>
        i === idx ? { ...row, [field]: val } : row
      ),
    }));
  };

  const removeLimitRow = (idx) => {
    setFormData((prev) => ({
      ...prev,
      operating_limits: prev.operating_limits.filter((_, i) => i !== idx),
    }));
  };

  const addSection = (preset) => {
    const presets = {
      components: {
        heading: "COMPONENTS",
        layout: "numbered",
        items: ["Rotating contact surface", "Stationary contact surface", "O-rings"],
      },
      materials: {
        heading: "MATERIAL OF CONSTRUCTION",
        layout: "key_value",
        items: [
          { label: "Faces", value: "" },
          { label: "Elastomers", value: "" },
          { label: "Metallurgy", value: "" },
        ],
      },
      type: {
        heading: "TYPE",
        layout: "list",
        items: [""],
      },
      custom: {
        heading: "",
        layout: "list",
        items: [""],
      },
    };
    const next = presets[preset] || presets.custom;
    setFormData((prev) => ({
      ...prev,
      extra_sections: [...prev.extra_sections, next],
    }));
  };

  const updateSectionHeading = (secIdx, heading) => {
    setFormData((prev) => ({
      ...prev,
      extra_sections: prev.extra_sections.map((s, i) =>
        i === secIdx ? { ...s, heading } : s
      ),
    }));
  };

  const changeSectionLayout = (secIdx, nextLayout) => {
    setFormData((prev) => ({
      ...prev,
      extra_sections: prev.extra_sections.map((s, i) => {
        if (i !== secIdx || s.layout === nextLayout) return s;
        if (nextLayout === "key_value") {
          return {
            ...s,
            layout: nextLayout,
            items: s.items.map((item) =>
              typeof item === "string" ? { label: "", value: item } : item
            ),
          };
        }
        return {
          ...s,
          layout: nextLayout,
          items: s.items.map((item) =>
            typeof item === "object"
              ? [item.label, item.value].filter(Boolean).join(": ")
              : item
          ),
        };
      }),
    }));
  };

  const removeSection = (secIdx) => {
    setFormData((prev) => ({
      ...prev,
      extra_sections: prev.extra_sections.filter((_, i) => i !== secIdx),
    }));
  };

  const addSectionItem = (secIdx) => {
    setFormData((prev) => ({
      ...prev,
      extra_sections: prev.extra_sections.map((s, i) => {
        if (i !== secIdx) return s;
        const emptyItem =
          s.layout === "key_value" ? { label: "", value: "" } : "";
        return { ...s, items: [...s.items, emptyItem] };
      }),
    }));
  };

  const updateSectionItem = (secIdx, itemIdx, valOrField, maybeVal) => {
    setFormData((prev) => ({
      ...prev,
      extra_sections: prev.extra_sections.map((s, i) => {
        if (i !== secIdx) return s;
        const nextItems = s.items.map((item, j) => {
          if (j !== itemIdx) return item;
          if (s.layout === "key_value") {
            return { ...item, [valOrField]: maybeVal };
          }
          return valOrField;
        });
        return { ...s, items: nextItems };
      }),
    }));
  };

  const removeSectionItem = (secIdx, itemIdx) => {
    setFormData((prev) => ({
      ...prev,
      extra_sections: prev.extra_sections.map((s, i) =>
        i === secIdx
          ? { ...s, items: s.items.filter((_, j) => j !== itemIdx) }
          : s
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!formData.category_id) {
      const msg = "Please select a category (create one in Categories first).";
      setLocalError(msg);
      notify.error(msg);
      return;
    }
    if (!formData.title.trim()) {
      const msg = "Please enter a product title.";
      setLocalError(msg);
      notify.error(msg);
      return;
    }

    const characteristics = formData.characteristicsText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    onSave({
      category_id: Number(formData.category_id),
      title: formData.title.trim(),
      slug: formData.slug.trim() || slugify(formData.title),
      images: formData.images,
      sectors: formData.sectors,
      description: formData.description.trim(),
      characteristics,
      operating_limits: formData.operating_limits,
      extra_sections: formData.extra_sections,
    });
  };

  const displayError = localError || saveError;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-roboto">
      {displayError && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-[6px] text-xs sm:text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{displayError}</span>
        </div>
      )}

      {/* Card 1: Basic Info */}
      <div className="bg-white border border-gray-200 rounded-[6px] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            1. Basic Product Information
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Select category, enter seal model title and clean URL slug.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Category <span className="text-[#E53935]">*</span>
            </label>
            {categories.length === 0 ? (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-[6px] p-2.5">
                No categories found.{" "}
                <Link href="/admin/category" className="underline font-bold">
                  Add Category First
                </Link>
              </div>
            ) : (
              <SearchableSelect
                options={categories.map((cat) => ({
                  value: String(cat.id),
                  label: cat.title,
                  badge: Number(cat.status) === 0 ? "OFF" : "",
                }))}
                value={formData.category_id}
                onChange={(nextVal) =>
                  setFormData({ ...formData, category_id: nextVal })
                }
                placeholder="Select category..."
                searchPlaceholder="Search category by name..."
                emptyText="No matching category found."
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Product Title <span className="text-[#E53935]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. FL / FLH or FG-EI2000"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-[6px] text-xs sm:text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-[#E53935]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              URL Slug <span className="text-[#E53935]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="auto-generated-slug"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-[6px] text-xs font-mono text-gray-900 focus:outline-none focus:bg-white focus:border-[#E53935]"
            />
          </div>
        </div>
      </div>

      {/* Card 2: Multi-Image Gallery */}
      <div className="bg-white border border-gray-200 rounded-[6px] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              2. Product Images Gallery
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Upload 1 or multiple images. The 1st image acts as the primary
              thumbnail.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addImageUrl("/client/product/Seals.png")}
              className="px-2.5 py-1.5 text-xs rounded-[6px] border border-gray-300 bg-gray-50 text-gray-700 hover:border-[#E53935] hover:text-[#E53935] cursor-pointer"
            >
              + Preset Seal
            </button>
            <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-semibold rounded-[6px] cursor-pointer transition-colors">
              {isUploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <UploadCloud size={14} />
              )}
              <span>{isUploading ? "Uploading..." : "Upload Photos"}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={isUploading}
                onChange={handleFilesUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {formData.images.length === 0 ? (
          <div className="py-6 text-center bg-gray-50 border border-dashed border-gray-300 rounded-[6px] text-xs text-gray-500">
            No images added yet. Click &quot;Upload Photos&quot; to upload from
            your computer.
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {formData.images.map((url, idx) => (
              <div
                key={`${url}-${idx}`}
                className={`relative group w-24 h-24 rounded-[6px] bg-gray-50 border p-1.5 flex items-center justify-center ${
                  idx === 0
                    ? "border-[#E53935] ring-2 ring-[#E53935]/15"
                    : "border-gray-300"
                }`}
              >
                <Image
                  src={url}
                  alt={`Product preview ${idx + 1}`}
                  fill
                  sizes="96px"
                  className="object-contain p-1.5"
                  unoptimized={url.startsWith("http")}
                />
                {idx === 0 ? (
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#E53935] text-white text-[9px] font-bold rounded-[4px]">
                    Primary
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => makePrimaryImage(idx)}
                    title="Set as Primary Image"
                    className="absolute top-1 left-1 p-1 bg-white/95 border border-gray-200 rounded-[4px] text-gray-500 hover:text-[#E53935] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Star size={11} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  title="Remove Image"
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-[#E53935]"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card 3: Sectors, Characteristics & Description */}
      <div className="bg-white border border-gray-200 rounded-[6px] p-5 sm:p-6 shadow-xs space-y-5">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            3. Sectors, Characteristics &amp; Description
          </h3>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
            Target Sectors (Click icons to select)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {SECTOR_LIST.map((sector) => {
              const IconComp = sector.Icon;
              const isSelected = formData.sectors.includes(sector.id);
              return (
                <button
                  type="button"
                  key={sector.id}
                  onClick={() => toggleSector(sector.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-[6px] border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#E53935] text-white border-[#E53935] shadow-xs"
                      : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-white hover:border-[#E53935]/60"
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-[4px] flex items-center justify-center flex-shrink-0 border ${
                      isSelected
                        ? "bg-white text-[#E53935] border-white"
                        : "bg-white text-gray-600 border-gray-200"
                    }`}
                  >
                    <IconComp className="w-4.5 h-4.5" />
                  </span>
                  <span className="flex-1 leading-tight truncate">
                    {sector.label}
                  </span>
                  {isSelected && <Check size={13} className="flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
              Characteristics
            </label>
            <span className="block text-[11px] text-gray-400 mb-1.5">
              Write one bullet point per line.
            </span>
            <textarea
              rows={5}
              value={formData.characteristicsText}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  characteristicsText: e.target.value,
                })
              }
              placeholder={"Unbalanced\nSingle conical spring\nExternal mounting"}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-[6px] text-xs sm:text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-[#E53935]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
              Technical Description
            </label>
            <span className="block text-[11px] text-gray-400 mb-1.5">
              Standard design details or application overview.
            </span>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="A general-purpose single, robust seal in which the contact surfaces can be exchanged..."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-[6px] text-xs sm:text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-[#E53935]"
            />
          </div>
        </div>
      </div>

      {/* Card 4: Dynamic Operating Limits */}
      <div className="bg-white border border-gray-200 rounded-[6px] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              4. Operating Limits / Specifications
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Add any parameter labels (d1, Pressure, RPM, Size Range, Capacity).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadDpvPreset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[6px] border border-gray-300 bg-gray-50 text-gray-700 hover:border-[#E53935] hover:text-[#E53935] cursor-pointer"
            >
              <Zap size={13} />
              <span>Load d1/p/v/t Preset</span>
            </button>
            <button
              type="button"
              onClick={addLimitRow}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-[6px] bg-gray-900 text-white hover:bg-black cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Limit</span>
            </button>
          </div>
        </div>

        {formData.operating_limits.length === 0 ? (
          <p className="text-xs text-gray-400 italic">
            No operating limits added. Click &quot;Load d1/p/v/t Preset&quot; or
            &quot;Add Limit&quot;.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formData.operating_limits.map((row, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-gray-50 p-2 border border-gray-200 rounded-[6px]"
              >
                <input
                  type="text"
                  value={row.label}
                  onChange={(e) => updateLimitRow(idx, "label", e.target.value)}
                  placeholder="Label (e.g. Pressure)"
                  className="w-2/5 px-2.5 py-2 bg-white border border-gray-200 rounded-[4px] text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#E53935]"
                />
                <input
                  type="text"
                  value={row.value}
                  onChange={(e) => updateLimitRow(idx, "value", e.target.value)}
                  placeholder="Value (e.g. 15 bar)"
                  className="flex-1 px-2.5 py-2 bg-white border border-gray-200 rounded-[4px] text-xs font-mono text-gray-900 focus:outline-none focus:border-[#E53935]"
                />
                <button
                  type="button"
                  onClick={() => removeLimitRow(idx)}
                  className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer"
                  title="Remove parameter"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card 5: Extra Custom Sections */}
      <div className="bg-white border border-gray-200 rounded-[6px] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              5. Extra Custom Sections (Optional)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Add Type, Components (1–6), Material of Construction, Features, or
              Applications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => addSection("components")}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-[6px] border border-gray-300 bg-gray-50 text-gray-700 hover:border-[#E53935] hover:text-[#E53935] cursor-pointer"
            >
              + Components
            </button>
            <button
              type="button"
              onClick={() => addSection("materials")}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-[6px] border border-gray-300 bg-gray-50 text-gray-700 hover:border-[#E53935] hover:text-[#E53935] cursor-pointer"
            >
              + Materials
            </button>
            <button
              type="button"
              onClick={() => addSection("type")}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-[6px] border border-gray-300 bg-gray-50 text-gray-700 hover:border-[#E53935] hover:text-[#E53935] cursor-pointer"
            >
              + Type
            </button>
            <button
              type="button"
              onClick={() => addSection("custom")}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-[6px] bg-gray-900 text-white hover:bg-black cursor-pointer"
            >
              <Plus size={13} />
              <span>Custom Block</span>
            </button>
          </div>
        </div>

        {formData.extra_sections.length === 0 ? (
          <p className="text-xs text-gray-400 italic">
            No extra blocks added yet. Use quick buttons above if this product
            needs Components, Material of Construction, Type variants, or
            Features.
          </p>
        ) : (
          <div className="space-y-4">
            {formData.extra_sections.map((section, secIdx) => (
              <div
                key={secIdx}
                className="bg-gray-50 border border-gray-200 rounded-[6px] p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <input
                    type="text"
                    value={section.heading}
                    onChange={(e) =>
                      updateSectionHeading(secIdx, e.target.value)
                    }
                    placeholder="Section Heading (e.g. APPLICATION / COMPONENTS)"
                    className="flex-1 min-w-[200px] px-3 py-2 bg-white border border-gray-300 rounded-[6px] text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:border-[#E53935]"
                  />

                  <CustomSelect
                    value={section.layout}
                    onChange={(val) => changeSectionLayout(secIdx, val)}
                    ariaLabel="Section layout"
                    menuMinWidth={165}
                    buttonClassName="!bg-white"
                    options={[
                      { value: "list", label: "Bullet List" },
                      { value: "numbered", label: "Numbered (1, 2, 3)" },
                      { value: "key_value", label: "Key : Value Pairs" },
                    ]}
                  />

                  <button
                    type="button"
                    onClick={() => removeSection(secIdx)}
                    className="p-2 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-[6px] cursor-pointer"
                    title="Delete Section"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="space-y-2">
                  {section.items.map((item, itemIdx) =>
                    section.layout === "key_value" ? (
                      <div key={itemIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) =>
                            updateSectionItem(
                              secIdx,
                              itemIdx,
                              "label",
                              e.target.value
                            )
                          }
                          placeholder="Label (e.g. Faces)"
                          className="w-1/3 px-3 py-2 bg-white border border-gray-200 rounded-[6px] text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#E53935]"
                        />
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) =>
                            updateSectionItem(
                              secIdx,
                              itemIdx,
                              "value",
                              e.target.value
                            )
                          }
                          placeholder="Value (e.g. Silicon Carbide, GFT)"
                          className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-[6px] text-xs text-gray-900 focus:outline-none focus:border-[#E53935]"
                        />
                        <button
                          type="button"
                          onClick={() => removeSectionItem(secIdx, itemIdx)}
                          className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div key={itemIdx} className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-gray-400 w-5 text-right">
                          {section.layout === "numbered"
                            ? `${itemIdx + 1}.`
                            : "•"}
                        </span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            updateSectionItem(secIdx, itemIdx, e.target.value)
                          }
                          placeholder="Enter item text..."
                          className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-[6px] text-xs text-gray-900 focus:outline-none focus:border-[#E53935]"
                        />
                        <button
                          type="button"
                          onClick={() => removeSectionItem(secIdx, itemIdx)}
                          className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => addSectionItem(secIdx)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#E53935] hover:underline pt-1 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Row</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Form Actions */}
      <div className="bg-white border border-gray-200 rounded-[6px] p-4 sm:px-6 flex items-center justify-end gap-3 shadow-xs">
        <Link
          href="/admin/product"
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-[6px] text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSaving || isUploading || categories.length === 0}
          className="px-6 py-2.5 bg-[#E53935] hover:bg-[#d32f2f] text-white rounded-[6px] text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60 inline-flex items-center gap-2"
        >
          {isSaving && <Loader2 size={14} className="animate-spin" />}
          <span>
            {isSaving
              ? "Saving..."
              : productToEdit
              ? "Update Seal Model"
              : "Save Product"}
          </span>
        </button>
      </div>
    </form>
  );
}

