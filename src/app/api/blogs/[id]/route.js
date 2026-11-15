import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/blogUtils";

const BLOG_SELECT =
  "id, title, slug, cover_image, description, status, created_at, updated_at";

function parseBlogId(rawId) {
  const parsed = Number(rawId);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

export async function GET(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseBlogId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("blogs")
      .select(BLOG_SELECT)
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog: data });
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
    const id = parseBlogId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updates = {};

    if (body?.title !== undefined) {
      const trimmed = typeof body.title === "string" ? body.title.trim() : "";
      if (!trimmed) {
        return NextResponse.json(
          { success: false, error: "Blog title cannot be empty." },
          { status: 400 }
        );
      }
      updates.title = trimmed;
    }

    if (body?.slug !== undefined) {
      const rawSlug = typeof body.slug === "string" ? body.slug.trim() : "";
      const cleanSlug = slugify(rawSlug || updates.title || "");
      if (!cleanSlug) {
        return NextResponse.json(
          { success: false, error: "Valid URL slug is required." },
          { status: 400 }
        );
      }
      updates.slug = cleanSlug;
    }

    if (body?.cover_image !== undefined) {
      updates.cover_image =
        typeof body.cover_image === "string" ? body.cover_image.trim() : "";
    }

    if (body?.description !== undefined) {
      const trimmed =
        typeof body.description === "string" ? body.description.trim() : "";
      if (!trimmed) {
        return NextResponse.json(
          { success: false, error: "Description cannot be empty." },
          { status: 400 }
        );
      }
      updates.description = trimmed;
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
        { success: false, error: "No fields provided to update." },
        { status: 400 }
      );
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("blogs")
      .update(updates)
      .eq("id", id)
      .select(BLOG_SELECT);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            error: "Another blog post with this title or slug already exists.",
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      blog: data?.[0] || null,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseBlogId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("blogs").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

