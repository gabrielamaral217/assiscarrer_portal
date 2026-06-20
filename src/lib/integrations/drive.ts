import "server-only";

export type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string | null;
  iconLink?: string | null;
  modifiedTime?: string | null;
  thumbnailLink?: string | null;
};

export type DriveResult =
  | { configured: false }
  | { configured: true; files: DriveFile[] };

function getOAuth() {
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const client_secret = process.env.GOOGLE_CLIENT_SECRET;
  const refresh_token = process.env.GOOGLE_REFRESH_TOKEN;
  if (!client_id || !client_secret || !refresh_token) return null;
  return { client_id, client_secret, refresh_token };
}

export function driveConfigured() {
  return getOAuth() !== null;
}

export async function listDriveFiles(folderId?: string): Promise<DriveResult> {
  const cfg = getOAuth();
  if (!cfg) return { configured: false };

  const { google } = await import("googleapis");
  const auth = new google.auth.OAuth2(cfg.client_id, cfg.client_secret);
  auth.setCredentials({ refresh_token: cfg.refresh_token });
  const drive = google.drive({ version: "v3", auth });

  const q = folderId
    ? `'${folderId}' in parents and trashed = false`
    : "trashed = false";

  const res = await drive.files.list({
    q,
    pageSize: 50,
    orderBy: "modifiedTime desc",
    fields:
      "files(id,name,mimeType,webViewLink,iconLink,modifiedTime,thumbnailLink)",
  });

  return {
    configured: true,
    files: (res.data.files ?? []) as DriveFile[],
  };
}
