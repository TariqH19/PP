import React from "react";
import "../styles/canada.css";

import PinLock from "./PinLock";
import { useTracker } from "../context/TrackerContext";
const TaskTable = React.lazy(() => import("./TaskTable"));
const CostTable = React.lazy(() => import("./CostTable"));
const Pensions = React.lazy(() => import("./Pensions"));
const JobsTracker = React.lazy(() => import("./JobsTracker"));
const Housing = React.lazy(() => import("./Housing"));
const Overview = React.lazy(() => import("./Overview"));
const Budget = React.lazy(() => import("./Budget"));

const TABS = [
  "overview",
  "before",
  "olivia",
  "visas",
  "moving",
  "setup",
  "arrival",
  "finances",
  "healthcare",
  "pensions",
  "budget",
  "jobs",
  "taxes",
  "housing",
];

const MoveTracker = () => {
  const [active, setActive] = React.useState("overview");
    const { fxRate, setFxRate, saveRemote, isSaving, loadRemote } = useTracker();

  return (
    <div>
      <PinLock />

      <header>
        <div>
          <h1>
            <img src="/flags/ie.svg" alt="Ireland" className="flag flag-left" />
            Ireland <span>→</span> Canada
            <img src="/flags/ca.svg" alt="Canada" className="flag flag-right" />
            <br />
            Move Tracker
          </h1>
          <div
            style={{
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.5)",
              marginTop: "0.5rem",
            }}>
            Your complete relocation dashboard
          </div>
          <div
            id="sync-status"
            style={{ fontSize: "0.65rem", marginTop: 4, height: 14 }}
          />
        </div>

        <div className="fx-bar">
          <label>€1 EUR =</label>
          <input
            type="number"
            id="fxRate"
            value={fxRate}
            step="0.01"
            min="0.5"
            max="3"
            onChange={(e) => setFxRate(parseFloat(e.target.value) || 0)}
          />
          <span className="rate-display">CAD</span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem" }}>
            update rate anytime
          </span>
          <button
            className="add-btn"
            style={{ marginLeft: 12 }}
            onClick={async () => {
              await saveRemote();
            }}>
            {isSaving ? "Saving…" : "Sync"}
          </button>
          <button
            className="add-btn"
            style={{
              marginLeft: 8,
              background: "transparent",
              color: "white",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
            onClick={async () => {
              await loadRemote();
            }}>
            Load
          </button>
        </div>
      </header>

      <nav>
        {TABS.map((t) => (
          <button
            key={t}
            className={t === active ? "active" : ""}
            onClick={() => setActive(t)}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>

      <main>
        {/* Render tab content components for task and cost sections */}
        {[
          "before",
          "olivia",
          "arrival",
          "finances",
          "healthcare",
          "taxes",
        ].includes(active) && (
          <div style={{ paddingTop: 8 }}>
            {/* TaskTable is lazy — import locally to avoid extra bundle noise later */}
            <React.Suspense fallback={<div>Loading...</div>}>
              <TaskTable section={active} />
            </React.Suspense>
            {/* defaults are present by default */}
          </div>
        )}

        {["visas", "moving", "setup"].includes(active) && (
          <div style={{ paddingTop: 8 }}>
            <React.Suspense fallback={<div>Loading...</div>}>
              <CostTable section={active} />
            </React.Suspense>
          </div>
        )}

        {active === "pensions" && (
          <div style={{ paddingTop: 8 }}>
            <React.Suspense fallback={<div>Loading pensions...</div>}>
              <Pensions />
            </React.Suspense>
          </div>
        )}

        {active === "budget" && (
          <div style={{ paddingTop: 8 }}>
            <React.Suspense fallback={<div>Loading budget...</div>}>
              <Budget />
            </React.Suspense>
          </div>
        )}

        {active === "jobs" && (
          <div style={{ paddingTop: 8 }}>
            <React.Suspense fallback={<div>Loading jobs...</div>}>
              <JobsTracker />
            </React.Suspense>
          </div>
        )}

        {active === "housing" && (
          <div style={{ paddingTop: 8 }}>
            <React.Suspense fallback={<div>Loading housing...</div>}>
              <Housing />
            </React.Suspense>
          </div>
        )}

        {active === "overview" && (
          <div style={{ paddingTop: 8 }}>
            <React.Suspense fallback={<div>Loading overview...</div>}>
              <Overview />
            </React.Suspense>
          </div>
        )}

        {/* fallback generic panel for other tabs not yet implemented */}
        {["budget", "taxes"].includes(active) && (
          <div id={`tab-${active}`} className="tab-panel active">
            <div className="panel-header">
              <div>
                <div className="panel-title">
                  {active[0].toUpperCase() + active.slice(1)}
                </div>
                <div className="panel-subtitle">
                  Section content rendered by React
                </div>
              </div>
            </div>

            <div
              style={{
                background: "var(--white)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "1.25rem",
              }}>
              <p style={{ color: "var(--muted)" }}>
                This is a React-powered port of the original static tracker.
                More interactive sections will be added.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MoveTracker;
