import { PALETTE, SIZE } from "../../../lib/pixels.ts";
export function GET() { return Response.json({ size: SIZE, colors: PALETTE }); }
