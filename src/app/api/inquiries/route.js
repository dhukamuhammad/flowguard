import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { INQUIRY_STATUSES, validateInquiryPayload } from "@/lib/inquiryUtils";

const INQUIRY_SELECT =
  "id, name, email, company, phone, product, message, status, created_at";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const limitParam = Number(searchParams.get("limit"));

    let query = supabase
      .from("inquiries")
      .select(INQUIRY_SELECT)
      .order("id", { ascending: false });

    if (statusParam && INQUIRY_STATUSES.includes(statusParam)) {
      query = query.eq("status", statusParam);
    }

    if (Number.isInteger(limitParam) && limitParam > 0) {
      query = query.limit(limitParam);
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
      inquiries: data || [],
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
    const { data: payload, error: validationError } = validateInquiryPayload(body);

    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("inquiries")
      .insert([{ ...payload, status: "New" }])
      .select(INQUIRY_SELECT);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, inquiry: data?.[0] || null },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

