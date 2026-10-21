"use client";

import { useEffect, useMemo, useState } from "react";
import { addResponse, departments, isResponse, questions, summarize } from "../../lib/surveys";
import type { Department, Response, Scores } from "../../lib/surveys";

const storageKey = "team-pulse-responses-v1";
export default function Dashboard({ initialResponses }: { initialResponses: Response[] }) {
  const [responses, setResponses] = useState(initialResponses);
  const [filter, setFilter] = useState<Department | "all">("all");
  const [department, setDepartment] = useState<Department>("Product");
  const [scores, setScores] = useState<Scores>({ clarity: 3, workload: 3, support: 3 });
  const [notice, setNotice] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        const value: unknown = JSON.parse(saved);
        if (!Array.isArray(value) || !value.every(isResponse) || new Set(value.map(r => r.id)).size !== value.length)
          throw new Error("Invalid saved responses");
        setResponses(value);
      }
    } catch { setNotice("Saved data could not be read. The sample data is shown instead."); }
    setReady(true);
  }, []);
  const summary = useMemo(() => summarize(responses, filter === "all" ? undefined : filter), [responses, filter]);

  function persist(next: Response[], message: string) {
    setResponses(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); setNotice(message); }
    catch { setNotice("Updated for this session. Browser storage is unavailable."); }
  }

  return <>
    <section className="toolbar" aria-label="Dashboard filters"><label>Team
      <select aria-label="Filter by team" value={filter} onChange={e => setFilter(e.target.value as Department | "all")}>
        <option value="all">All teams</option>{departments.map(d => <option key={d}>{d}</option>)}
      </select></label>
      <button className="quiet" disabled={!ready} onClick={() => persist(initialResponses.map(r => ({ ...r })), "Demo data restored.")}>Reset demo</button>
    </section>
    <section className="metrics" aria-label="Survey results">
      <article className="count"><span>RESPONSES</span><strong data-testid="response-count">{summary.count}</strong><p>In the selected team</p></article>
      {summary.means.map(item => <article key={item.key}><span>{item.key.toUpperCase()}</span>
        <strong>{item.average === null ? "—" : item.average.toFixed(2)}<small> / 5</small></strong>
        <p>{item.label}</p><div className="bar" aria-hidden="true"><i style={{ width: `${(item.average ?? 0) * 20}%` }} /></div>
      </article>)}
    </section>
    <section className="panel"><div><span className="eyebrow">TRY THE FLOW</span><h2>Add a check-in</h2>
      <p>Scores update instantly. Responses stay in this browser and are not sent to a server.</p>
      <p className="status" role="status" aria-live="polite">{notice}</p></div>
      <form onSubmit={event => {
        event.preventDefault();
        try { persist(addResponse(responses, { id: crypto.randomUUID(), department, ...scores }), "Check-in added."); }
        catch (error) { setNotice(error instanceof Error ? error.message : "Could not add response."); }
      }}>
        <label>Your demo team<select value={department} onChange={e => setDepartment(e.target.value as Department)}>{departments.map(d => <option key={d}>{d}</option>)}</select></label>
        {questions.map(({ key, label }) => <label key={key}>{label}<select aria-label={label} value={scores[key]} onChange={e => setScores({ ...scores, [key]: Number(e.target.value) })}>{[1, 2, 3, 4, 5].map(score => <option key={score} value={score}>{score} / 5</option>)}</select></label>)}
        <button disabled={!ready} type="submit">Add check-in <span aria-hidden="true">↗</span></button>
      </form>
    </section>
  </>;
}
