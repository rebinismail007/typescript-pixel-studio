import test from "node:test";
import assert from "node:assert/strict";
import { addResponse, demoResponses, isResponse, summarize } from "../lib/surveys.ts";

test("filtered scores use only the selected department", () => {
  const result = summarize(demoResponses, "Product");
  assert.equal(result.count, 2);
  assert.deepEqual(result.means.map(x => x.average), [4.5, 3.5, 4.5]);
});
test("an empty team has no fabricated zero score", () => {
  assert.equal(summarize([], "Support").means[0]?.average, null);
});
test("invalid and fractional ratings are rejected", () => {
  assert.equal(isResponse({ ...demoResponses[0], support: 9 }), false);
  assert.equal(isResponse({ ...demoResponses[0], workload: 2.5 }), false);
  assert.equal(isResponse(null), false);
});
test("adding a response preserves the original state", () => {
  const next = addResponse(demoResponses, { id: "new", department: "Support", clarity: 5, workload: 5, support: 5 });
  assert.equal(next.length, 5);
  assert.equal(demoResponses.length, 4);
  assert.throws(() => addResponse(next, next[4]!), /already exists/);
});
