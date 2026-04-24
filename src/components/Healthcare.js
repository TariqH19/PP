import React from "react";
import { useTracker } from "../context/TrackerContext";

const Healthcare = () => {
  const { tasks, addTask, updateTask, removeTask } = useTracker();
  const rows = tasks.healthcare || [];

  return (
    <div>
      <div className="panel-header">
        <div>
          <div className="panel-title">Healthcare — Ontario (OHIP)</div>
          <div className="panel-subtitle">
            What you need to know and track for Tariq & Olivia
          </div>
        </div>
      </div>

      <div
        className="person-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}>
        <div className="summary-card" style={{ padding: "1.5rem" }}>
          <div
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "1.1rem",
              color: "var(--emerald)",
              fontWeight: 600,
              marginBottom: "1rem",
              paddingBottom: "0.75rem",
              borderBottom: "1px solid var(--border)",
            }}>
            Tariq
          </div>

          <div
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "0.5rem",
            }}>
            OHIP Waiting Period
          </div>
          <div
            style={{
              fontSize: "0.85rem",
              marginBottom: "1rem",
              lineHeight: 1.6,
            }}>
            3 months from date of arrival in Ontario. Register at ServiceOntario
            on day 1 — the clock starts from registration, not arrival.
          </div>

          <div
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "0.5rem",
            }}>
            Bridge Insurance (0–3 months)
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}>
            <span style={{ fontSize: "0.85rem" }}>Budget:</span>
            <span
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "1.1rem",
                color: "var(--maple)",
              }}>
              CAD $150–300/month
            </span>
          </div>
          <div
            style={{
              fontSize: "0.78rem",
              color: "var(--muted)",
              marginBottom: "1rem",
              lineHeight: 1.6,
            }}>
            Options: Manulife CoverMe, Blue Cross Visitors to Canada, GMS. Get
            quotes before leaving Ireland. Activate from day of departure.
          </div>

          <div
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "0.5rem",
            }}>
            What OHIP Covers (Free)
          </div>
          <div
            style={{
              fontSize: "0.78rem",
              lineHeight: 1.8,
              marginBottom: "1rem",
            }}>
            ✓ GP visits &nbsp;&nbsp; ✓ Hospital stays &nbsp;&nbsp; ✓ Emergency
            care
            <br />✓ Specialist referrals &nbsp;&nbsp; ✓ Surgery &nbsp;&nbsp; ✓
            Lab tests
          </div>

          <div
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "0.5rem",
            }}>
            NOT Covered by OHIP
          </div>
          <div
            style={{
              fontSize: "0.78rem",
              lineHeight: 1.8,
              marginBottom: "1rem",
              color: "#b84c00",
            }}>
            ✗ Prescriptions &nbsp;&nbsp; ✗ Dental &nbsp;&nbsp; ✗ Vision
            <br />✗ Physiotherapy &nbsp;&nbsp; ✗ Ambulance (sometimes charged)
          </div>

          <div
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "0.5rem",
            }}>
            Employer Benefits (PayPal Toronto)
          </div>
          <div
            style={{
              fontSize: "0.78rem",
              lineHeight: 1.6,
              color: "var(--emerald)",
            }}>
            At CAD $90k+ PayPal will almost certainly offer dental,
            prescriptions, vision, paramedical. Enroll on day 1 of employment —
            don't delay regardless of OHIP status.
          </div>
        </div>

        <div className="summary-card" style={{ padding: "1.5rem" }}>
          <div
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "1.1rem",
              color: "var(--maple)",
              fontWeight: 600,
              marginBottom: "1rem",
              paddingBottom: "0.75rem",
              borderBottom: "1px solid var(--border)",
            }}>
            Olivia
          </div>

          <div
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "0.5rem",
            }}>
            OHIP Waiting Period
          </div>
          <div
            style={{
              fontSize: "0.85rem",
              marginBottom: "1rem",
              lineHeight: 1.6,
            }}>
            Same 3-month wait. Register together at ServiceOntario on arrival
            day.
          </div>

          <div
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "0.5rem",
            }}>
            Bridge Insurance (0–3 months)
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}>
            <span style={{ fontSize: "0.85rem" }}>Budget:</span>
            <span
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "1.1rem",
                color: "var(--maple)",
              }}>
              CAD $150–300/month
            </span>
          </div>
          <div
            style={{
              fontSize: "0.78rem",
              color: "var(--muted)",
              marginBottom: "1rem",
              lineHeight: 1.6,
            }}>
            Get same plan as Tariq or couple's policy — often cheaper than two
            individual plans. Compare before leaving Ireland.
          </div>

          <div
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "0.5rem",
            }}>
            Employer Benefits (CAMH / Humber)
          </div>
          <div
            style={{
              fontSize: "0.78rem",
              lineHeight: 1.6,
              color: "var(--emerald)",
              marginBottom: "1rem",
            }}>
            ONA-negotiated benefits are excellent — dental, prescriptions,
            vision, paramedical all included. CAMH benefits among best in
            Ontario. Enroll on start date.
          </div>

          <div
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "0.5rem",
            }}>
            Occupational Health (Nursing-specific)
          </div>
          <div
            style={{
              fontSize: "0.78rem",
              lineHeight: 1.6,
              marginBottom: "1rem",
            }}>
            CAMH and Humber will require occupational health screening before
            starting — TB test, immunisation records, N95 fit testing. Gather
            Irish vaccination records before leaving.
          </div>

          <div
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "0.5rem",
            }}>
            Mental Health Support (Nursing)
          </div>
          <div
            style={{
              fontSize: "0.78rem",
              lineHeight: 1.6,
              color: "var(--muted)",
            }}>
            Psychiatric nursing is emotionally demanding. CAMH has strong staff
            mental health support programmes. ONA also provides member
            assistance programmes — know these exist before you need them.
          </div>
        </div>
      </div>

      <div className="notes-section">
        <div
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#8a6a00",
            marginBottom: "0.75rem",
          }}>
          Finding a GP in Ontario — Important
        </div>
        <div
          style={{ fontSize: "0.78rem", lineHeight: 1.8, color: "var(--ink)" }}>
          ~2 million Ontario residents currently have no family doctor. This is
          a known crisis.
          <br />
          <strong>
            Register on Health Care Connect (ontario.ca/page/find-family-doctor)
          </strong>{" "}
          as soon as you have an Ontario address.
          <br />
          Use <strong>walk-in clinics</strong> freely in the meantime — covered
          by OHIP, no appointment needed.
          <br />
          <strong>Virtual GP services</strong>: Maple, Telus Health — often
          covered by employer benefits. Excellent for non-emergency needs.
          <br />
          <strong>Pharmacy clinics</strong> (Shoppers Drug Mart, Rexall) can
          handle many minor issues without a GP referral.
        </div>
      </div>

      <div className="panel-header" style={{ marginTop: "1.5rem" }}>
        <div className="panel-title" style={{ fontSize: "1.1rem" }}>
          Healthcare Checklist
        </div>
        <button className="add-btn" onClick={() => addTask("healthcare")}>
          + Add Task
        </button>
      </div>
      <div className="scroll-hint">← scroll to see all columns</div>

      <div className="table-wrap">
        <table id="healthcare-table">
          <thead>
            <tr>
              <th style={{ minWidth: 160 }}>Task</th>
              <th style={{ minWidth: 80 }}>Who</th>
              <th style={{ minWidth: 80 }}>Priority</th>
              <th style={{ minWidth: 110 }}>Status</th>
              <th style={{ minWidth: 100 }}>Timeframe</th>
              <th style={{ minWidth: 180 }}>Notes</th>
              <th style={{ width: 36 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>
                  <textarea
                    value={r.description}
                    onChange={(e) =>
                      updateTask("healthcare", i, {
                        description: e.target.value,
                      })
                    }
                  />
                </td>
                <td>
                  <select
                    value={r.category}
                    onChange={(e) =>
                      updateTask("healthcare", i, { category: e.target.value })
                    }>
                    <option value="Both">Both</option>
                    <option value="Tariq">Tariq</option>
                    <option value="Olivia">Olivia</option>
                  </select>
                </td>
                <td>
                  <select
                    value={r.priority}
                    onChange={(e) =>
                      updateTask("healthcare", i, { priority: e.target.value })
                    }>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </td>
                <td>
                  <select
                    value={r.status}
                    onChange={(e) =>
                      updateTask("healthcare", i, { status: e.target.value })
                    }>
                    <option>Not Started</option>
                    <option>Researching</option>
                    <option>In Progress</option>
                    <option>Waiting</option>
                    <option>Complete</option>
                    <option>Blocked</option>
                  </select>
                </td>
                <td>
                  <input
                    value={r.deadline}
                    onChange={(e) =>
                      updateTask("healthcare", i, { deadline: e.target.value })
                    }
                  />
                </td>
                <td>
                  <textarea
                    value={r.notes}
                    onChange={(e) =>
                      updateTask("healthcare", i, { notes: e.target.value })
                    }
                  />
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => removeTask("healthcare", i)}>
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Healthcare;
