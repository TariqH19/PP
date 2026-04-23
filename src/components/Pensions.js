import React, { useMemo } from "react";
import { useTracker } from "../context/TrackerContext";

const fmtPot = (n, prefix) => {
  if (n >= 1000000) return prefix + (n / 1000000).toFixed(2) + "M";
  if (n >= 1000) return prefix + Math.round(n / 1000) + "k";
  return prefix + Math.round(n);
};

const calcIrishFrozen = (existingPot, annualContrib, years, rate) => {
  let pot = existingPot;
  for (let y = 0; y < years; y++) {
    pot *= 1 + rate;
    if (y < 1) pot += annualContrib;
  }
  return pot;
};

const calcCanadaPot = (annualContrib, years, rate) => {
  let pot = 0;
  for (let y = 0; y < years; y++) {
    pot = (pot + annualContrib) * (1 + rate);
  }
  return pot;
};

const fmtRetire = (cadAmount, fxRate, asEur = false) => {
  if (asEur) {
    const eur = cadAmount / fxRate;
    return "€" + Math.round(eur).toLocaleString();
  }
  return "CAD $" + Math.round(cadAmount).toLocaleString();
};

const Pensions = () => {
  const { pensions, updatePension, fxRate } = useTracker();
  const [currency, setCurrency] = React.useState("CAD");

  const results = useMemo(() => {
    const tEurSal = parseInt(pensions.tariq.eurSal || "0") * 1000;
    const tEurPct = (parseInt(pensions.tariq.eurPct || "0") || 0) / 100;
    const tCadSal = parseInt(pensions.tariq.cadSal || "0") * 1000;
    const tCadPct = (parseInt(pensions.tariq.cadPct || "0") || 0) / 100;
    const oCadSal = parseInt(pensions.olivia.cadSal || "0") * 1000;
    const oCadPct = (parseInt(pensions.olivia.cadPct || "0") || 0) / 100;
    const oHooppYrs = parseInt(pensions.olivia.hooppYrs || "0") || 0;

    const tIrishAnnual = tEurSal * tEurPct;
    const tIrishMonthly = (tIrishAnnual * 0.6) / 12; // after 40% relief
    const tCadMonthly = (tCadSal * tCadPct) / 12;
    const tIrishPot = calcIrishFrozen(12473, tIrishAnnual, 36, 0.0555);
    const tTfsaPot = calcCanadaPot(tCadSal * tCadPct, 36, 0.07);

    const oCadMonthly = (oCadSal * oCadPct) / 12;
    const oIrishPot = calcIrishFrozen(0, 0, 36, 0.0555);
    const oTfsaPot = calcCanadaPot(oCadSal * oCadPct, 36, 0.07);
    const hooppAnnual = oCadSal * 0.02 * oHooppYrs;

    const tTotal = tTfsaPot + tIrishPot * fxRate;
    const oTotal = oTfsaPot;
    const grandTotal = tTotal + oTotal;
    const grandReal = grandTotal / 2.9;

    const DR = 0.04;
    const tCpp = 17500;
    const oCpp = 15000;

    const tRetTfsa = tTfsaPot * DR;
    const tRetIrish = tIrishPot * DR * fxRate;
    const tRetTotal = tRetTfsa + tRetIrish + tCpp;

    const oRetTfsa = oTfsaPot * DR;
    const oRetTotal = oRetTfsa + hooppAnnual + oCpp;

    const combinedRetire = tRetTotal + oRetTotal;
    const combinedRetireReal = combinedRetire / 2.9;

    return {
      tIrishPot,
      tTfsaPot,
      tIrishMonthly,
      tCadMonthly,
      oIrishPot,
      oTfsaPot,
      oCadMonthly,
      hooppAnnual,
      tTotal,
      oTotal,
      grandTotal,
      grandReal,
      tRetTfsa,
      tRetIrish,
      tRetTotal,
      oRetTfsa,
      oRetTotal,
      combinedRetire,
      combinedRetireReal,
    };
  }, [pensions, fxRate]);

  return (
    <div>
      <div className="panel-header">
        <div>
          <div className="panel-title">Pensions & Retirement</div>
          <div className="panel-subtitle">
            Irish pots + Canadian projections for Tariq & Olivia — adjust
            sliders to explore
          </div>
        </div>
      </div>

      <div
        className="pension-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}>
        <div
          style={{
            background: "var(--white)",
            border: "2px solid var(--emerald)",
            borderRadius: "var(--radius)",
            padding: "1.5rem",
            boxShadow: "var(--shadow)",
          }}>
          <div
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "1.1rem",
              color: "var(--emerald)",
              fontWeight: 600,
              marginBottom: "1.25rem",
              paddingBottom: "0.75rem",
              borderBottom: "1px solid var(--border)",
            }}>
            Tariq — Pension Projections
          </div>
          <label
            style={{
              fontSize: "0.65rem",
              display: "flex",
              justifyContent: "space-between",
              color: "var(--muted)",
            }}>
            Irish Salary (€k){" "}
            <span style={{ color: "var(--ink)", fontWeight: 500 }}>
              {"€" + (pensions.tariq.eurSal || "0") + "k"}
            </span>
          </label>
          <input
            type="range"
            min={40}
            max={120}
            step={1}
            value={pensions.tariq.eurSal || "0"}
            onChange={(e) => updatePension("tariq", { eurSal: e.target.value })}
          />
          <label
            style={{
              fontSize: "0.65rem",
              display: "flex",
              justifyContent: "space-between",
              color: "var(--muted)",
            }}>
            Irish Contrib %{" "}
            <span style={{ color: "var(--ink)", fontWeight: 500 }}>
              {(pensions.tariq.eurPct || "0") + "%"}
            </span>
          </label>
          <input
            type="range"
            min={1}
            max={15}
            step={1}
            value={pensions.tariq.eurPct || "0"}
            onChange={(e) => updatePension("tariq", { eurPct: e.target.value })}
          />
          <label
            style={{
              fontSize: "0.65rem",
              display: "flex",
              justifyContent: "space-between",
              color: "var(--muted)",
            }}>
            Canadian Salary (CAD k){" "}
            <span style={{ color: "var(--ink)", fontWeight: 500 }}>
              {"CAD $" + (pensions.tariq.cadSal || "0") + "k"}
            </span>
          </label>
          <input
            type="range"
            min={60}
            max={200}
            step={5}
            value={pensions.tariq.cadSal || "0"}
            onChange={(e) => updatePension("tariq", { cadSal: e.target.value })}
          />
          <label
            style={{
              fontSize: "0.65rem",
              display: "flex",
              justifyContent: "space-between",
              color: "var(--muted)",
            }}>
            Canadian Contrib %{" "}
            <span style={{ color: "var(--ink)", fontWeight: 500 }}>
              {(pensions.tariq.cadPct || "0") + "%"}
            </span>
          </label>
          <input
            type="range"
            min={1}
            max={25}
            step={1}
            value={pensions.tariq.cadPct || "0"}
            onChange={(e) => updatePension("tariq", { cadPct: e.target.value })}
          />

          <div style={{ marginTop: 12 }}>
            <div>Tariq Irish pot: {fmtPot(results.tIrishPot, "€")}</div>
            <div>Tariq TFSA pot: {fmtPot(results.tTfsaPot, "CAD $")}</div>
            <div>
              Tariq monthly Irish: €{Math.round(results.tIrishMonthly)}/mo
            </div>
            <div>
              Tariq monthly CAD: CAD ${Math.round(results.tCadMonthly)}/mo
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--white)",
            border: "2px solid var(--maple)",
            borderRadius: "var(--radius)",
            padding: "1.5rem",
            boxShadow: "var(--shadow)",
          }}>
          <div
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "1.1rem",
              color: "var(--maple)",
              fontWeight: 600,
              marginBottom: "1.25rem",
              paddingBottom: "0.75rem",
              borderBottom: "1px solid var(--border)",
            }}>
            Olivia — Pension Projections
          </div>
          <label
            style={{
              fontSize: "0.65rem",
              display: "flex",
              justifyContent: "space-between",
              color: "var(--muted)",
            }}>
            Canadian Salary (CAD k){" "}
            <span style={{ color: "var(--ink)", fontWeight: 500 }}>
              {"CAD $" + (pensions.olivia.cadSal || "0") + "k"}
            </span>
          </label>
          <input
            type="range"
            min={50}
            max={150}
            step={5}
            value={pensions.olivia.cadSal || "0"}
            onChange={(e) =>
              updatePension("olivia", { cadSal: e.target.value })
            }
          />
          <label
            style={{
              fontSize: "0.65rem",
              display: "flex",
              justifyContent: "space-between",
              color: "var(--muted)",
            }}>
            Canadian Contrib %{" "}
            <span style={{ color: "var(--ink)", fontWeight: 500 }}>
              {(pensions.olivia.cadPct || "0") + "%"}
            </span>
          </label>
          <input
            type="range"
            min={1}
            max={25}
            step={1}
            value={pensions.olivia.cadPct || "0"}
            onChange={(e) =>
              updatePension("olivia", { cadPct: e.target.value })
            }
          />
          <label
            style={{
              fontSize: "0.65rem",
              display: "flex",
              justifyContent: "space-between",
              color: "var(--muted)",
            }}>
            HOOPP Years of Service{" "}
            <span style={{ color: "var(--maple)", fontWeight: 500 }}>
              {(pensions.olivia.hooppYrs || "0") + " yrs"}
            </span>
          </label>
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={pensions.olivia.hooppYrs || "0"}
            onChange={(e) =>
              updatePension("olivia", { hooppYrs: e.target.value })
            }
          />

          <div style={{ marginTop: 12 }}>
            <div>Olivia TFSA pot: {fmtPot(results.oTfsaPot, "CAD $")}</div>
            <div>
              Olivia HOOPP annual estimate:{" "}
              {fmtPot(results.hooppAnnual, "CAD $")}/yr
            </div>
            <div>
              Olivia monthly CAD: CAD ${Math.round(results.oCadMonthly)}/mo
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div
          style={{
            background: "var(--white)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "var(--shadow)",
          }}>
          <div
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "1.1rem",
              color: "var(--ink)",
              fontWeight: 600,
              marginBottom: "1rem",
            }}>
            Combined Household at Retirement
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
              gap: "1rem",
            }}>
            <div
              style={{
                background: "var(--emerald-light)",
                borderRadius: "var(--radius)",
                padding: "1rem",
                textAlign: "center",
              }}>
              <div
                style={{
                  fontSize: "0.62rem",
                  color: "var(--emerald)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "4px",
                }}>
                Tariq TFSA + Irish
              </div>
              <div
                style={{
                  fontFamily: "Fraunces, serif",
                  fontSize: "1.2rem",
                  color: "var(--emerald)",
                  fontWeight: 600,
                }}>
                {fmtPot(results.tTotal, "CAD $")}
              </div>
            </div>
            <div
              style={{
                background: "var(--maple-light)",
                borderRadius: "var(--radius)",
                padding: "1rem",
                textAlign: "center",
              }}>
              <div
                style={{
                  fontSize: "0.62rem",
                  color: "var(--maple)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "4px",
                }}>
                Olivia TFSA
              </div>
              <div
                style={{
                  fontFamily: "Fraunces, serif",
                  fontSize: "1.2rem",
                  color: "var(--maple)",
                  fontWeight: 600,
                }}>
                {fmtPot(results.oTotal, "CAD $")}
              </div>
            </div>
            <div
              style={{
                background: "var(--gold-light)",
                borderRadius: "var(--radius)",
                padding: "1rem",
                textAlign: "center",
              }}>
              <div
                style={{
                  fontSize: "0.62rem",
                  color: "#8a6a00",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "4px",
                }}>
                Combined Household
              </div>
              <div
                style={{
                  fontFamily: "Fraunces, serif",
                  fontSize: "1.4rem",
                  color: "#8a6a00",
                  fontWeight: 600,
                }}>
                {fmtPot(results.grandTotal, "CAD $")}
              </div>
            </div>
            <div
              style={{
                background: "#e8f0fe",
                borderRadius: "var(--radius)",
                padding: "1rem",
                textAlign: "center",
              }}>
              <div
                style={{
                  fontSize: "0.62rem",
                  color: "#185fa5",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "4px",
                }}>
                In Today's Money (~÷2.9)
              </div>
              <div
                style={{
                  fontFamily: "Fraunces, serif",
                  fontSize: "1.2rem",
                  color: "#185fa5",
                  fontWeight: 600,
                }}>
                {fmtPot(results.grandReal, "CAD $")}
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: "0.72rem",
              color: "var(--muted)",
              marginTop: "1rem",
              lineHeight: "1.6",
            }}>
            Plus: CPP for both — potentially CAD $15,000–20,000/year each in
            today's money. Plus Olivia's potential HOOPP defined benefit pension
            if CAMH-eligible.
          </div>
        </div>

        <div
          style={{
            background: "var(--white)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "var(--shadow)",
          }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginBottom: "1.25rem",
            }}>
            <div
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "1.1rem",
                color: "var(--ink)",
                fontWeight: 600,
              }}>
              Estimated Retirement Income
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}>
              <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                Assumes 4% drawdown · 25yr retirement
              </span>
              <div className="currency-toggle">
                <button
                  className={currency === "CAD" ? "active" : ""}
                  onClick={() => setCurrency("CAD")}>
                  CAD $
                </button>
                <button
                  className={currency === "EUR" ? "active" : ""}
                  onClick={() => setCurrency("EUR")}>
                  EUR €
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
            className="person-grid retire-grid">
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  color: "var(--emerald)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.5rem",
                }}>
                Tariq
              </div>
              <div className="retire-card">
                <div className="retire-row">
                  <span className="retire-label">TFSA drawdown (4%/yr)</span>
                  <span className="retire-value">
                    {fmtRetire(results.tRetTfsa, fxRate, currency === "EUR")}
                  </span>
                </div>
                <div className="retire-row">
                  <span className="retire-label">Irish pension drawdown</span>
                  <span className="retire-value">
                    {fmtRetire(results.tRetIrish, fxRate, currency === "EUR")}
                  </span>
                </div>
                <div className="retire-row">
                  <span className="retire-label">CPP estimate</span>
                  <span className="retire-value">
                    {fmtRetire(17500, fxRate, currency === "EUR")}
                  </span>
                </div>
                <div
                  className="retire-row"
                  style={{ background: "var(--emerald-light)" }}>
                  <span style={{ color: "var(--emerald)", fontWeight: 500 }}>
                    Total annual income
                  </span>
                  <span
                    className="retire-value"
                    style={{ color: "var(--emerald)" }}>
                    {fmtRetire(results.tRetTotal, fxRate, currency === "EUR")}
                  </span>
                </div>
              </div>
              <div
                style={{
                  fontSize: "0.68rem",
                  color: "var(--muted)",
                  marginTop: "0.5rem",
                  lineHeight: "1.5",
                }}>
                TFSA withdrawals fully tax-free. Irish pension tax-free under
                double tax treaty. CPP estimated — depends on years contributed.
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  color: "var(--maple)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.5rem",
                }}>
                Olivia
              </div>
              <div className="retire-card">
                <div className="retire-row">
                  <span className="retire-label">TFSA drawdown (4%/yr)</span>
                  <span className="retire-value">
                    {fmtRetire(results.oRetTfsa, fxRate, currency === "EUR")}
                  </span>
                </div>
                <div className="retire-row">
                  <span className="retire-label">HOOPP pension (est.)</span>
                  <span className="retire-value">
                    {fmtRetire(results.hooppAnnual, fxRate, currency === "EUR")}
                  </span>
                </div>
                <div className="retire-row">
                  <span className="retire-label">CPP estimate</span>
                  <span className="retire-value">
                    {fmtRetire(15000, fxRate, currency === "EUR")}
                  </span>
                </div>
                <div
                  className="retire-row"
                  style={{ background: "var(--maple-light)" }}>
                  <span style={{ color: "var(--maple)", fontWeight: 500 }}>
                    Total annual income
                  </span>
                  <span
                    className="retire-value"
                    style={{ color: "var(--maple)" }}>
                    {fmtRetire(results.oRetTotal, fxRate, currency === "EUR")}
                  </span>
                </div>
              </div>
              <div
                style={{
                  fontSize: "0.68rem",
                  color: "var(--muted)",
                  marginTop: "0.5rem",
                  lineHeight: "1.5",
                }}>
                TFSA withdrawals fully tax-free. HOOPP is a defined benefit —
                guaranteed income regardless of markets.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HOOPP EXPLAINER - copied structure from public/canada.html */}
      <div
        style={{
          background: "var(--white)",
          border: "2px solid var(--maple)",
          borderRadius: "var(--radius)",
          padding: "1.5rem",
          boxShadow: "var(--shadow)",
          marginTop: "1rem",
        }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.25rem",
            paddingBottom: "0.75rem",
            borderBottom: "1px solid var(--border)",
          }}>
          <div
            style={{
              background: "var(--maple-light)",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: "0.7rem",
              fontWeight: 500,
              color: "var(--maple)",
            }}>
            H
          </div>
          <div>
            <div
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "1.1rem",
                color: "var(--maple)",
                fontWeight: 600,
              }}>
              HOOPP — Healthcare of Ontario Pension Plan
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
              Olivia's most important financial asset if she qualifies
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.25rem",
            marginBottom: "1.25rem",
          }}
          className="person-grid">
          <div>
            <div
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "0.5rem",
              }}>
              What is HOOPP?
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                lineHeight: "1.8",
                color: "var(--ink)",
              }}>
              HOOPP is a defined benefit (DB) pension plan — one of the best in
              Canada. Unlike a TFSA or RRSP where your payout depends on market
              performance, HOOPP <strong>guarantees</strong> a specific income
              for life based on a formula. Markets go up or down — your HOOPP
              pension doesn't change. It is fully funded and one of the most
              stable pension plans in the world.
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "0.5rem",
              }}>
              Who qualifies?
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                lineHeight: "1.8",
                color: "var(--ink)",
              }}>
              HOOPP covers employees at{" "}
              <strong>participating healthcare employers</strong> in Ontario.
              CAMH is a HOOPP employer — Olivia would almost certainly be
              enrolled automatically as a full-time registered nurse. Part-time
              staff may need to opt in — check on day one of employment.
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "0.5rem",
              }}>
              How the pension is calculated
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                lineHeight: "1.8",
                color: "var(--ink)",
              }}>
              Annual pension ={" "}
              <strong>
                2% × years of service × best 5-year average salary
              </strong>
              <br />
              Example: 30 years service at avg CAD $85k ={" "}
              <strong>CAD $51,000/year for life</strong>, inflation-indexed.
              This is on top of TFSA and CPP — not instead of them.
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "0.5rem",
              }}>
              Contributions
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                lineHeight: "1.8",
                color: "var(--ink)",
              }}>
              Employee contributes roughly <strong>6.9–9% of salary</strong>{" "}
              depending on earnings. Employer matches contributions. Both come
              off payroll automatically. The more years Olivia works in Ontario
              healthcare, the larger her pension — every year counts
              significantly.
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "0.5rem",
              }}>
              Portability
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                lineHeight: "1.8",
                color: "var(--ink)",
              }}>
              If Olivia moves between HOOPP employers her pension credits
              transfer seamlessly. If she leaves Ontario healthcare entirely,
              she can either take a deferred pension (paid at 65) or transfer
              the commuted value to an RRSP/LIRA — nothing is lost.
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "0.5rem",
              }}>
              Why this matters so much
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                lineHeight: "1.8",
                color: "var(--ink)",
              }}>
              Most Canadians rely entirely on market-based savings (TFSA/RRSP)
              which can fall 30–40% in a bad year. Olivia having a{" "}
              <strong>guaranteed, inflation-protected income for life</strong>{" "}
              from HOOPP fundamentally changes your retirement picture. It means
              Tariq's TFSA is upside — not necessity.
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--maple-light)",
            borderRadius: "var(--radius)",
            padding: "1rem",
            fontSize: "0.78rem",
            lineHeight: "1.8",
          }}>
          <strong style={{ color: "var(--maple)" }}>
            Action on day one at CAMH or Humber:
          </strong>{" "}
          Confirm HOOPP enrolment with HR. Make sure you are enrolled as a{" "}
          <em>full member</em> not just a deferred member. Ask for your member
          number and register at <strong>hoopp.com</strong>. Start your pension
          statement tracking from year one — every year of credited service adds
          approximately{" "}
          <strong>2% of your best average salary per year, for life</strong>.
        </div>
      </div>
    </div>
  );
};

export default Pensions;
