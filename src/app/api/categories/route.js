import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { clearCatalogCache } from "@/lib/catalog";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");

    let query = supabase
      .from("categories")
      .select("id, title, status, created_at")
      .order("id", { ascending: true });

    if (statusParam === "0" || statusParam === "1") {
      query = query.eq("status", Number(statusParam));
    }

    const [{ data: categories, error }, { data: productRows }] =
      await Promise.all([
        query,
        supabase.from("products").select("category_id"),
      ]);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    const countsByCategory = {};
    if (Array.isArray(productRows)) {
      for (const row of productRows) {
        countsByCategory[row.category_id] =
          (countsByCategory[row.category_id] || 0) + 1;
      }
    }

    const enriched = (categories || []).map((cat) => ({
      ...cat,
      products_count: countsByCategory[cat.id] || 0,
    }));

    return NextResponse.json({ success: true, categories: enriched });
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

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Category title is required." },
        { status: 400 }
      );
    }

    // Default status is 1 (Active) in both payload and DB constraint
    const { data, error } = await supabase
      .from("categories")
      .insert([{ title, status: 1 }])
      .select("id, title, status, created_at");

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { success: false, error: "A category with this title already exists." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    clearCatalogCache();
    try {
      revalidatePath("/");
      revalidatePath("/products");
    } catch {}

    return NextResponse.json(
      {
        success: true,
        category: { ...data[0], products_count: 0 },
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

