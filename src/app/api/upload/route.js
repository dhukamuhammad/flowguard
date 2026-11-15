import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "No image file provided." },
        { status: 400 }
      );
    }

    if (!file.type || !file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Only image files (PNG, JPG, WebP) are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "Image size must be 5MB or less." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalExt = (file.name?.split(".").pop() || "png").replace(/[^a-zA-Z0-9]/g, "");
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${originalExt}`;
    const requestedFolder = formData.get("folder");
    const safeFolder =
      typeof requestedFolder === "string" && requestedFolder.trim()
        ? requestedFolder.trim().replace(/[^a-zA-Z0-9_-]/g, "")
        : "catalog";
    const filePath = `${safeFolder}/${fileName}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message || "Failed to upload image to storage." },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      imageUrl: publicUrlData.publicUrl,
      path: filePath,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Unexpected upload error." },
      { status: 500 }
    );
  }
}
