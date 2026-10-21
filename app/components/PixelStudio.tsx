"use client";
import { useEffect, useReducer, useState } from "react";
import { blank, PALETTE, paint, parseDrawing, reduce, SIZE, starter, toSvg, transform, type Drawing } from "../../lib/pixels.ts";
const STORAGE = "pixel-studio-v1";
export default function PixelStudio() {
  const [history, dispatch] = useReducer(reduce, { past: [], present: starter(), future: [] });
  const [color, setColor] = useState<string>(PALETTE[0]);
  const [tool, setTool] = useState<"brush" | "fill" | "eraser">("brush");
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("Your own tiny canvas. Make something weird.");
  useEffect(() => {
    try { const saved = localStorage.getItem(STORAGE); if (saved) dispatch({ type: "draw", drawing: parseDrawing(saved) }); }
    catch { setNotice("The saved drawing could not be read. Starting fresh."); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE, JSON.stringify({ version: 1, pixels: history.present })); }
    catch { setNotice("Browser storage is unavailable. You can still export your drawing."); }
  }, [ready, history.present]);
  function draw(drawing: Drawing) { dispatch({ type: "draw", drawing }); }
  function download(kind: "svg" | "json") {
    const body = kind === "svg" ? toSvg(history.present) : JSON.stringify({ version: 1, pixels: history.present }, null, 2);
    const url = URL.createObjectURL(new Blob([body], { type: kind === "svg" ? "image/svg+xml" : "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = `tiny-masterpiece.${kind}`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setNotice(`Exported ${kind.toUpperCase()}.`);
  }
  return <main>
    <header><a className="wordmark" href="/">P<span>×</span>L / STUDIO</a><span className="tag">16 × 16 · NO RULES</span></header>
    <section className="intro"><p className="eyebrow">SMALL CANVAS. BIG PERSONALITY.</p><h1>One pixel<br/><em>at a time.</em></h1><p>A tiny drawing playground. Click a square, fill a shape,<br className="desktop"/> turn it sideways. See what happens.</p></section>
    <section className="workspace" aria-label="Pixel editor"><div className="canvas-wrap"><div className="canvas" aria-label="16 by 16 pixel canvas">
      {history.present.map((pixel, index) => <button key={index} className="pixel" style={{ backgroundColor: pixel ?? undefined }} aria-label={`Pixel ${index % SIZE + 1}, ${Math.floor(index / SIZE) + 1}`} aria-pressed={pixel !== null} disabled={!ready} onClick={() => draw(paint(history.present, index, tool === "eraser" ? null : color, tool === "fill"))}/>)}</div>
      <div className="canvas-footer"><span>{history.present.filter(Boolean).length} / 256 pixels</span><span>Saved in this browser</span></div></div>
      <aside aria-label="Drawing tools"><h2>YOUR TOOLKIT</h2><div className="tool-row">{(["brush", "fill", "eraser"] as const).map(t => <button key={t} aria-pressed={tool === t} onClick={() => setTool(t)}>{t[0].toUpperCase() + t.slice(1)}</button>)}</div>
        <h2>PICK A COLOUR</h2><div className="palette">{PALETTE.map(c => <button key={c} style={{ backgroundColor: c }} aria-label={`Use ${c}`} aria-pressed={color === c} onClick={() => setColor(c)}/>)}</div><label className="custom-color">Or mix your own<input aria-label="Custom colour" type="color" value={color} onChange={e => setColor(e.target.value)}/></label>
        <h2>A LITTLE MAGIC</h2><div className="tool-row"><button onClick={() => draw(transform(history.present, "rotate"))}>Rotate ↻</button><button onClick={() => draw(transform(history.present, "mirror"))}>Mirror ↔</button></div>
        <div className="tool-row"><button disabled={!history.past.length || !ready} onClick={() => dispatch({ type: "undo" })}>Undo</button><button disabled={!history.future.length || !ready} onClick={() => dispatch({ type: "redo" })}>Redo</button><button onClick={() => draw(blank())}>Clear</button></div>
        <button className="primary" onClick={() => download("svg")}>Export SVG ↗</button><div className="tool-row"><button onClick={() => download("json")}>Save JSON</button><label className="file-button">Open JSON<input type="file" accept=".json,application/json" aria-label="Open drawing JSON" onChange={async e => { const file = e.target.files?.[0]; if (!file) return; try { if (file.size > 20000) throw new Error("File is too large."); draw(parseDrawing(await file.text())); setNotice("Drawing opened."); } catch { setNotice("That file is not a valid Pixel Studio drawing."); } e.target.value = ""; }}/></label></div>
      </aside></section>
    <p className="notice" role="status">{notice}</p><footer>React / Next.js / TypeScript · Draw, experiment and export</footer>
  </main>;
}
