import test from "node:test";
import assert from "node:assert/strict";
import { blank, paint, parseDrawing, reduce, SIZE, toSvg, transform } from "../lib/pixels.ts";
test("flood fill respects a closed wall and does not wrap rows", () => {
  const image = blank();
  for (let y = 0; y < SIZE; y++) image[y * SIZE + 1] = "#000000";
  const result = paint(image, 0, "#ff0000", true);
  assert.equal(result.filter(p => p === "#ff0000").length, SIZE);
  assert.equal(result[2], null); assert.equal(image[0], null);
});
test("four clockwise rotations and two mirrors restore all pixels", () => {
  const image = paint(blank(), 2 * SIZE + 3, "#abcdef"); let rotated = image;
  for (let i = 0; i < 4; i++) rotated = transform(rotated, "rotate");
  assert.deepEqual(rotated, image); assert.deepEqual(transform(transform(image, "mirror"), "mirror"), image);
});
test("undo/redo branching discards obsolete redo and caps history", () => {
  let state = { past: [] as ReturnType<typeof blank>[], present: blank(), future: [] as ReturnType<typeof blank>[] };
  for (let i = 0; i < 50; i++) state = reduce(state, { type: "draw", drawing: paint(state.present, i, "#000000") });
  assert.equal(state.past.length, 40); state = reduce(state, { type: "undo" }); assert.equal(state.present[49], null);
  state = reduce(state, { type: "redo" }); assert.equal(state.present[49], "#000000");
  state = reduce(reduce(state, { type: "undo" }), { type: "draw", drawing: blank() }); assert.equal(state.future.length, 0);
});
test("import and SVG export reject injected markup and incorrect dimensions", () => {
  assert.throws(() => parseDrawing('{"version":2,"pixels":[]}'));
  const image = blank(); image[0] = '"/><script>alert(1)</script>'; assert.throws(() => toSvg(image));
  const safe = paint(blank(), 0, "#abcdef");
  assert.deepEqual(parseDrawing(JSON.stringify({ version: 1, pixels: safe })), safe); assert.match(toSvg(safe), /fill="#abcdef"/);
});
