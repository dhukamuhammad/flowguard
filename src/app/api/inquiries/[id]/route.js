import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { INQUIRY_STATUSES } from "@/lib/inquiryUtils";

const INQUIRY_SELECT =
  "id, name, email, company, phone, product, message, status, created_at";

function parseInquiryId(rawId) {
  const parsed = Number(rawId);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

export async function PATCH(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseInquiryId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invalid inquiry ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const status = typeof body?.status === "string" ? body.status.trim() : "";

    if (!INQUIRY_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Status must be one of: ${INQUIRY_STATUSES.join(", ")}.`,
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("inquiries")
      .update({ status })
      .eq("id", id)
      .select(INQUIRY_SELECT);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: "Inquiry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiry: data[0],
    });
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
    const id = parseInquiryId(rawId);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invalid inquiry ID." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("inquiries")
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
        { success: false, error: "Inquiry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      id,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

