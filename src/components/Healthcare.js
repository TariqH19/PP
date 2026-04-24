import React from "react";

const Healthcare = () => {
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
        style={{
          background: "var(--white)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "1rem",
        }}>
        <h3>Tariq</h3>
        <p>
          <strong>OHIP Waiting Period</strong>
          <br />3 months from date of arrival in Ontario. Register at
          ServiceOntario on day 1 — the clock starts from registration, not
          arrival.
        </p>
        <p>
          <strong>Bridge Insurance (0–3 months)</strong>
          <br />
          <strong>Budget:</strong> CAD $150–300/month
          <br />
          Options: Manulife CoverMe, Blue Cross Visitors to Canada, GMS. Get
          quotes before leaving Ireland. Activate from day of departure.
        </p>
        <p>
          <strong>What OHIP Covers (Free)</strong>
          <br />✓ GP visits &nbsp;&nbsp; ✓ Hospital stays &nbsp;&nbsp; ✓
          Emergency care
          <br />✓ Specialist referrals &nbsp;&nbsp; ✓ Surgery &nbsp;&nbsp; ✓ Lab
          tests
        </p>
        <p>
          <strong>NOT Covered by OHIP</strong>
          <br />✗ Prescriptions &nbsp;&nbsp; ✗ Dental &nbsp;&nbsp; ✗ Vision
          <br />✗ Physiotherapy &nbsp;&nbsp; ✗ Ambulance (sometimes charged)
        </p>
        <p>
          <strong>Employer Benefits (PayPal Toronto)</strong>
          <br />
          At CAD $90k+ PayPal will almost certainly offer dental, prescriptions,
          vision, paramedical. Enroll on day 1 of employment — don't delay
          regardless of OHIP status.
        </p>

        <hr className="section-divider" />

        <h3>Olivia</h3>
        <p>
          <strong>OHIP Waiting Period</strong>
          <br />
          Same 3-month wait. Register together at ServiceOntario on arrival day.
        </p>
        <p>
          <strong>Bridge Insurance (0–3 months)</strong>
          <br />
          <strong>Budget:</strong> CAD $150–300/month
          <br />
          Get same plan as Tariq or couple's policy — often cheaper than two
          individual plans. Compare before leaving Ireland.
        </p>
        <p>
          <strong>Employer Benefits (CAMH / Humber)</strong>
          <br />
          ONA-negotiated benefits are excellent — dental, prescriptions, vision,
          paramedical all included. CAMH benefits among best in Ontario. Enroll
          on start date.
        </p>

        <hr className="section-divider" />

        <h3>Occupational Health (Nursing-specific)</h3>
        <p>
          CAMH and Humber will require occupational health screening before
          starting — TB test, immunisation records, N95 fit testing. Gather
          Irish vaccination records before leaving.
        </p>

        <h3>Mental Health Support (Nursing)</h3>
        <p>
          Psychiatric nursing is emotionally demanding. CAMH has strong staff
          mental health support programmes. ONA also provides member assistance
          programmes — know these exist before you need them.
        </p>

        <h3>Finding a GP in Ontario — Important</h3>
        <p>
          ~2 million Ontario residents currently have no family doctor. This is
          a known crisis.
          <br />
          Register on Health Care Connect (ontario.ca/page/find-family-doctor)
          as soon as you have an Ontario address. Use walk-in clinics freely in
          the meantime — covered by OHIP, no appointment needed.
        </p>
        <p>
          Virtual GP services: Maple, Telus Health — often covered by employer
          benefits. Excellent for non-emergency needs.
          <br />
          Pharmacy clinics (Shoppers Drug Mart, Rexall) can handle many minor
          issues without a GP referral.
        </p>
      </div>
    </div>
  );
};

export default Healthcare;
