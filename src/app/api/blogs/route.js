import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { validateBlogPayload } from "@/lib/blogUtils";

const BLOG_SELECT =
  "id, title, slug, cover_image, description, status, created_at, updated_at";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");

    let query = supabase
      .from("blogs")
      .select(BLOG_SELECT)
      .order("id", { ascending: false });

    if (statusParam === "0" || statusParam === "1") {
      query = query.eq("status", Number(statusParam));
    }

    const { data: blogs, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, blogs: blogs || [] });
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
    const { data: payload, error: validationError } = validateBlogPayload(body);

    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("blogs")
      .insert([payload])
      .select(BLOG_SELECT);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            error: "A blog post with this title or slug already exists.",
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, blog: data?.[0] || null },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

