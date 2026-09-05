import config from "@payload-config";
import { getPayload } from "payload";

import { updateCoreInquiryStatus } from "@/cms/core-inquiries";
import { isSameCMSOrigin, parseInquiryStatus, validInquiryReference } from "@/cms/inquiry-status";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "private, no-store" };

export async function PATCH(request: Request, context: { params: Promise<{ reference: string }> }) {
  if (!isSameCMSOrigin(request, process.env.PAYLOAD_SERVER_URL)) {
    return Response.json({ error: "Forbidden" }, { status: 403, headers: noStore });
  }
  const contentType = request.headers.get("content-type")?.split(";", 1)[0];
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentType !== "application/json") {
    return Response.json({ error: "Content-Type tidak didukung" }, { status: 415, headers: noStore });
  }
  if (contentLength > 2_048) {
    return Response.json({ error: "Payload terlalu besar" }, { status: 413, headers: noStore });
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  if (user.collection !== "users" || !("role" in user) || user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403, headers: noStore });
  }

  const { reference } = await context.params;
  if (!validInquiryReference(reference)) {
    return Response.json({ error: "Referensi tidak valid" }, { status: 400, headers: noStore });
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (rawBody.length > 2_048) {
      return Response.json({ error: "Payload terlalu besar" }, { status: 413, headers: noStore });
    }
    body = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "JSON tidak valid" }, { status: 400, headers: noStore });
  }
  const status = parseInquiryStatus(typeof body === "object" && body !== null && "status" in body ? body.status : null);
  if (!status) return Response.json({ error: "Status tidak valid" }, { status: 400, headers: noStore });

  try {
    const result = await updateCoreInquiryStatus(reference, status, { id: user.id, name: user.name });
    if (!result) return Response.json({ error: "Konsultasi tidak ditemukan" }, { status: 404, headers: noStore });
    return Response.json({ ok: true, ...result }, { headers: noStore });
  } catch (error) {
    payload.logger.error({ err: error, msg: "Failed to update inquiry status" });
    return Response.json({ error: "Status belum dapat disimpan" }, { status: 500, headers: noStore });
  }
}
