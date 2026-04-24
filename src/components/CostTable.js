import React from "react";
import { useTracker } from "../context/TrackerContext";

const CostTable = ({ section }) => {
  const { costRows, addCost, updateCost, removeCost, fxRate } = useTracker();
  const rows = costRows[section] || [];

  const formatCad = (eur) => {
    const n = parseFloat(eur) || 0;
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(Math.round(n * fxRate));
  };

  return (
    <div>
      <div className="scroll-hint">← scroll to see all columns</div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}>
        <div style={{ fontWeight: 600 }}>
          {section[0].toUpperCase() + section.slice(1)}
        </div>
        <button className="add-btn" onClick={() => addCost(section)}>
          + Add Item
        </button>
      </div>

      <div className="table-wrap">
        <table id={`${section}-table`}>
          {section === "visas" ? (
            <>
              <thead>
                <tr>
                  <th style={{ minWidth: 160 }}>Task</th>
                  <th style={{ minWidth: 90 }}>Category</th>
                  <th style={{ minWidth: 80 }}>Priority</th>
                  <th style={{ minWidth: 110 }}>Status</th>
                  <th style={{ minWidth: 100 }}>Deadline</th>
                  <th style={{ minWidth: 180 }}>Notes</th>
                  <th style={{ width: 36 }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <textarea
                        value={r.item}
                        onChange={(e) =>
                          updateCost(section, i, { item: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={r.who}
                        onChange={(e) =>
                          updateCost(section, i, { who: e.target.value })
                        }>
                        <option value="Both">Both</option>
                        <option value="Tariq">Tariq</option>
                        <option value="Olivia">Olivia</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={r.priority || "Medium"}
                        onChange={(e) =>
                          updateCost(section, i, { priority: e.target.value })
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
                          updateCost(section, i, { status: e.target.value })
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
                          updateCost(section, i, { deadline: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <textarea
                        value={r.notes}
                        onChange={(e) =>
                          updateCost(section, i, { notes: e.target.value })
                        }
                      />
                    </td>
                    <td className="table-actions">
                      <button
                        className="delete-btn"
                        onClick={() => removeCost(section, i)}>
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          ) : (
            <>
              <thead>
                <tr>
                  {/* Column definitions per section to mirror the HTML layout */}
                  {(() => {
                    const defs = {
                      moving: [
                        {
                          key: "item",
                          label: "Item",
                          thStyle: { minWidth: 160 },
                        },
                        {
                          key: "status",
                          label: "Status",
                          thStyle: { minWidth: 100 },
                        },
                        {
                          key: "costEur",
                          label: "Cost (€)",
                          thStyle: { minWidth: 70 },
                        },
                        {
                          key: "costCad",
                          label: "Cost (CAD)",
                          thStyle: { minWidth: 80 },
                        },
                        {
                          key: "deadline",
                          label: "Date/When",
                          thStyle: { minWidth: 80 },
                        },
                        {
                          key: "notes",
                          label: "Notes",
                          thStyle: { minWidth: 160 },
                        },
                        { key: "actions", label: "", thStyle: { width: 36 } },
                      ],
                      setup: [
                        {
                          key: "item",
                          label: "Item",
                          thStyle: { minWidth: 160 },
                        },
                        {
                          key: "status",
                          label: "Status",
                          thStyle: { minWidth: 100 },
                        },
                        {
                          key: "costEur",
                          label: "Cost (€)",
                          thStyle: { minWidth: 70 },
                        },
                        {
                          key: "costCad",
                          label: "Cost (CAD)",
                          thStyle: { minWidth: 80 },
                        },
                        {
                          key: "priority",
                          label: "Priority",
                          thStyle: { minWidth: 70 },
                        },
                        {
                          key: "notes",
                          label: "Notes",
                          thStyle: { minWidth: 120 },
                        },
                        { key: "actions", label: "", thStyle: { width: 36 } },
                      ],
                    };
                    const cols = defs[section] || defs.moving;
                    return cols.map((c) => (
                      <th key={c.key} style={c.thStyle}>
                        {c.label}
                      </th>
                    ));
                  })()}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td style={{ minWidth: 160 }}>
                      <textarea
                        value={r.item}
                        onChange={(e) =>
                          updateCost(section, i, { item: e.target.value })
                        }
                      />
                    </td>
                    <td style={{ minWidth: 110 }}>
                      <select
                        value={r.status}
                        onChange={(e) =>
                          updateCost(section, i, { status: e.target.value })
                        }>
                        <option>Not Started</option>
                        <option>In Progress</option>
                        <option>Complete</option>
                      </select>
                    </td>
                    <td className="currency-cell" style={{ minWidth: 80 }}>
                      <input
                        type="number"
                        value={r.costEur}
                        onChange={(e) =>
                          updateCost(section, i, { costEur: e.target.value })
                        }
                        style={{ textAlign: "right" }}
                      />
                    </td>
                    <td
                      className="currency-cell cad-display"
                      style={{ minWidth: 90 }}>
                      {formatCad(r.costEur)}
                    </td>
                    <td style={{ minWidth: 100 }}>
                      <input
                        value={r.deadline}
                        onChange={(e) =>
                          updateCost(section, i, { deadline: e.target.value })
                        }
                      />
                    </td>
                    <td style={{ minWidth: 160 }}>
                      <textarea
                        value={r.notes}
                        onChange={(e) =>
                          updateCost(section, i, { notes: e.target.value })
                        }
                      />
                    </td>
                    <td className="table-actions">
                      <button
                        className="delete-btn"
                        onClick={() => removeCost(section, i)}>
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}>
                    <strong>Total</strong>
                  </td>
                  <td className="currency-cell">
                    <strong>
                      {new Intl.NumberFormat("en-IE", {
                        style: "currency",
                        currency: "EUR",
                        maximumFractionDigits: 0,
                      }).format(
                        rows.reduce(
                          (s, v) => s + (parseFloat(v.costEur) || 0),
                          0,
                        ),
                      )}
                    </strong>
                  </td>
                  <td className="currency-cell cad-display">
                    <strong>
                      {new Intl.NumberFormat("en-CA", {
                        style: "currency",
                        currency: "CAD",
                        maximumFractionDigits: 0,
                      }).format(
                        Math.round(
                          rows.reduce(
                            (s, v) => s + (parseFloat(v.costEur) || 0),
                            0,
                          ) * fxRate,
                        ),
                      )}
                    </strong>
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            </>
          )}
        </table>
      </div>
    </div>
  );
};

export default CostTable;
