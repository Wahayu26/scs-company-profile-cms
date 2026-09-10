import { createLocalInquiry, localInquiryStoreEnabled } from "@/cms/local-inquiries";

export const dynamic = "force-dynamic";

const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const optional = (value: unknown) => text(value) || null;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d][\d\s().-]{5,39}$/;
const slugPattern = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;
const contacts = new Set(["whatsapp", "email", "phone"]);

export async function POST(request: Request) {
  if (!localInquiryStoreEnabled()) return Response.json({ message: "Endpoint ini hanya tersedia untuk testing lokal." }, { status: 503 });
  if (request.headers.get("content-type")?.split(";", 1)[0] !== "application/json") {
    return Response.json({ message: "Format permintaan tidak didukung." }, { status: 415 });
  }
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; } catch {
    return Response.json({ message: "Data formulir tidak valid." }, { status: 400 });
  }
  const name = text(body.name); const company = text(body.company); const email = text(body.email).toLowerCase();
  const phone = optional(body.phone); const message = text(body.message); const interestSolution = optional(body.interestSolution);
  const sourcePage = optional(body.sourcePage); const utmSource = optional(body.utmSource); const utmCampaign = optional(body.utmCampaign);
  const preferredContact = text(body.preferredContact);
  if (name.length < 2 || name.length > 120 || company.length < 2 || company.length > 160 || !emailPattern.test(email)
    || email.length > 180 || (phone && !phonePattern.test(phone)) || message.length < 10 || message.length > 5000
    || (interestSolution && (interestSolution.length > 120 || !slugPattern.test(interestSolution))) || !contacts.has(preferredContact)) {
    return Response.json({ message: "Data formulir belum lengkap atau tidak valid." }, { status: 400 });
  }
  const reference = createLocalInquiry({ name, company, email, phone, message, interestSolution, sourcePage, utmSource, utmCampaign, preferredContact });
  return Response.json({ reference }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
