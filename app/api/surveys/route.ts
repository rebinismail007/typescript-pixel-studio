import { departments, demoResponses, summarize } from "../../../lib/surveys";
import type { Department } from "../../../lib/surveys";

// Read-only sample endpoint. Browser changes intentionally stay local.
export function GET(request: Request) {
  const selected = new URL(request.url).searchParams.get("department");
  if (selected && !departments.includes(selected as Department))
    return Response.json({ error: "Unknown department" }, { status: 400 });
  return Response.json({ source: "synthetic-demo", ...summarize(demoResponses, selected as Department || undefined) });
}
