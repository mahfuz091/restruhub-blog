// app/api/editor-upload-by-url/route.js
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: 0, message: "Missing or invalid 'url' in request body" },
        { status: 400 }
      );
    }

    // Basic validation: must be http(s) and have common image extension (tweak if needed)
    const isImageUrl =
      /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|avif|bmp)(\?.*)?$/i.test(url);
    if (!isImageUrl) {
      // Still allow non-extension URLs (e.g. CDN routes) — optionally relax this:
      // return NextResponse.json({ success: 0, message: "URL does not look like an image" }, { status: 400 });
      // For now, log a warning and continue (Cloudinary will fail if not an image)
      console.warn(
        "editor-upload-by-url: URL has no image extension, attempting upload anyway:",
        url
      );
    }

    // Use Cloudinary to fetch & store the remote URL (Cloudinary supports remote uploads)
    const result = await cloudinary.uploader.upload(url, {
      folder: "blogs",
      // optionally add transformations, e.g. quality/format
      // eager: [{ width: 1200, crop: "limit" }]
    });

    if (!result?.secure_url) {
      return NextResponse.json(
        { success: 0, message: "Cloudinary upload failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: 1,
      file: { url: result.secure_url }, // Editor.js expects this shape
    });
  } catch (err) {
    console.error("editor-upload-by-url error:", err);
    return NextResponse.json(
      { success: 0, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
