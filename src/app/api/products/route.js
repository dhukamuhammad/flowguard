import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  slugify,
  normalizeStringArray,
  normalizeOperatingLimits,
  normalizeExtraSections,
} from "@/lib/productUtils";

const PRODUCT_SELECT =
  "id, category_id, title, slug, images, sectors, description, characteristics, operating_limits, extra_sections, status, created_at, categories(id, title, status)";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryIdParam = searchParams.get("category_id");
    const statusParam = searchParams.get("status");

    let query = supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .order("id", { ascending: false });

    if (categoryIdParam && Number.isInteger(Number(categoryIdParam))) {
      query = query.eq("category_id", Number(categoryIdParam));
    }

    if (statusParam === "0" || statusParam === "1") {
      query = query.eq("status", Number(statusParam));
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      products: data || [],
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const categoryId = Number(body?.category_id);
    const rawSlug = typeof body?.slug === "string" ? body.slug.trim() : "";
    const slug = slugify(rawSlug || title);

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Product title is required." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return NextResponse.json(
        { success: false, error: "Please select a valid category." },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Valid URL slug is required." },
        { status: 400 }
      );
    }

    const payload = {
      category_id: categoryId,
      title,
      slug,
      images: normalizeStringArray(body?.images),
      sectors: normalizeStringArray(body?.sectors),
      description:
        typeof body?.description === "string" ? body.description.trim() : "",
      characteristics: normalizeStringArray(body?.characteristics),
      operating_limits: normalizeOperatingLimits(body?.operating_limits),
      extra_sections: normalizeExtraSections(body?.extra_sections),
      status: 1, // Default Active (ON) on creation
    };

    const { data, error } = await supabase
      .from("products")
      .insert([payload])
      .select(PRODUCT_SELECT);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            error: "A product with this URL slug already exists.",
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

    return NextResponse.json(
      { success: true, product: data[0] },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
