export const SIZE = 16;
export const PALETTE = ["#392f5a", "#f5a7b8", "#ffd166", "#62c5ad", "#7ca6e8", "#fff7e8"] as const;
export type Pixel = string | null;
export type Drawing = Pixel[];
const validColor = (value: unknown): value is string => typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
export function blank(): Drawing { return Array<Pixel>(SIZE * SIZE).fill(null); }
export function paint(drawing: Drawing, index: number, color: Pixel, fill = false): Drawing {
  if (!Number.isInteger(index) || index < 0 || index >= drawing.length || (color !== null && !validColor(color))) return drawing;
  const previous = drawing[index];
  if (previous === color) return drawing;
  const next = [...drawing];
  if (!fill) { next[index] = color; return next; }
  const queue = [index]; next[index] = color;
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const at = queue[cursor], x = at % SIZE;
    const neighbours = [at - SIZE, at + SIZE, ...(x > 0 ? [at - 1] : []), ...(x < SIZE - 1 ? [at + 1] : [])];
    for (const candidate of neighbours) if (candidate >= 0 && candidate < next.length && next[candidate] === previous) {
      next[candidate] = color; queue.push(candidate);
    }
  }
  return next;
}
export function transform(drawing: Drawing, kind: "mirror" | "rotate"): Drawing {
  const next = blank();
  drawing.forEach((pixel, index) => {
    const x = index % SIZE, y = Math.floor(index / SIZE);
    next[kind === "mirror" ? y * SIZE + SIZE - 1 - x : x * SIZE + SIZE - 1 - y] = pixel;
  });
  return next;
}
export function starter(): Drawing {
  const drawing = blank();
  for (let y = 3; y <= 12; y++) for (let x = 4; x <= 11; x++) {
    if ((y === 3 && (x < 6 || x > 9)) || (y === 12 && x % 2 === 0)) continue;
    drawing[y * SIZE + x] = PALETTE[1];
  }
  for (const x of [6, 9]) drawing[6 * SIZE + x] = PALETTE[0];
  drawing[9 * SIZE + 7] = PALETTE[0]; drawing[9 * SIZE + 8] = PALETTE[0];
  return drawing;
}
export function parseDrawing(text: string): Drawing {
  const value: unknown = JSON.parse(text);
  if (typeof value !== "object" || value === null || !("version" in value) || value.version !== 1 || !("pixels" in value)) throw new Error("Unsupported drawing format.");
  const pixels: unknown = value.pixels;
  if (!Array.isArray(pixels) || pixels.length !== SIZE * SIZE || !pixels.every(p => p === null || validColor(p))) throw new Error("A drawing needs 256 valid pixels.");
  return [...pixels] as Drawing;
}
export function toSvg(drawing: Drawing): string {
  const safe = parseDrawing(JSON.stringify({ version: 1, pixels: drawing }));
  const rectangles = safe.flatMap((color, i) => color ? [`<rect x="${i % SIZE}" y="${Math.floor(i / SIZE)}" width="1" height="1" fill="${color}"/>`] : []).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 ${SIZE} ${SIZE}" shape-rendering="crispEdges">${rectangles}</svg>`;
}
export type History = { past: Drawing[]; present: Drawing; future: Drawing[] };
export type Action = { type: "draw"; drawing: Drawing } | { type: "undo" | "redo" };
export function reduce(history: History, action: Action): History {
  const { past, present, future } = history;
  if (action.type === "undo") return past.length ? { past: past.slice(0, -1), present: past[past.length - 1], future: [present, ...future] } : history;
  if (action.type === "redo") return future.length ? { past: [...past, present].slice(-40), present: future[0], future: future.slice(1) } : history;
  if (action.type === "draw") {
    if (action.drawing.every((pixel, i) => pixel === present[i])) return history;
    return { past: [...past, present].slice(-40), present: action.drawing, future: [] };
  }
  return history;
}
