import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import supabase from "../services/supabaseClient";

const TrackerContext = createContext(null);

export const useTracker = () => useContext(TrackerContext);

const STORAGE_KEY = "pp_tracker_state_v1";

export const TrackerProvider = ({ children }) => {
  const [fxRate, setFxRate] = useState(1.6);
  const [generalNotes, setGeneralNotes] = useState([]);
  const DEFAULT_LINKS = [
    {
      label: "IRCC — IEC Application",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec.html",
      cat: "Immigration",
    },
    {
      label: "CNO — Nurse Registration",
      url: "https://www.cno.org/en/become-a-nurse/new-applicants/internationally-educated-nurses/",
      cat: "Nursing",
    },
    {
      label: "NMBI — Good Standing Certificate",
      url: "https://www.nmbi.ie/Registration/Certificates-and-Verification",
      cat: "Nursing",
    },
    {
      label: "CAMH Careers",
      url: "https://www.camh.ca/en/driving-change/careers-at-camh",
      cat: "Nursing",
    },
    {
      label: "Humber River Health Careers",
      url: "https://www.humberriver.ca/about-us/careers/",
      cat: "Nursing",
    },
    {
      label: "HOOPP Member Portal",
      url: "https://www.hoopp.com",
      cat: "Finance",
    },
    {
      label: "Ontario Health Care Connect (Find a GP)",
      url: "https://hcc3.healthcareconnect.ontario.ca/",
      cat: "Health",
    },
    {
      label: "ServiceOntario — OHIP Registration",
      url: "https://www.ontario.ca/page/apply-ohip-and-get-health-card",
      cat: "Health",
    },
    {
      label: "Zumper — Toronto Rentals",
      url: "https://www.zumper.com/apartments-for-rent/toronto-on",
      cat: "Housing",
    },
    {
      label: "Rentals.ca — Toronto",
      url: "https://rentals.ca/toronto",
      cat: "Housing",
    },
    {
      label: "OINP — Ontario Immigrant Nominee Program",
      url: "https://www.ontario.ca/page/ontario-immigrant-nominee-program-oinp",
      cat: "Immigration",
    },
    {
      label: "Express Entry — IRCC",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html",
      cat: "Immigration",
    },
  ];

  const [links, setLinks] = useState(DEFAULT_LINKS);
  // Default tasks copied from public/canada.html so they exist by default
  const DEFAULT_BEFORE = [
    {
      description: "Research IEC application process",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "ASAP",
      notes:
        "Apply through SAYIT, BUNAC or IRCC directly. 24 month permit for Irish citizens.",
    },
    {
      description: "Apply for IEC Working Holiday visa",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "6 months before move",
      notes: "Both need to apply. Once in a lifetime opportunity.",
    },
    {
      description: "Get NMBI Certificate of Good Standing",
      category: "Olivia",
      priority: "High",
      status: "Not Started",
      deadline: "ASAP",
      notes: "Has expiry date — get it now. Required for CNO application.",
    },
    {
      description: "Start CNO registration application",
      category: "Olivia",
      priority: "High",
      status: "Not Started",
      deadline: "ASAP",
      notes: "cno.org — takes 3-6 months. Start immediately.",
    },
    {
      description: "Gather official transcripts",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "3 months before",
      notes: "Both university transcripts needed for CNO and immigration.",
    },
    {
      description: "Get reference letters from St Pats placement",
      category: "Olivia",
      priority: "High",
      status: "Not Started",
      deadline: "3 months before",
      notes: "These will be gold for CAMH applications.",
    },
    {
      description: "Close or notify Irish bank accounts",
      category: "Both",
      priority: "Medium",
      status: "Not Started",
      deadline: "1 month before",
      notes: "Keep one Irish account active for pension/tax purposes.",
    },
    {
      description: "Update Irish Life pension address",
      category: "Tariq",
      priority: "High",
      status: "Not Started",
      deadline: "1 month before",
      notes: "Both plans — update to Canadian address when known.",
    },
    {
      description: "Consolidate two Irish pension plans",
      category: "Tariq",
      priority: "Medium",
      status: "Not Started",
      deadline: "Before leaving",
      notes:
        "Transfer PRSA into DC scheme with Irish Life. Contact Irish Life directly.",
    },
    {
      description: "Notify Revenue Ireland of departure",
      category: "Both",
      priority: "Medium",
      status: "Not Started",
      deadline: "Month of departure",
      notes: "File a leaving certificate with Revenue.",
    },
    {
      description: "Sort international health insurance",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "1 month before",
      notes: "Cover the 3-month OHIP waiting period. Budget ~€200-300/month.",
    },
    {
      description: "Open Interactive Brokers account",
      category: "Tariq",
      priority: "Low",
      status: "Not Started",
      deadline: "Optional",
      notes: "For flexible global investing. Works in Ireland and Canada.",
    },
    {
      description: "Research area in Etobicoke/North York to live",
      category: "Both",
      priority: "Medium",
      status: "Not Started",
      deadline: "2 months before",
      notes:
        "Budget CAD $2600-2700/month. Zumper, Rentals.ca, Facebook Marketplace.",
    },
    {
      description: "Investigate PayPal internal transfer",
      category: "Tariq",
      priority: "High",
      status: "Not Started",
      deadline: "ASAP",
      notes:
        "PayPal has Toronto office. Internal transfer means arriving with job secured.",
    },
    {
      description: "Back up all important documents digitally",
      category: "Both",
      priority: "Medium",
      status: "Not Started",
      deadline: "1 month before",
      notes:
        "Passport, birth certs, degree certs, employment records, pension details.",
    },
  ];

  const DEFAULT_OLIVIA = [
    {
      description: "Start CNO registration — cno.org",
      category: "Registration",
      priority: "High",
      status: "Not Started",
      deadline: "Immediately",
      notes: "Most critical step. Takes 3-6 months. Application fee ~CAD $230.",
    },
    {
      description: "Get NMBI Certificate of Good Standing",
      category: "Registration",
      priority: "High",
      status: "Not Started",
      deadline: "Immediately",
      notes: "Required by CNO. Has expiry so get it now.",
    },
    {
      description: "Confirm BScN qualification maps to CNO RN",
      category: "Registration",
      priority: "High",
      status: "Not Started",
      deadline: "ASAP",
      notes: "CNO may require bridging if qualification not fully recognised.",
    },
    {
      description: "Gather all nursing transcripts",
      category: "Registration",
      priority: "High",
      status: "Not Started",
      deadline: "ASAP",
      notes: "Official transcripts needed for CNO assessment.",
    },
    {
      description: "Get CPR/BCLS certification (Irish equivalent)",
      category: "Certification",
      priority: "High",
      status: "Not Started",
      deadline: "Before leaving",
      notes: "Canadian employers require current BCLS/CPR. Get it updated now.",
    },
    {
      description: "Research CPI certification (Crisis Prevention)",
      category: "Certification",
      priority: "Medium",
      status: "Researching",
      deadline: "Can do in Canada",
      notes: "Some roles require this — can obtain within 6 months of hire.",
    },
    {
      description: "Connect with CAMH on LinkedIn",
      category: "Applications",
      priority: "High",
      status: "Not Started",
      deadline: "Now",
      notes:
        "Proactive outreach works well in Canada. Reference St Pats experience.",
    },
    {
      description: "Apply to CAMH CCC-7 (Priority)",
      category: "Applications",
      priority: "High",
      status: "Not Started",
      deadline: "When CNO ready",
      notes:
        "Best first role. Acute psych, permanent, supportive orientation. Queen St site.",
    },
    {
      description: "Apply to Humber River Medication Clinic",
      category: "Applications",
      priority: "Medium",
      status: "Not Started",
      deadline: "When CNO ready",
      notes: "Good backup. Mon-Fri days. Outpatient psychiatric nursing.",
    },
    {
      description: "Research Ontario Nurses Association (ONA)",
      category: "Union",
      priority: "Medium",
      status: "Not Started",
      deadline: "Before interviews",
      notes:
        "All hospital nurses in Ontario unionised under ONA. Know your rights.",
    },
    {
      description: "Study Ontario Mental Health Act",
      category: "Knowledge",
      priority: "Medium",
      status: "Researching",
      deadline: "Before interviews",
      notes: "Key legislation — will be asked about this in interviews.",
    },
    {
      description: "Research OINP nomination for nurses",
      category: "Immigration",
      priority: "High",
      status: "Not Started",
      deadline: "After arrival",
      notes:
        "Permanent full-time role at CAMH could lead to OINP nomination — fast track to PR.",
    },
    {
      description: "Aim for permanent full-time role (not temp)",
      category: "Career",
      priority: "High",
      status: "Not Started",
      deadline: "Job search",
      notes:
        "Temporary roles weaker for PR. Permanent employment crucial for OINP.",
    },
    {
      description: "CNA Psychiatric Nursing certification",
      category: "Certification",
      priority: "Low",
      status: "Not Started",
      deadline: "1-2 years in",
      notes: "Nice-to-have for CAMH RN Forensic role. Obtain when eligible.",
    },
  ];

  const DEFAULT_ARRIVAL = [
    {
      description: "Get SIN number",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "Day 1-2",
      notes: "Service Canada office. Needed for everything — TFSA, work, OHIP.",
    },
    {
      description: "Register for OHIP",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "Day 1",
      notes:
        "ServiceOntario office. 3 month wait starts from registration date.",
    },
    {
      description: "Activate private health insurance",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "Day 1",
      notes: "Bridge the OHIP gap. Cancel once OHIP activates at month 3.",
    },
    {
      description: "Open Canadian bank account",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "Week 1",
      notes:
        "TD, RBC, Scotiabank all have newcomer packages. Bring passport + SIN.",
    },
    {
      description: "Open TFSA",
      category: "Tariq",
      priority: "High",
      status: "Not Started",
      deadline: "Week 1-2",
      notes:
        "As soon as SIN is active. CAD $7,000/year contribution room. Start immediately.",
    },
    {
      description: "Get Ontario drivers licence",
      category: "Both",
      priority: "Medium",
      status: "Not Started",
      deadline: "Month 1",
      notes: "Irish licence valid temporarily. Exchange at ServiceOntario.",
    },
    {
      description: "Register with a GP / find family doctor",
      category: "Both",
      priority: "Medium",
      status: "Not Started",
      deadline: "Month 1",
      notes:
        "Shortage of GPs in Ontario — register on Health Care Connect. Use walk-ins meanwhile.",
    },
    {
      description: "Confirm CNO registration is active",
      category: "Olivia",
      priority: "High",
      status: "Not Started",
      deadline: "Before job search",
      notes: "Cannot practice or apply until CNO registration confirmed.",
    },
    {
      description: "Set up Canadian credit card",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "Month 1",
      notes:
        "Build credit history from day 1. Secured card if needed as newcomer.",
    },
    {
      description: "Get Canadian phone number/plan",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "Day 1",
      notes: "Rogers, Bell, Telus or budget options like Public Mobile, Koodo.",
    },
    {
      description: "Open RRSP",
      category: "Tariq",
      priority: "Medium",
      status: "Not Started",
      deadline: "After first paycheque",
      notes:
        "Once earning Canadian income. Contribution room = 18% of prior year income.",
    },
    {
      description: "Explore Express Entry profile",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "Month 1-3",
      notes: "Set up IRCC account and build Express Entry profile towards PR.",
    },
    {
      description: "Research OINP for nursing pathway",
      category: "Olivia",
      priority: "High",
      status: "Not Started",
      deadline: "Month 1-3",
      notes:
        "Ontario nominates healthcare workers. Permanent nursing job = fast track.",
    },
    {
      description: "Update Irish Life/PRSA with Canadian address",
      category: "Tariq",
      priority: "Medium",
      status: "Not Started",
      deadline: "Month 1",
      notes: "Keep Irish pensions updated with your current address.",
    },
  ];

  const DEFAULT_FINANCES = [
    {
      description: "Open TFSA in Canada",
      category: "Tariq",
      priority: "High",
      status: "Not Started",
      deadline: "Week 1 in Canada",
      notes:
        "Priority #1. Tax free growth and withdrawals. CAD $7,000/year room.",
    },
    {
      description: "Open RRSP",
      category: "Tariq",
      priority: "High",
      status: "Not Started",
      deadline: "After first income",
      notes:
        "Tax deductible. 18% of prior year earned income. Upfront tax saving.",
    },
    {
      description: "Set up Interactive Brokers (optional)",
      category: "Tariq",
      priority: "Low",
      status: "Not Started",
      deadline: "Optional",
      notes:
        "Flexible global brokerage. Good for overflow beyond TFSA/RRSP limits.",
    },
    {
      description: "Consolidate Irish pension plans",
      category: "Tariq",
      priority: "Medium",
      status: "Not Started",
      deadline: "Before leaving",
      notes: "Transfer PRSA into DC scheme. Contact Irish Life.",
    },
    {
      description: "Save Irish Life login credentials",
      category: "Tariq",
      priority: "High",
      status: "Not Started",
      deadline: "Before leaving",
      notes: "Both plan IDs saved. DC: 1210366, PRSA: 1151360.",
    },
    {
      description: "Notify Irish Life of Canadian address",
      category: "Tariq",
      priority: "Medium",
      status: "Not Started",
      deadline: "On arrival",
      notes: "Keep both pension providers updated.",
    },
    {
      description: "Research Canada-Ireland double tax treaty",
      category: "Tariq",
      priority: "Medium",
      status: "Researching",
      deadline: "Before leaving",
      notes: "Ensures no double taxation on Irish pension drawdown at age 60.",
    },
    {
      description: "File Irish tax return for year of departure",
      category: "Both",
      priority: "Medium",
      status: "Not Started",
      deadline: "Year of departure",
      notes: "Notify Revenue Ireland. May be entitled to tax refund.",
    },
    {
      description: "Build Canadian credit score from day 1",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "Week 1",
      notes: "Secured credit card if needed. Pay in full monthly.",
    },
    {
      description: "Research Express Entry CRS score",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "Month 1-3",
      notes:
        "Combined profile scores well. Young, English native, both skilled workers.",
    },
  ];

  const DEFAULT_HEALTHCARE = [
    {
      description: "Get private bridge health insurance quotes",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "Before leaving",
      notes:
        "Manulife CoverMe, Blue Cross, GMS. Cover 3-month OHIP wait. ~CAD $150-300/month each.",
    },
    {
      description: "Activate bridge insurance on departure day",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "Day of departure",
      notes: "Must be active from day you leave Ireland.",
    },
    {
      description: "Register for OHIP at ServiceOntario",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "Day 1 in Ontario",
      notes:
        "3-month wait starts from registration. Bring passport + proof of Ontario address.",
    },
    {
      description: "Gather Irish vaccination records (Olivia)",
      category: "Olivia",
      priority: "High",
      status: "Not Started",
      deadline: "Before leaving",
      notes:
        "CAMH/Humber require occupational health screening. TB test, immunisation history needed.",
    },
    {
      description: "Register on Health Care Connect for GP",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "Week 1",
      notes:
        "ontario.ca/page/find-family-doctor. GP shortage is real — register immediately.",
    },
    {
      description: "Enroll in employer benefits plan — Tariq",
      category: "Tariq",
      priority: "High",
      status: "Not Started",
      deadline: "Day 1 of job",
      notes:
        "Do not delay. Covers dental, prescriptions, vision from day 1 regardless of OHIP status.",
    },
    {
      description: "Enroll in ONA benefits plan — Olivia",
      category: "Olivia",
      priority: "High",
      status: "Not Started",
      deadline: "Day 1 of job",
      notes:
        "ONA benefits are excellent at CAMH/Humber. Enroll immediately on start date.",
    },
    {
      description: "Cancel bridge insurance when OHIP activates",
      category: "Both",
      priority: "Medium",
      status: "Not Started",
      deadline: "Month 3",
      notes:
        "Once OHIP letter arrives, cancel private bridge plan to avoid double paying.",
    },
    {
      description: "Download Maple or Telus Health app",
      category: "Both",
      priority: "Medium",
      status: "Not Started",
      deadline: "Month 1",
      notes:
        "Virtual GP service. Often covered by employer benefits. Great until you find a family doctor.",
    },
    {
      description: "Complete occupational health screening (Olivia)",
      category: "Olivia",
      priority: "High",
      status: "Not Started",
      deadline: "Before nursing start",
      notes:
        "CAMH/Humber will arrange. N95 fit test, TB screening, immunisation verification.",
    },
    {
      description: "Find nearest walk-in clinic to apartment",
      category: "Both",
      priority: "Medium",
      status: "Not Started",
      deadline: "Week 1",
      notes:
        "Note location and hours. Covered by OHIP. Use freely for non-emergency needs.",
    },
    {
      description: "Research CAMH staff mental health support",
      category: "Olivia",
      priority: "Medium",
      status: "Not Started",
      deadline: "On start",
      notes:
        "Psychiatric nursing is emotionally demanding. Know what support exists before you need it.",
    },
  ];

  const DEFAULT_TAXES = [
    {
      description: "Register on Revenue myAccount",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "Before leaving",
      notes:
        "revenue.ie — update address to Canadian address once known. File departure year return from Canada.",
    },
    {
      description: "File Irish PAYE return — year of departure",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "Oct after departure year",
      notes:
        "Form 12 online via myAccount. Likely a refund if leaving mid-year.",
    },
    {
      description: "Submit P50 (if leaving employment mid-year)",
      category: "Both",
      priority: "Medium",
      status: "Not Started",
      deadline: "Month of departure",
      notes:
        "Claim immediate PAYE refund rather than waiting until end of year.",
    },
    {
      description: "Notify Revenue Ireland of departure date",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "Month of departure",
      notes:
        "Formally notify Revenue you are leaving. Stops incorrect tax assessments.",
    },
    {
      description: "Check for unclaimed Irish tax credits",
      category: "Both",
      priority: "Medium",
      status: "Not Started",
      deadline: "Before leaving",
      notes:
        "Health expenses, college fees, flat rate expenses — claim anything outstanding before you go.",
    },
    {
      description: "Register for CRA My Account",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "Week 1 in Canada",
      notes:
        "canada.ca/cra — needs SIN. Register early to check TFSA/RRSP room and file returns.",
    },
    {
      description: "File first Canadian tax return",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "30 Apr (year after arrival)",
      notes:
        "Use Wealthsimple Tax — free and handles new resident returns well. Only covers Canadian-resident period.",
    },
    {
      description: "Declare worldwide income from arrival date",
      category: "Both",
      priority: "High",
      status: "Not Started",
      deadline: "First Canadian return",
      notes:
        "Any Irish income earned after becoming Canadian resident must be declared. DTA prevents double taxation.",
    },
    {
      description: "Keep all Irish pension statements",
      category: "Tariq",
      priority: "High",
      status: "Not Started",
      deadline: "Ongoing",
      notes:
        "Retain all Irish Life statements permanently. Needed for DTA claim when drawing pension at 60.",
    },
    {
      description: "Research DTA claim process for Irish pension",
      category: "Tariq",
      priority: "Medium",
      status: "Not Started",
      deadline: "Before age 60",
      notes:
        "Get cross-border tax advice before drawing Irish pension. 25% tax-free lump sum may still apply.",
    },
    {
      description: "Track TFSA contribution room",
      category: "Both",
      priority: "Medium",
      status: "Not Started",
      deadline: "Ongoing",
      notes:
        "Room only accumulates from year you arrive. Check CRA My Account annually. Never over-contribute — 1%/month penalty.",
    },
    {
      description: "Hire cross-border tax adviser for year 1",
      category: "Both",
      priority: "Medium",
      status: "Not Started",
      deadline: "First Canadian return",
      notes:
        "Worth ~€200-400. Straddles two tax systems — easy to make mistakes in first return.",
    },
  ];

  const DEFAULT_JOBS_TARIQ = [
    {
      company: "PayPal Toronto (Internal Transfer)",
      role: "Software Engineer / Current Role",
      stage: "Researching",
      applied: "",
      updated: "",
      salary: "~$120k+",
      remote: "Hybrid",
      notes:
        "Explore internal mobility — arrive with job secured. Speak to manager before leaving Dublin.",
    },
  ];

  const DEFAULT_JOBS_OLIVIA = [
    {
      company: "CAMH",
      role: "RPN — Crisis & Critical Care Unit 7",
      stage: "Researching",
      applied: "",
      updated: "",
      salary: "$32–38/hr",
      hoopp: "Yes",
      notes:
        "Priority application. Permanent, acute psych, supportive orientation. Queen St site. Needs CNO first.",
    },
    {
      company: "CAMH",
      role: "RN — Forensic General Unit",
      stage: "Researching",
      applied: "",
      updated: "",
      salary: "$41–59/hr",
      hoopp: "Yes",
      notes:
        "Longer term target once 2-3 yrs Canadian experience. BScN required.",
    },
    {
      company: "Humber River Health",
      role: "RN — Adult Inpatient Mental Health",
      stage: "Researching",
      applied: "",
      updated: "",
      salary: "$41–59/hr",
      hoopp: "Yes",
      notes: "Backup option. Temporary until Sept 2026 — timing may not work.",
    },
    {
      company: "Humber River Health",
      role: "RN — Outpatient Medication Clinic",
      stage: "Researching",
      applied: "",
      updated: "",
      salary: "$41–59/hr",
      hoopp: "Yes",
      notes:
        "Good backup. Mon-Fri days only — great for settling in. Clozapine + LAI clinic.",
    },
    {
      company: "Humber River Health",
      role: "RN — Mobile Crisis (MCIT)",
      stage: "Researching",
      applied: "",
      updated: "",
      salary: "$41–59/hr",
      hoopp: "Yes",
      notes:
        "Dream role eventually. Needs 3-5 yrs experience. Partners with Toronto Police.",
    },
  ];

  const DEFAULT_BUDGET = {
    fixed: [
      { label: "Rent (2-bed, Etobicoke/North York)", amount: 2650 },
      { label: "Renters insurance", amount: 30 },
      { label: "Internet", amount: 70 },
      { label: "Phone — Tariq", amount: 45 },
      { label: "Phone — Olivia", amount: 45 },
      { label: "Transit (Presto cards x2)", amount: 200 },
      { label: "Gym membership", amount: 60 },
      { label: "Streaming services", amount: 40 },
    ],
    variable: [
      { label: "Groceries (Costco + weekly shop)", amount: 600 },
      { label: "Eating out / takeaway", amount: 300 },
      { label: "Clothing & personal care", amount: 150 },
      { label: "Household supplies", amount: 80 },
      { label: "Entertainment & activities", amount: 200 },
      { label: "Travel / trips home", amount: 250 },
      { label: "Miscellaneous", amount: 150 },
    ],
    savings: [
      { label: "Tariq — TFSA contribution", amount: 900 },
      { label: "Olivia — TFSA contribution", amount: 625 },
      { label: "Emergency fund", amount: 300 },
    ],
  };

  const [tasks, setTasks] = useState({
    before: DEFAULT_BEFORE,
    olivia: DEFAULT_OLIVIA,
    arrival: DEFAULT_ARRIVAL,
    finances: DEFAULT_FINANCES,
    healthcare: DEFAULT_HEALTHCARE,
    taxes: DEFAULT_TAXES,
  });
  // Default cost rows for visas (copied from public/canada.html)
  const DEFAULT_VISAS = [
    {
      item: "IEC Application — Tariq",
      who: "Tariq",
      status: "Not Started",
      costEur: 235,
      deadline: "ASAP",
      notes:
        "Via IRCC or Recognised Organisation (SAYIT/BUNAC). CAD ~$235 fee.",
    },
    {
      item: "IEC Application — Olivia",
      who: "Olivia",
      status: "Not Started",
      costEur: 235,
      deadline: "ASAP",
      notes: "Same process. Both apply separately.",
    },
    {
      item: "CNO Registration Fee",
      who: "Olivia",
      status: "Not Started",
      costEur: 160,
      deadline: "ASAP",
      notes: "~CAD $230 approx. Check cno.org for current fee.",
    },
    {
      item: "NMBI Certificate of Good Standing",
      who: "Olivia",
      status: "Not Started",
      costEur: 55,
      deadline: "ASAP",
      notes: "NMBI fee. Has expiry date — apply now.",
    },
    {
      item: "Biometrics fee (if required)",
      who: "Both",
      status: "Not Started",
      costEur: 80,
      deadline: "With IEC",
      notes: "May be required as part of IEC application.",
    },
    {
      item: "Police clearance / Garda vetting",
      who: "Both",
      status: "Not Started",
      costEur: 30,
      deadline: "Before leaving",
      notes: "May be required for nursing registration and IEC.",
    },
    {
      item: "Express Entry profile fee",
      who: "Both",
      status: "Not Started",
      costEur: 0,
      deadline: "On arrival",
      notes:
        "Free to create profile. PR application fee paid later (~CAD $1,325 each).",
    },
    {
      item: "Passport renewal (if needed)",
      who: "Both",
      status: "Not Started",
      costEur: 0,
      deadline: "Check expiry",
      notes: "Ensure passports valid 6+ months beyond planned stay.",
    },
  ];
  const DEFAULT_MOVING = [
    {
      item: "Flights — Tariq",
      who: "",
      status: "Not Started",
      costEur: 650,
      deadline: "Move date",
      notes: "Dublin to Toronto Pearson. Book 3-4 months ahead for best price.",
    },
    {
      item: "Flights — Olivia",
      who: "",
      status: "Not Started",
      costEur: 650,
      deadline: "Move date",
      notes: "Same flight ideally.",
    },
    {
      item: "Excess baggage / luggage",
      who: "",
      status: "Not Started",
      costEur: 200,
      deadline: "Move date",
      notes: "Budget for extra bags with clothes, essentials.",
    },
    {
      item: "Shipping boxes to Canada",
      who: "",
      status: "Not Started",
      costEur: 800,
      deadline: "2 weeks before",
      notes: "Sea freight cheaper than air. 6-8 week transit time.",
    },
    {
      item: "Storage unit Ireland (if needed)",
      who: "",
      status: "Not Started",
      costEur: 300,
      deadline: "Ongoing",
      notes: "If keeping some items in Ireland temporarily.",
    },
    {
      item: "Temporary accommodation Toronto",
      who: "",
      status: "Not Started",
      costEur: 1200,
      deadline: "First 2 weeks",
      notes:
        "Airbnb or short-term rental while finding apartment. Budget 2 weeks.",
    },
    {
      item: "Apartment deposit",
      who: "",
      status: "Not Started",
      costEur: 2700,
      deadline: "On signing",
      notes: "Typically first + last month rent. Based on CAD $2,700 budget.",
    },
    {
      item: "Travel insurance for move",
      who: "",
      status: "Not Started",
      costEur: 150,
      deadline: "Before flights",
      notes:
        "Cover the journey and first days before health insurance activates.",
    },
  ];

  const DEFAULT_SETUP = [
    {
      item: "Bed frame + mattress",
      who: "",
      status: "Not Started",
      costEur: 800,
      deadline: "High",
      notes: "IKEA Canada well priced. Wayfair for delivery.",
    },
    {
      item: "Sofa",
      who: "",
      status: "Not Started",
      costEur: 600,
      deadline: "High",
      notes: "IKEA, The Brick, or Facebook Marketplace for second hand.",
    },
    {
      item: "Dining table + chairs",
      who: "",
      status: "Not Started",
      costEur: 400,
      deadline: "Medium",
      notes: "IKEA Ekedalen good value.",
    },
    {
      item: "Desk + chair (home office)",
      who: "",
      status: "Not Started",
      costEur: 300,
      deadline: "Medium",
      notes: "Both likely working from home some days.",
    },
    {
      item: "Kitchen essentials",
      who: "",
      status: "Not Started",
      costEur: 300,
      deadline: "High",
      notes: "Pots, pans, cutlery, appliances. HomeSense good for this.",
    },
    {
      item: "Bedding + towels",
      who: "",
      status: "Not Started",
      costEur: 200,
      deadline: "High",
      notes: "Costco membership worth it for bulk buys.",
    },
    {
      item: "Winter clothing (both)",
      who: "",
      status: "Not Started",
      costEur: 400,
      deadline: "High",
      notes: "Toronto winters brutal. Canada Goose or similar for proper coat.",
    },
    {
      item: "Winter boots (both)",
      who: "",
      status: "Not Started",
      costEur: 300,
      deadline: "High",
      notes: "Sorel or Baffin. Non-negotiable for Toronto winter.",
    },
    {
      item: "TV + stand",
      who: "",
      status: "Not Started",
      costEur: 400,
      deadline: "Low",
      notes: "Best Buy Canada frequent sales.",
    },
    {
      item: "Groceries — first stock up",
      who: "",
      status: "Not Started",
      costEur: 250,
      deadline: "High",
      notes: "Costco membership pays for itself quickly.",
    },
    {
      item: "Costco membership",
      who: "",
      status: "Not Started",
      costEur: 60,
      deadline: "Medium",
      notes: "CAD $65/year. Huge savings on groceries and household.",
    },
    {
      item: "Cleaning supplies + basics",
      who: "",
      status: "Not Started",
      costEur: 100,
      deadline: "High",
      notes: "Dollar Tree or Walmart for basics.",
    },
    {
      item: "Curtains / blinds",
      who: "",
      status: "Not Started",
      costEur: 150,
      deadline: "Medium",
      notes: "Most Toronto apartments have minimal window coverings.",
    },
    {
      item: "Laptop / tech (if needed)",
      who: "",
      status: "Not Started",
      costEur: 0,
      deadline: "Low",
      notes: "Add cost if planning to buy new tech on arrival.",
    },
  ];

  const [costRows, setCostRows] = useState({
    visas: DEFAULT_VISAS,
    moving: DEFAULT_MOVING,
    setup: DEFAULT_SETUP,
  });
  const [jobs, setJobs] = useState({
    tariq: DEFAULT_JOBS_TARIQ,
    olivia: DEFAULT_JOBS_OLIVIA,
  });
  const [budgetRows, setBudgetRows] = useState({
    fixed: DEFAULT_BUDGET.fixed,
    variable: DEFAULT_BUDGET.variable,
    savings: DEFAULT_BUDGET.savings,
  });
  const [pensions, setPensions] = useState({
    tariq: { eurSal: "69", eurPct: "12", cadSal: "90", cadPct: "12" },
    olivia: {
      eurSal: "",
      eurPct: "0",
      cadSal: "75",
      cadPct: "10",
      hooppYrs: "36",
    },
  });
  const [budgetSalaries, setBudgetSalaries] = useState({ t: 90, o: 75 });
  const [housing, setHousing] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.fxRate) setFxRate(s.fxRate);
        if (s.generalNotes) {
          if (typeof s.generalNotes === "string") {
            setGeneralNotes([
              {
                text: s.generalNotes,
                author: "Tariq",
                date: new Date().toISOString(),
              },
            ]);
          } else {
            setGeneralNotes(s.generalNotes);
          }
        }
        if (s.links) setLinks(s.links);
        if (s.tasks) setTasks(s.tasks);
        if (s.costRows) setCostRows(s.costRows);
        if (s.pensions) setPensions(s.pensions);
        if (s.jobs) setJobs(s.jobs);
        if (s.housing) setHousing(s.housing);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const saveLocal = useCallback(() => {
    const payload = {
      fxRate,
      generalNotes,
      links,
      tasks,
      costRows,
      pensions,
      jobs,
      housing,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [fxRate, generalNotes, links, tasks, costRows, pensions, jobs, housing]);

  const saveRemote = useCallback(async () => {
    if (!supabase) return false;
    setIsSaving(true);
    try {
      const payload = {
        id: "default",
        fxRate,
        generalNotes,
        links,
        tasks,
        costRows,
        pensions,
        jobs,
        housing,
        updated_at: new Date().toISOString(),
      };
      const res = await supabase.from("tracker_state").upsert(payload).select();
      setIsSaving(false);
      if (res.error) {
        // eslint-disable-next-line no-console
        console.error("Failed to save remote state:", res.error);
        return false;
      }
      setLastSyncedAt(new Date().toISOString());
      return true;
    } catch (e) {
      setIsSaving(false);
      // eslint-disable-next-line no-console
      console.error("saveRemote exception:", e);
      return false;
    }
  }, [fxRate, generalNotes, links, tasks, costRows, pensions, jobs, housing]);

  const loadRemote = useCallback(async () => {
    if (!supabase) return false;
    try {
      const res = await supabase
        .from("tracker_state")
        .select("*")
        .eq("id", "default")
        .single();
      if (res.error || !res.data) {
        // eslint-disable-next-line no-console
        console.warn("No remote state found or failed to load:", res.error);
        return false;
      }
      const data = res.data;
      // merge remote state into local
      if (data.fxRate !== undefined) setFxRate(data.fxRate);
      if (data.generalNotes !== undefined) {
        if (typeof data.generalNotes === "string")
          setGeneralNotes([
            {
              text: data.generalNotes,
              author: "Tariq",
              date: new Date().toISOString(),
            },
          ]);
        else setGeneralNotes(data.generalNotes);
      }
      if (data.links !== undefined) setLinks(data.links);
      if (data.tasks !== undefined) setTasks(data.tasks);
      if (data.costRows !== undefined) setCostRows(data.costRows);
      if (data.pensions !== undefined) setPensions(data.pensions);
      if (data.jobs !== undefined) setJobs(data.jobs);
      if (data.housing !== undefined) setHousing(data.housing);
      setLastSyncedAt(new Date().toISOString());
      return true;
    } catch (e) {
      return false;
    }
  }, []);

  // Autosave local whenever key pieces update
  useEffect(() => {
    saveLocal();
  }, [fxRate, generalNotes, links, saveLocal]);

  // Attempt to load remote state once on mount if supabase configured
  useEffect(() => {
    (async () => {
      if (supabase) {
        await loadRemote();
      }
    })();
  }, [loadRemote]);

  // Defaults are inlined above in DEFAULT_BEFORE / DEFAULT_OLIVIA

  const value = {
    fxRate,
    setFxRate,
    generalNotes,
    setGeneralNotes,
    links,
    setLinks,
    saveRemote,
    isSaving,
    lastSyncedAt,
    loadRemote,
    // task / cost API
    tasks,
    setTasks,
    addTask: (section) => {
      setTasks((p) => ({
        ...p,
        [section]: [
          ...(p[section] || []),
          {
            description: "",
            category: "",
            priority: "Medium",
            status: "Not Started",
            deadline: "",
            notes: "",
          },
        ],
      }));
    },
    updateTask: (section, idx, patch) => {
      setTasks((p) => {
        const arr = [...(p[section] || [])];
        arr[idx] = { ...arr[idx], ...patch };
        return { ...p, [section]: arr };
      });
    },
    removeTask: (section, idx) => {
      setTasks((p) => {
        const arr = [...(p[section] || [])];
        arr.splice(idx, 1);
        return { ...p, [section]: arr };
      });
    },
    costRows,
    setCostRows,
    addCost: (section) => {
      setCostRows((p) => ({
        ...p,
        [section]: [
          ...(p[section] || []),
          {
            item: "",
            who: "",
            status: "Not Started",
            costEur: 0,
            deadline: "",
            notes: "",
          },
        ],
      }));
    },
    updateCost: (section, idx, patch) => {
      setCostRows((p) => {
        const arr = [...(p[section] || [])];
        arr[idx] = { ...arr[idx], ...patch };
        return { ...p, [section]: arr };
      });
    },
    removeCost: (section, idx) => {
      setCostRows((p) => {
        const arr = [...(p[section] || [])];
        arr.splice(idx, 1);
        return { ...p, [section]: arr };
      });
    },
    // budget
    budgetRows,
    setBudgetRows,
    addBudgetRow: (type) =>
      setBudgetRows((b) => ({
        ...b,
        [type]: [...(b[type] || []), { label: "", amount: 0 }],
      })),
    updateBudgetRow: (type, idx, patch) =>
      setBudgetRows((b) => {
        const a = [...(b[type] || [])];
        a[idx] = { ...a[idx], ...patch };
        return { ...b, [type]: a };
      }),
    removeBudgetRow: (type, idx) =>
      setBudgetRows((b) => {
        const a = [...(b[type] || [])];
        a.splice(idx, 1);
        return { ...b, [type]: a };
      }),
    // pensions
    pensions,
    setPensions,
    updatePension: (person, patch) => {
      setPensions((p) => ({ ...p, [person]: { ...p[person], ...patch } }));
    },
    // jobs
    jobs,
    setJobs,
    addJob: (person, job) => {
      setJobs((p) => ({
        ...p,
        [person]: [
          ...(p[person] || []),
          job || {
            company: "",
            role: "",
            stage: "Researching",
            applied: "",
            updated: "",
            salary: "",
            notes: "",
          },
        ],
      }));
    },
    // links API
    addLink: (link) => setLinks((l) => [...l, link]),
    updateLink: (idx, patch) =>
      setLinks((l) => {
        const a = [...l];
        a[idx] = { ...a[idx], ...patch };
        return a;
      }),
    removeLink: (idx) => setLinks((l) => l.filter((_, i) => i !== idx)),
    // general notes API (daily love notes)
    addGeneralNote: (author, text) =>
      setGeneralNotes((n) => [
        { author, text, date: new Date().toISOString() },
        ...n,
      ]),
    removeGeneralNote: (idx) =>
      setGeneralNotes((n) => n.filter((_, i) => i !== idx)),
    updateJob: (person, idx, patch) => {
      setJobs((p) => {
        const arr = [...(p[person] || [])];
        arr[idx] = { ...arr[idx], ...patch };
        return { ...p, [person]: arr };
      });
    },
    removeJob: (person, idx) => {
      setJobs((p) => {
        const arr = [...(p[person] || [])];
        arr.splice(idx, 1);
        return { ...p, [person]: arr };
      });
    },
    // housing
    housing,
    setHousing,
    // budget salaries
    budgetSalaries,
    setBudgetSalaries,
    updateBudgetSalary: (who, val) =>
      setBudgetSalaries((s) => ({ ...s, [who]: val })),
    addHousing: (entry) =>
      setHousing((h) => [
        ...h,
        entry || {
          address: "",
          neighbourhood: "",
          rent: "",
          beds: "",
          commuteT: "",
          commuteO: "",
          stage: "Spotted",
          score: "",
          notes: "",
        },
      ]),
    updateHousing: (idx, patch) =>
      setHousing((h) => {
        const a = [...h];
        a[idx] = { ...a[idx], ...patch };
        return a;
      }),
    removeHousing: (idx) => setHousing((h) => h.filter((_, i) => i !== idx)),
  };

  return (
    <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
  );
};

export default TrackerContext;
