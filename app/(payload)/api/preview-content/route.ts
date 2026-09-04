import { timingSafeEqual } from "node:crypto";

import config from "@payload-config";
import { getPayload } from "payload";

export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const expected = process.env.WEBSITE_PREVIEW_SECRET?.trim();
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!expected || expected.length !== supplied.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(supplied));
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  const payload = await getPayload({ config });
  const common = { depth: 2, draft: true, overrideAccess: true, pagination: false } as const;
  const [solutions, partners, projects, insights, settings] = await Promise.all([
    payload.find({ ...common, collection: "solutions", sort: "order" }),
    payload.find({ ...common, collection: "partners", sort: "order" }),
    payload.find({ ...common, collection: "projects", sort: "order" }),
    payload.find({ ...common, collection: "insights", sort: "-publishedAt" }),
    payload.findGlobal({ slug: "site-settings", depth: 1, draft: true, overrideAccess: true }),
  ]);

  return Response.json({
    solutions: solutions.docs,
    partners: partners.docs,
    projects: projects.docs,
    insights: insights.docs,
    settings,
  }, { headers: { "Cache-Control": "private, no-store" } });
}
