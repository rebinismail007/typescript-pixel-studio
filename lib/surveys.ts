export const departments = ["Product", "Operations", "Support"] as const;
export type Department = (typeof departments)[number];
export type Scores = { clarity: number; workload: number; support: number };
export type Response = Scores & { id: string; department: Department };
export const questions: ReadonlyArray<{ key: keyof Scores; label: string }> = [
  { key: "clarity", label: "My priorities are clear" },
  { key: "workload", label: "My workload is manageable" },
  { key: "support", label: "I can get support when I need it" },
];
export const demoResponses: Response[] = [
  { id: "demo-1", department: "Product", clarity: 4, workload: 3, support: 5 },
  { id: "demo-2", department: "Product", clarity: 5, workload: 4, support: 4 },
  { id: "demo-3", department: "Operations", clarity: 3, workload: 3, support: 4 },
  { id: "demo-4", department: "Support", clarity: 4, workload: 2, support: 5 },
];

export function isResponse(value: unknown): value is Response {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "string" && item.id.length > 0 &&
    departments.includes(item.department as Department) &&
    questions.every(({ key }) => typeof item[key] === "number" && Number.isInteger(item[key]) &&
      (item[key] as number) >= 1 && (item[key] as number) <= 5);
}

export function summarize(responses: readonly Response[], department?: Department) {
  const selected = responses.filter((r) => !department || r.department === department);
  const means = questions.map(({ key, label }) => ({
    key, label,
    average: selected.length ? Math.round(selected.reduce((sum, r) => sum + r[key], 0) / selected.length * 100) / 100 : null,
  }));
  return { count: selected.length, means };
}

export function addResponse(existing: readonly Response[], response: Response): Response[] {
  if (!isResponse(response)) throw new Error("Each score must be an integer between 1 and 5.");
  if (existing.some((r) => r.id === response.id)) throw new Error("This response already exists.");
  return [...existing, { ...response }];
}
