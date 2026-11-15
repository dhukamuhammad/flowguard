import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * Validates and converts route id param into a positive integer.
 */
function parseCategoryId(rawId) {
  const parsed = Number(rawId);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

export async function PATCH(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseCategoryId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invalid category ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updates = {};

    if (body?.title !== undefined) {
      const trimmed = typeof body.title === "string" ? body.title.trim() : "";
      if (!trimmed) {
        return NextResponse.json(
          { success: false, error: "Category title cannot be empty." },
          { status: 400 }
        );
      }
      updates.title = trimmed;
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
      .from("categories")
      .update(updates)
      .eq("id", id)
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

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: "Category not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, category: data[0] });
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
    const id = parseCategoryId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invalid category ID." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      if (error.code === "23503") {
        return NextResponse.json(
          {
            success: false,
            error:
              "Cannot delete this category because products are linked to it. Reassign or delete those products first.",
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: "Category not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

