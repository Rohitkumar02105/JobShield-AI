import {
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  FileSearch,
  MailCheck,
  ShieldCheck,
  Sparkles,
  WalletCards
} from "lucide-react";
import { useMemo, useState } from "react";
import { analyzeJobRisk, demoScamInput } from "../../shared/riskEngine.js";

const safeDemo = {
  companyName: "TCS",
  recruiterEmail: "careers@tcs.com",
  salary: "3.6 LPA",
  experience: "Fresher",
  jobText:
    "Graduate trainee role for freshers. Responsibilities include Java, SQL basics, debugging, communication and participating in a structured interview process.",
  resumeText: "Java SQL React Node DSA API development"
};

const trackerRows = [
  { company: "Infosys", role: "MERN Intern", status: "Applied", risk: 18 },
  { company: "Future Tech Hiring", role: "Software Fresher", status: "Blocked", risk: 91 },
  { company: "TCS", role: "Graduate Trainee", status: "Interview", risk: 12 }
];

function getRiskClass(score) {
  if (score >= 75) return "danger";
  if (score >= 45) return "warn";
  return "safe";
}

export default function App() {
  const [form, setForm] = useState(demoScamInput);
  const [result, setResult] = useState(() => analyzeJobRisk(demoScamInput));

  const topSignals = useMemo(
    () => [
      { icon: WalletCards, label: "Payment alerts", value: "fee, deposit, UPI" },
      { icon: MailCheck, label: "Email check", value: "domain mismatch" },
      { icon: FileSearch, label: "Offer scan", value: "documents, urgency" },
      { icon: BriefcaseBusiness, label: "Job fit", value: "resume match" }
    ],
    []
  );

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function runAnalysis(nextForm = form) {
    setResult(analyzeJobRisk(nextForm));
  }

  function loadSafeDemo() {
    setForm(safeDemo);
    runAnalysis(safeDemo);
  }

  function loadRiskDemo() {
    setForm(demoScamInput);
    runAnalysis(demoScamInput);
  }

  return (
    <main>
      <section className="hero">
        <nav>
          <div className="brand">
            <ShieldCheck size={28} />
            <span>JobShield AI</span>
          </div>
          <div className="nav-actions">
            <button type="button" onClick={loadRiskDemo}>Risk demo</button>
            <button type="button" onClick={loadSafeDemo}>Safe demo</button>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><Sparkles size={16} /> Agentic AI job safety assistant</p>
            <h1>Check a job before you apply, share documents, or pay anyone.</h1>
            <p className="subtitle">
              Built for freshers who face fake recruiters, registration fees, copied job posts,
              and suspicious offer letters.
            </p>
            <div className="hero-actions">
              <a href="#analyzer">Analyze job</a>
              <a href="#story" className="secondary">Project story</a>
            </div>
          </div>

          <div className={`risk-card ${getRiskClass(result.riskScore)}`}>
            <div className="risk-header">
              <span>Scam Risk</span>
              <strong>{result.riskScore}%</strong>
            </div>
            <div className="meter">
              <span style={{ width: `${result.riskScore}%` }} />
            </div>
            <h2>{result.riskLevel}</h2>
            <p>{result.verdict}</p>
            <ul>
              {result.flags.slice(0, 4).map((flag) => (
                <li key={flag.title}>
                  <AlertTriangle size={16} />
                  {flag.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="signals">
        {topSignals.map((signal) => {
          const Icon = signal.icon;
          return (
            <div className="signal" key={signal.label}>
              <Icon size={22} />
              <strong>{signal.label}</strong>
              <span>{signal.value}</span>
            </div>
          );
        })}
      </section>

      <section id="analyzer" className="workspace">
        <div className="panel input-panel">
          <div className="section-title">
            <p>Analyzer</p>
            <h2>Paste job details</h2>
          </div>
          <label>
            Company name
            <input value={form.companyName} onChange={(event) => updateField("companyName", event.target.value)} />
          </label>
          <label>
            Recruiter email
            <input value={form.recruiterEmail} onChange={(event) => updateField("recruiterEmail", event.target.value)} />
          </label>
          <div className="two-cols">
            <label>
              Salary
              <input value={form.salary} onChange={(event) => updateField("salary", event.target.value)} />
            </label>
            <label>
              Experience
              <input value={form.experience} onChange={(event) => updateField("experience", event.target.value)} />
            </label>
          </div>
          <label>
            Job / offer message
            <textarea value={form.jobText} onChange={(event) => updateField("jobText", event.target.value)} rows={7} />
          </label>
          <label>
            Resume keywords
            <textarea value={form.resumeText} onChange={(event) => updateField("resumeText", event.target.value)} rows={4} />
          </label>
          <button className="primary-button" type="button" onClick={() => runAnalysis()}>
            <ShieldCheck size={18} />
            Run safety check
          </button>
        </div>

        <div className="panel report-panel">
          <div className="section-title">
            <p>Report</p>
            <h2>{result.riskLevel}</h2>
          </div>
          <div className={`score-circle ${getRiskClass(result.riskScore)}`}>
            <span>{result.riskScore}</span>
            <small>/100</small>
          </div>
          <div className="report-list">
            {result.flags.length ? (
              result.flags.map((flag) => (
                <article key={flag.title}>
                  <strong>{flag.title}</strong>
                  <p>{flag.detail}</p>
                </article>
              ))
            ) : (
              <article>
                <strong>No major scam signal found</strong>
                <p>Still verify the employer before sharing identity documents or payment details.</p>
              </article>
            )}
          </div>
          <div className="next-actions">
            <h3>Next safe actions</h3>
            {result.nextActions.map((action) => (
              <span key={action}>{action}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="resume-tracker">
        <div className="panel">
          <div className="section-title">
            <p>Resume match</p>
            <h2>{result.resumeMatch.score}% match</h2>
          </div>
          <div className="chips">
            {result.resumeMatch.matched.map((skill) => <span key={skill}>{skill}</span>)}
          </div>
          <p className="muted">
            Missing focus: {result.resumeMatch.missing.length ? result.resumeMatch.missing.join(", ") : "No major keyword gap found"}
          </p>
        </div>
        <div className="panel">
          <div className="section-title">
            <p>Application tracker</p>
            <h2>Saved opportunities</h2>
          </div>
          <div className="table">
            {trackerRows.map((row) => (
              <div className="table-row" key={row.company}>
                <span>{row.company}</span>
                <span>{row.role}</span>
                <strong className={getRiskClass(row.risk)}>{row.status}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="story">
        <div>
          <p className="eyebrow"><BadgeCheck size={16} /> Certificate-backed learning</p>
          <h2>From Agentic AI training to a real fresher safety product.</h2>
        </div>
        <p>
          Rohit Kumar completed a 60-hour Agentic AI Applications training certificate issued
          by Baraka Resources on July 1, 2026. JobShield AI turns that learning into a practical
          project: multiple checks behave like focused agents and combine into one risk verdict.
        </p>
      </section>
    </main>
  );
}
