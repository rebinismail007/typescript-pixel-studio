import Dashboard from "./components/Dashboard";
import { demoResponses } from "../lib/surveys";

export default function Home() {
  return <main><header><span className="eyebrow">TYPESCRIPT / REACT / NEXT.JS</span>
    <h1>Team Pulse<span>.</span></h1><p>A little clarity about how a team is doing.</p>
    <span className="pill">Portfolio demo · fictional data</span></header>
    <Dashboard initialResponses={demoResponses} />
    <footer>New AI-assisted learning project · October 2026 · No real employee data</footer>
  </main>;
}
