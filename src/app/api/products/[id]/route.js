import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { clearCatalogCache } from "@/lib/catalog";
import {
  slugify,
  normalizeStringArray,
  normalizeOperatingLimits,
  normalizeExtraSections,
} from "@/lib/productUtils";

const PRODUCT_SELECT =
  "id, category_id, title, slug, images, sectors, description, characteristics, operating_limits, extra_sections, status, created_at, categories(id, title, status)";

function parseProductId(rawId) {
  const parsed = Number(rawId);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function GET(_request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseProductId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invalid product ID." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseProductId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invalid product ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updates = {};

    if (body?.title !== undefined) {
      const title = typeof body.title === "string" ? body.title.trim() : "";
      if (!title) {
        return NextResponse.json(
          { success: false, error: "Product title cannot be empty." },
          { status: 400 }
        );
      }
      updates.title = title;
    }

    if (body?.category_id !== undefined) {
      const categoryId = Number(body.category_id);
      if (!Number.isInteger(categoryId) || categoryId <= 0) {
        return NextResponse.json(
          { success: false, error: "Please select a valid category." },
          { status: 400 }
        );
      }
      updates.category_id = categoryId;
    }

    if (body?.slug !== undefined) {
      const slug = slugify(body.slug);
      if (!slug) {
        return NextResponse.json(
          { success: false, error: "Valid URL slug is required." },
          { status: 400 }
        );
      }
      updates.slug = slug;
    }

    if (body?.images !== undefined) {
      updates.images = normalizeStringArray(body.images);
    }
    if (body?.sectors !== undefined) {
      updates.sectors = normalizeStringArray(body.sectors);
    }
    if (body?.description !== undefined) {
      updates.description =
        typeof body.description === "string" ? body.description.trim() : "";
    }
    if (body?.characteristics !== undefined) {
      updates.characteristics = normalizeStringArray(body.characteristics);
    }
    if (body?.operating_limits !== undefined) {
      updates.operating_limits = normalizeOperatingLimits(
        body.operating_limits
      );
    }
    if (body?.extra_sections !== undefined) {
      updates.extra_sections = normalizeExtraSections(body.extra_sections);
    }

    if (body?.status !== undefined) {
      const nextStatus = Number(body.status);
      if (nextStatus !== 0 && nextStatus !== 1) {
        return NextResponse.json(
          { success: false, error: "Status must be 0 or 1." },
          { status: 400 }
        );
      }
      updates.status = nextStatus;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields provided to update." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select(PRODUCT_SELECT);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            error: "Another product with this URL slug already exists.",
          },
          { status: 409 }
        );
      }
      if (error.code === "23503") {
        return NextResponse.json(
          { success: false, error: "Selected category does not exist." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: "Product not found." },
        { status: 404 }
      );
    }

    clearCatalogCache();
    try {
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath("/product");
    } catch {}

    return NextResponse.json({ success: true, product: data[0] });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseProductId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invalid product ID." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: "Product not found." },
        { status: 404 }
      );
    }

    clearCatalogCache();
    try {
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath("/product");
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
