import { NextResponse } from "next/server";
import {
  findOrCreateClientFolder,
  uploadFileToDrive,
  deleteFileFromDrive,
} from "../../../../lib/googleDrive";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const clientName = formData.get("clientName");
    const type = formData.get("type") || "logo"; // "logo" or "banner"
    const oldFileId = formData.get("oldFileId");
    let folderId = formData.get("folderId");
    let folderUrl = formData.get("folderUrl");

    // 1. Strict Name Validation: Under no circumstances allow upload without client/org name
    if (!clientName || !clientName.toString().trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "ফাইল আপলোড করার আগে অরগানাইজেশন বা ক্লায়েন্টের নাম লিখুন।",
        },
        { status: 400 }
      );
    }

    const cleanName = clientName.toString().trim();

    // 2. Validate File presence
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "কোনো ফাইল সিলেক্ট করা হয়নি।" },
        { status: 400 }
      );
    }

    // 3. Validate File Type
    const validMimes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "শুধুমাত্র ছবি (PNG, JPG, JPEG, WEBP) আপলোড করা যাবে।",
        },
        { status: 400 }
      );
    }

    // 4. Validate File Size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "ফাইলের সাইজ সর্বোচ্চ ১০ মেগাবাইট হতে পারবে।" },
        { status: 400 }
      );
    }

    // 5. Clean up old file if replacing
    if (oldFileId) {
      try {
        await deleteFileFromDrive(oldFileId);
      } catch (delErr) {
        console.warn("Could not delete old file:", delErr.message);
      }
    }

    // 6. Ensure user's own folder exists in master Drive folder
    if (!folderId || folderId.startsWith("local_")) {
      const folderRes = await findOrCreateClientFolder(cleanName);
      folderId = folderRes.folderId;
      folderUrl = folderRes.folderUrl;
    }

    // 7. Generate clean file name
    const ext = file.name ? file.name.split(".").pop() : (file.type === "image/png" ? "png" : "jpg");
    const cleanLabel = type === "banner" ? "Banner" : "Logo";
    const fileName = `${cleanName}_${cleanLabel}_${Date.now()}.${ext}`;

    // 8. Convert file to buffer and upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadRes = await uploadFileToDrive({
      buffer,
      mimeType: file.type,
      fileName,
      folderId,
      clientName: cleanName,
      oldFileId,
    });

    return NextResponse.json({
      success: true,
      fileUrl: uploadRes.fileUrl,
      fileId: uploadRes.fileId,
      downloadUrl: uploadRes.downloadUrl,
      thumbnailUrl: uploadRes.thumbnailUrl,
      folderId,
      folderUrl,
      clientName: cleanName,
      type,
    });
  } catch (err) {
    console.error("Drive upload handler error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "গুগল ড্রাইভে আপলোড ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    let fileId = "";
    try {
      const body = await req.json();
      fileId = body?.fileId || "";
    } catch (e) {
      const { searchParams } = new URL(req.url);
      fileId = searchParams.get("fileId") || "";
    }

    if (!fileId) {
      const { searchParams } = new URL(req.url);
      fileId = searchParams.get("fileId") || "";
    }

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: "File ID is required" },
        { status: 400 }
      );
    }

    await deleteFileFromDrive(fileId);
    return NextResponse.json({ success: true, message: "File removed" });
  } catch (err) {
    console.error("Drive delete error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "ডিলিট করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
