import { NextResponse } from "next/server";
import {
  findOrCreateClientFolder,
  findOrCreateSubFolder,
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

    // 3. Validate File Type (Images & PDF allowed)
    const validMimes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "application/pdf",
    ];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "শুধুমাত্র ছবি (PNG, JPG, WEBP) অথবা PDF আপলোড করা যাবে।",
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
    const clientFolderRes = await findOrCreateClientFolder(cleanName);
    const clientFolderId = clientFolderRes.folderId;
    const clientFolderUrl = clientFolderRes.folderUrl;

    let targetFolderId = clientFolderId;
    let targetFolderUrl = clientFolderUrl;
    let subFolderId = "";
    let subFolderUrl = "";

    const isNid = type === "nid" || type === "certificate";

    if (isNid) {
      // Create or find dedicated "NID & Birth Certificate" subfolder inside Client's folder
      const subFolderRes = await findOrCreateSubFolder(clientFolderId, "NID & Birth Certificate");
      targetFolderId = subFolderRes.folderId;
      targetFolderUrl = subFolderRes.folderUrl;
      subFolderId = subFolderRes.folderId;
      subFolderUrl = subFolderRes.folderUrl;
    }

    // 7. Generate clean file name
    const ext = file.name
      ? file.name.split(".").pop()
      : file.type === "application/pdf"
      ? "pdf"
      : file.type === "image/png"
      ? "png"
      : "jpg";

    const cleanLabel = isNid
      ? "NID_BirthCertificate"
      : type === "banner"
      ? "Banner"
      : "Logo";

    const fileName = `${cleanName}_${cleanLabel}_${Date.now()}.${ext}`;

    // 8. Convert file to buffer and upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadRes = await uploadFileToDrive({
      buffer,
      mimeType: file.type,
      fileName,
      folderId: targetFolderId,
      clientName: cleanName,
      oldFileId,
      subFolder: isNid ? "NID & Birth Certificate" : "",
    });

    return NextResponse.json({
      success: true,
      fileUrl: uploadRes.fileUrl,
      fileId: uploadRes.fileId,
      downloadUrl: uploadRes.downloadUrl,
      thumbnailUrl: uploadRes.thumbnailUrl,
      folderId: clientFolderId,
      folderUrl: clientFolderUrl,
      subFolderId,
      subFolderUrl,
      parentFolderId: clientFolderId,
      parentFolderUrl: clientFolderUrl,
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
