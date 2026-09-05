import type { InquiryStatus } from "./core-inquiries";

const statuses = new Set<InquiryStatus>(["RECEIVED", "IN_PROGRESS", "CONTACTED", "CLOSED"]);

export function parseInquiryStatus(value: unknown): InquiryStatus | null {
  return typeof value === "string" && statuses.has(value as InquiryStatus)
    ? value as InquiryStatus
    : null;
}

export function validInquiryReference(value: string) {
  return /^[A-Z0-9-]{6,64}$/.test(value);
}

export function isSameCMSOrigin(request: Request, serverURL: string | undefined) {
  const supplied = request.headers.get("origin");
  if (!supplied || !serverURL) return false;
  try {
    return supplied === new URL(serverURL).origin;
  } catch {
    return false;
  }
}
