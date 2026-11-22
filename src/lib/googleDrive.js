import { google } from "googleapis";
import { Readable } from "stream";
import fs from "fs";
import path from "path";

// Extract folder ID if a full Google Drive URL is provided
export function extractFolderId(folderStr) {
  if (!folderStr) return "";
  const match = folderStr.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  return folderStr.trim();
}

// Get Google Drive API instance using Service Account credentials
export function getDriveClient() {
  const clientEmail =
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    process.env.GOOGLE_CLIENT_EMAIL ||
    "";
  let privateKey = process.env.GOOGLE_PRIVATE_KEY || "";

  if (!clientEmail || !privateKey) {
    return null;
  }

  // Handle escaped linebreaks in environment variable
  privateKey = privateKey.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  return google.drive({ version: "v3", auth });
}

// Find or create a sub-folder for the client inside the master Drive folder
export async function findOrCreateClientFolder(clientName, customMasterFolderId = "") {
  const masterId =
    extractFolderId(customMasterFolderId) ||
    extractFolderId(process.env.GOOGLE_DRIVE_FOLDER_ID) ||
    extractFolderId(process.env.DRIVE_FOLDER_ID) ||
    "";

  const drive = getDriveClient();
  if (!drive || !masterId) {
    // Fallback representation if Drive is not yet configured
    const cleanSlug = (clientName || "Client").replace(/[^a-zA-Z0-9_\u0980-\u09FF-]/g, "_");
    return {
      folderId: `local_${cleanSlug}`,
      folderUrl: `https://drive.google.com/drive/u/0/folders/${masterId || "local"}`,
      isFallback: true,
    };
  }

  const sanitizedName = (clientName || "Unknown Client").trim();
  const escapedName = sanitizedName.replace(/'/g, "\\'");

  try {
    // 1. Check if folder already exists in parent
    const searchRes = await drive.files.list({
      q: `'${masterId}' in parents and name = '${escapedName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name, webViewLink)",
      spaces: "drive",
    });

    if (searchRes.data.files && searchRes.data.files.length > 0) {
      const existing = searchRes.data.files[0];
      return {
        folderId: existing.id,
        folderUrl: existing.webViewLink || `https://drive.google.com/drive/folders/${existing.id}`,
        isFallback: false,
      };
    }

    // 2. Create new folder for this client inside master folder
    const createRes = await drive.files.create({
      requestBody: {
        name: sanitizedName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [masterId],
      },
      fields: "id, name, webViewLink",
    });

    const newFolderId = createRes.data.id;
    const newFolderUrl =
      createRes.data.webViewLink || `https://drive.google.com/drive/folders/${newFolderId}`;

    return {
      folderId: newFolderId,
      folderUrl: newFolderUrl,
      isFallback: false,
    };
  } catch (err) {
    console.error("Google Drive folder creation error:", err.message);
    return {
      folderId: masterId,
      folderUrl: `https://drive.google.com/drive/folders/${masterId}`,
      isFallback: true,
    };
  }
}

// Find or create a sub-folder inside a client folder (e.g. "NID & Birth Certificate")
export async function findOrCreateSubFolder(parentFolderId, subFolderName = "NID & Birth Certificate") {
  const drive = getDriveClient();
  if (!drive || !parentFolderId || parentFolderId.startsWith("local_")) {
    const cleanSlug = (subFolderName || "Subfolder").replace(/[^a-zA-Z0-9_\u0980-\u09FF-]/g, "_");
    return {
      folderId: `local_${cleanSlug}`,
      folderUrl: `https://drive.google.com/drive/folders/${parentFolderId || "local"}`,
      isFallback: true,
    };
  }

  const sanitizedName = (subFolderName || "NID & Birth Certificate").trim();
  const escapedName = sanitizedName.replace(/'/g, "\\'");

  try {
    // 1. Check if subfolder already exists in parent
    const searchRes = await drive.files.list({
      q: `'${parentFolderId}' in parents and name = '${escapedName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name, webViewLink)",
      spaces: "drive",
    });

    if (searchRes.data.files && searchRes.data.files.length > 0) {
      const existing = searchRes.data.files[0];
      return {
        folderId: existing.id,
        folderUrl: existing.webViewLink || `https://drive.google.com/drive/folders/${existing.id}`,
        isFallback: false,
      };
    }

    // 2. Create new subfolder
    const createRes = await drive.files.create({
      requestBody: {
        name: sanitizedName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [parentFolderId],
      },
      fields: "id, name, webViewLink",
    });

    const newFolderId = createRes.data.id;
    const newFolderUrl =
      createRes.data.webViewLink || `https://drive.google.com/drive/folders/${newFolderId}`;

    return {
      folderId: newFolderId,
      folderUrl: newFolderUrl,
      isFallback: false,
    };
  } catch (err) {
    console.error("Subfolder creation error:", err.message);
    return {
      folderId: parentFolderId,
      folderUrl: `https://drive.google.com/drive/folders/${parentFolderId}`,
      isFallback: true,
    };
  }
}

// Upload a file to Google Drive (Supports both Google Apps Script Webhook & Service Account)
export async function uploadFileToDrive({ buffer, mimeType, fileName, folderId, clientName, oldFileId, subFolder }) {
  const scriptUrl =
    process.env.GOOGLE_DRIVE_SCRIPT_URL ||
    process.env.GOOGLE_DRIVE_WEBHOOK_URL ||
    "";

  // 1. If Google Apps Script Web App URL is configured (simplest 1-click method for scammedid202)
  if (scriptUrl) {
    try {
      const payload = {
        action: "upload",
        clientName: clientName || "Client",
        fileName,
        mimeType: mimeType || "image/png",
        fileBase64: buffer.toString("base64"),
        oldFileId: oldFileId || "",
        subFolder: subFolder || "",
      };

      const res = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json && json.success) {
        return {
          fileId: json.fileId,
          fileUrl: json.fileUrl,
          downloadUrl: json.downloadUrl || json.fileUrl,
          thumbnailUrl: json.thumbnailUrl || json.fileUrl,
          folderId: json.folderId,
          folderUrl: json.folderUrl,
          isFallback: false,
        };
      }
    } catch (scriptErr) {
      console.error("Google Drive Script upload error:", scriptErr.message);
    }
  }

  const drive = getDriveClient();

  // If Drive credentials or real folder ID are not configured, use local public storage fallback
  if (!drive || !folderId || folderId.startsWith("local_")) {
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const safeName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const filePath = path.join(uploadsDir, safeName);
      fs.writeFileSync(filePath, buffer);

      const localUrl = `/uploads/${safeName}`;
      return {
        fileId: `local_${safeName}`,
        fileUrl: localUrl,
        downloadUrl: localUrl,
        thumbnailUrl: localUrl,
        isFallback: true,
      };
    } catch (e) {
      console.error("Local upload fallback error:", e);
      throw new Error("Failed to save file locally: " + e.message);
    }
  }

  try {
    const stream = Readable.from(buffer);
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      mimeType: mimeType || "image/png",
      body: stream,
    };

    const res = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, name, webViewLink, webContentLink, thumbnailLink",
    });

    const fileId = res.data.id;

    // Set permission so view link works for anyone with the link (admin & client preview)
    try {
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
    } catch (permErr) {
      console.warn("Could not set anyone permission on file:", permErr.message);
    }

    const fileUrl =
      res.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;

    return {
      fileId: fileId,
      fileUrl: fileUrl,
      downloadUrl: res.data.webContentLink || fileUrl,
      thumbnailUrl: res.data.thumbnailLink || fileUrl,
      isFallback: false,
    };
  } catch (err) {
    console.error("Google Drive upload error:", err.message);
    throw new Error("Google Drive upload failed: " + err.message);
  }
}

// Delete a file from Google Drive (or local fallback)
export async function deleteFileFromDrive(fileId) {
  if (!fileId) return;

  const scriptUrl =
    process.env.GOOGLE_DRIVE_SCRIPT_URL ||
    process.env.GOOGLE_DRIVE_WEBHOOK_URL ||
    "";

  if (scriptUrl && !fileId.startsWith("local_")) {
    try {
      await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", fileId }),
      });
      return;
    } catch (e) {
      console.warn("Script delete file error:", e.message);
    }
  }

  if (fileId.startsWith("local_")) {
    try {
      const filename = fileId.replace("local_", "");
      const filePath = path.join(process.cwd(), "public", "uploads", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.error("Local file delete error:", e);
    }
    return;
  }

  const drive = getDriveClient();
  if (!drive) return;

  try {
    await drive.files.delete({ fileId });
  } catch (err) {
    console.error("Google Drive file delete error:", err.message);
  }
}
