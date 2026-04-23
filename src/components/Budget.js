import React, { useState, useEffect } from "react";
import { useTracker } from "../context/TrackerContext";

const fmtCAD = (n) => "CAD $" + Math.round(n).toLocaleString();
const fmtEUR = (n, fxRate) => "€" + Math.round(n / fxRate).toLocaleString();

function calcOntarioTakeHome(annualSalary) {
  let fedTax = 0;
  if (annualSalary > 235675) fedTax += (annualSalary - 235675) * 0.33;
  if (annualSalary > 165430)
    fedTax += (Math.min(annualSalary, 235675) - 165430) * 0.29;
  if (annualSalary > 114750)
    fedTax += (Math.min(annualSalary, 165430) - 114750) * 0.26;
  if (annualSalary > 57375)
    fedTax += (Math.min(annualSalary, 114750) - 57375) * 0.205;
  if (annualSalary > 0) fedTax += Math.min(annualSalary, 57375) * 0.15;
  fedTax = Math.max(0, fedTax - 2355);

  let provTax = 0;
  if (annualSalary > 220000) provTax += (annualSalary - 220000) * 0.1316;
  if (annualSalary > 150000)
    provTax += (Math.min(annualSalary, 220000) - 150000) * 0.1316;
  if (annualSalary > 102894)
    provTax += (Math.min(annualSalary, 150000) - 102894) * 0.1116;
  if (annualSalary > 51446)
    provTax += (Math.min(annualSalary, 102894) - 51446) * 0.0915;
  if (annualSalary > 0) provTax += Math.min(annualSalary, 51446) * 0.0505;
  provTax = Math.max(0, provTax - 599);
  if (provTax > 5315) provTax += (provTax - 5315) * 0.2;
  if (provTax > 6802) provTax += (provTax - 6802) * 0.36;

  const cpp = Math.min(annualSalary * 0.0595, 3867);
  const ei = Math.min(annualSalary * 0.01666, 1049);
  const totalDeductions = fedTax + provTax + cpp + ei;
  return Math.round(annualSalary - totalDeductions);
}

const Budget = () => {
  const {
    budgetRows,
    addBudgetRow,
    updateBudgetRow,
    removeBudgetRow,
    fxRate,
    budgetSalaries,
    updateBudgetSalary,
  } = useTracker();
  const [tSalK, setTSalK] = useState(budgetSalaries.t || 90);
  const [oSalK, setOSalK] = useState(budgetSalaries.o || 75);

  useEffect(() => {
    updateBudgetSalary("t", Number(tSalK) || 0);
  }, [tSalK, updateBudgetSalary]);
  useEffect(() => {
    updateBudgetSalary("o", Number(oSalK) || 0);
  }, [oSalK, updateBudgetSalary]);

  const totalFixed = (budgetRows.fixed || []).reduce(
    (s, r) => s + (r.amount || 0),
    0,
  );
  const totalVariable = (budgetRows.variable || []).reduce(
    (s, r) => s + (r.amount || 0),
    0,
  );
  const totalSavings = (budgetRows.savings || []).reduce(
    (s, r) => s + (r.amount || 0),
    0,
  );

  const tSal = Math.round((Number(tSalK) || 0) * 1000);
  const oSal = Math.round((Number(oSalK) || 0) * 1000);
  const tNet = Math.round(calcOntarioTakeHome(tSal) / 12);
  const oNet = Math.round(calcOntarioTakeHome(oSal) / 12);
  const combinedNet = tNet + oNet;
  const totalExpenses = totalFixed + totalVariable + totalSavings;
  const surplus = combinedNet - totalExpenses;
  const savingsRate =
    combinedNet > 0 ? Math.round((totalSavings / combinedNet) * 100) : 0;

  return (
    <div>
      <div className="panel-header">
        <div>
          <div className="panel-title">Monthly Budget — Toronto</div>
          <div className="panel-subtitle">
            Projected living costs for Tariq & Olivia
          </div>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        className="person-grid">
        <div
          style={{
            background: "var(--white)",
            border: "2px solid var(--emerald)",
            borderRadius: 8,
            padding: 12,
          }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Salaries</div>
          <label
            style={{
              fontSize: "0.65rem",
              display: "flex",
              justifyContent: "space-between",
              color: "var(--muted)",
            }}>
            Gross Salary (CAD k/yr){" "}
            <span style={{ color: "var(--ink)", fontWeight: 500 }}>
              {"CAD $" + tSalK + "k"}
            </span>
          </label>
          <input
            id="b-t-sal"
            type="range"
            min={50}
            max={200}
            step={5}
            value={tSalK}
            onChange={(e) => setTSalK(e.target.value)}
          />
          <div style={{ marginTop: 8 }}>
            <div>Gross monthly: {fmtCAD(Math.round(tSal / 12))}</div>
            <div>Net monthly: {fmtCAD(tNet)}</div>
          </div>
        </div>

        <div
          style={{
            background: "var(--white)",
            border: "2px solid var(--maple)",
            borderRadius: 8,
            padding: 12,
          }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Olivia</div>
          <label
            style={{
              fontSize: "0.65rem",
              display: "flex",
              justifyContent: "space-between",
              color: "var(--muted)",
            }}>
            Gross Salary (CAD k/yr){" "}
            <span style={{ color: "var(--ink)", fontWeight: 500 }}>
              {"CAD $" + oSalK + "k"}
            </span>
          </label>
          <input
            id="b-o-sal"
            type="range"
            min={50}
            max={150}
            step={5}
            value={oSalK}
            onChange={(e) => setOSalK(e.target.value)}
          />
          <div style={{ marginTop: 8 }}>
            <div>Gross monthly: {fmtCAD(Math.round(oSal / 12))}</div>
            <div>Net monthly: {fmtCAD(oNet)}</div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
          marginTop: 12,
        }}>
        {["fixed", "variable", "savings"].map((type) => (
          <div
            key={type}
            style={{
              background: "var(--white)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 12,
            }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              {type[0].toUpperCase() + type.slice(1)}
            </div>
            {(budgetRows[type] || []).map((row, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 8,
                }}>
                <input
                  className="budget-row-label"
                  value={row.label}
                  placeholder="Item..."
                  onChange={(e) =>
                    updateBudgetRow(type, i, { label: e.target.value })
                  }
                />
                <input
                  className="budget-row-amount"
                  type="number"
                  value={row.amount}
                  min="0"
                  step="10"
                  onChange={(e) =>
                    updateBudgetRow(type, i, {
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <span className="budget-row-eur">
                  {fmtEUR(row.amount || 0, fxRate)}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => removeBudgetRow(type, i)}>
                  ×
                </button>
              </div>
            ))}
            <button className="add-btn" onClick={() => addBudgetRow(type)}>
              Add
            </button>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 12,
          background: "var(--white)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 12,
        }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 600 }}>Combined net / month</div>
            <div style={{ fontSize: "1.1rem" }}>
              {fmtCAD(combinedNet)}{" "}
              <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                {fmtEUR(combinedNet, fxRate)}
              </span>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>Total expenses</div>
            <div>
              {fmtCAD(totalExpenses)}{" "}
              <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                {fmtEUR(totalExpenses, fxRate)}
              </span>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>Surplus</div>
            <div
              style={{
                color: surplus >= 0 ? "var(--emerald)" : "var(--maple)",
              }}>
              {fmtCAD(surplus)}{" "}
              <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                {fmtEUR(Math.abs(surplus), fxRate)}
              </span>
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              Savings rate: {savingsRate}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
