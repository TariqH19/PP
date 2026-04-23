import React, { useMemo } from "react";
import { useTracker } from "../context/TrackerContext";

const Overview = () => {
  const {
    tasks,
    costRows,
    fxRate,
    generalNotes,
    addGeneralNote,
    removeGeneralNote,
    links,
    addLink,
    removeLink,
    lastSyncedAt,
  } = useTracker();

  // formatters
  const fmtEur = (n) =>
    new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(n || 0);
  const fmtCad = (n) =>
    new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(n || 0);

  // compute simple progress across tracked task sections
  const sections = Object.keys(tasks || {});
  const { total, completed, sectionProgress } = useMemo(() => {
    let t = 0,
      c = 0;
    const sp = {};
    sections.forEach((s) => {
      const arr = tasks[s] || [];
      const done = arr.filter((it) =>
        (it.status || "").toLowerCase().includes("complete"),
      ).length;
      sp[s] = { total: arr.length, done };
      t += arr.length;
      c += done;
    });
    return { total: t, completed: c, sectionProgress: sp };
  }, [tasks, sections]);

  // compute grand totals from costRows (visas, moving, setup)
  const grandTotals = useMemo(() => {
    let eur = 0;
    ["visas", "moving", "setup"].forEach((s) => {
      const arr = (costRows && costRows[s]) || [];
      arr.forEach((r) => {
        eur += parseFloat(r.costEur) || 0;
      });
    });
    return { eur, cad: eur * (parseFloat(fxRate) || 1) };
  }, [costRows, fxRate]);

  return (
    <div>
      <div className="panel-header">
        <div>
          <div className="panel-title">Overview</div>
          <div className="panel-subtitle">Your relocation snapshot</div>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <div className="card-label">Total Tasks</div>
          <div className="card-value">{total}</div>
          <div className="card-sub">across all sections</div>
        </div>

        <div className="summary-card">
          <div className="card-label">Completed</div>
          <div className="card-value">{completed}</div>
          <div className="card-sub">tasks done</div>
        </div>

        <div className="summary-card maple">
          <div className="card-label">Total Budget (EUR)</div>
          <div className="card-value" id="ov-total-eur">
            {fmtEur(grandTotals.eur)}
          </div>
          <div className="card-sub" id="ov-total-cad">
            {fmtCad(grandTotals.cad)}
          </div>
        </div>

        <div className="summary-card gold">
          <div className="card-label">Move Target</div>
          <div className="card-value">2026</div>
          <div className="card-sub">IEC Working Holiday</div>
        </div>
      </div>

      <div className="progress-overview">
        <h3>Progress by section</h3>
        <div>
          {Object.entries(sectionProgress).map(([key, val]) => {
            const pct =
              val.total > 0 ? Math.round((val.done / val.total) * 100) : 0;
            const labels = {
              before: "Before you go",
              olivia: "Olivia / Nursing",
              arrival: "On arrival",
              finances: "Finances",
              healthcare: "Healthcare",
              taxes: "Taxes",
            };
            return (
              <div key={key} className="progress-bar-wrap">
                <div className="progress-bar-label">{labels[key] || key}</div>
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="progress-bar-pct">{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="notes-section">
        <h3>Daily Notes</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <select
            id="note-author"
            defaultValue="Tariq"
            style={{ padding: "6px 8px" }}>
            <option value="Tariq">Tariq</option>
            <option value="Olivia">Olivia</option>
          </select>
          <input
            id="note-text"
            placeholder="Write a short note of the day..."
            style={{ flex: 1, padding: "6px 8px" }}
          />
          <button
            className="add-btn"
            onClick={() => {
              const author = document.getElementById("note-author").value;
              const text = document.getElementById("note-text").value.trim();
              if (!text) return;
              addGeneralNote(author, text);
              document.getElementById("note-text").value = "";
            }}>
            + Add
          </button>
        </div>
        <div>
          {generalNotes.length === 0 ? (
            <div style={{ color: "var(--muted)" }}>
              No notes yet — add a daily note.
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {generalNotes.map((n, i) => (
                <li
                  key={i}
                  style={{
                    background: "var(--white)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    padding: "8px",
                    marginBottom: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                      {n.author} —{" "}
                      <span
                        style={{
                          color: "var(--muted)",
                          fontWeight: 400,
                          fontSize: "0.8rem",
                        }}>
                        {new Date(n.date).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ marginTop: 4 }}>{n.text}</div>
                  </div>
                  <div>
                    <button
                      className="delete-btn"
                      onClick={() => removeGeneralNote(i)}>
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          background: "var(--white)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "1rem",
          boxShadow: "var(--shadow)",
        }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}>
          <div style={{ fontSize: "0.85rem" }}>
            Quick Links ({links.length})
          </div>
          <button
            className="add-btn"
            onClick={() => {
              const url = window.prompt("Link URL");
              if (!url) return;
              const label = window.prompt("Label (optional)") || url;
              addLink({ url, label });
            }}>
            + Add Link
          </button>
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
          {links.length === 0 ? (
            "No quick links saved."
          ) : (
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {links.map((l, i) => (
                <li
                  key={i}
                  style={{
                    marginBottom: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                  <a href={l.url} target="_blank" rel="noreferrer">
                    {l.label || l.url}
                  </a>
                  <button className="delete-btn" onClick={() => removeLink(i)}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
