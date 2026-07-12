const paymentPatterns = [
  /registration\s*fee/i,
  /training\s*fee/i,
  /security\s*deposit/i,
  /processing\s*fee/i,
  /refundable\s*amount/i,
  /pay\s*(now|today|immediately)/i,
  /upi|gpay|phonepe|bank transfer/i
];

const pressurePatterns = [
  /limited\s*slots/i,
  /urgent\s*hiring/i,
  /join\s*today/i,
  /offer\s*expires/i,
  /send\s*documents\s*(now|immediately)/i
];

const documentPatterns = [
  /aadhaar|pan card|passport|bank statement/i,
  /original\s*documents/i,
  /blank\s*cheque/i
];

const copiedOrVaguePatterns = [
  /work from home.*easy/i,
  /no interview/i,
  /direct joining/i,
  /guaranteed job/i,
  /typing job|captcha job/i
];

const freeEmailDomains = new Set([
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "rediffmail.com",
  "proton.me"
]);

function normalizeText(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

function getDomain(email = "") {
  const match = String(email).toLowerCase().match(/@([a-z0-9.-]+\.[a-z]{2,})$/);
  return match ? match[1] : "";
}

function addFlag(flags, points, title, detail, category) {
  flags.push({ points, title, detail, category });
}

function hasAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function getRiskLevel(score) {
  if (score >= 75) return "High scam risk";
  if (score >= 45) return "Needs verification";
  return "Looks safer";
}

function getVerdict(score) {
  if (score >= 75) return "Do not pay. Verify company identity first.";
  if (score >= 45) return "Pause and verify recruiter, domain, and company proof.";
  return "No major scam signal found. Still verify before sharing documents.";
}

function calculateResumeMatch(jobText, resumeText) {
  const jobWords = new Set(
    normalizeText(jobText)
      .toLowerCase()
      .split(/[^a-z0-9+#.]+/)
      .filter((word) => word.length > 2)
  );
  const resumeWords = new Set(
    normalizeText(resumeText)
      .toLowerCase()
      .split(/[^a-z0-9+#.]+/)
      .filter((word) => word.length > 2)
  );

  if (!jobWords.size || !resumeWords.size) {
    return { score: 0, matched: [], missing: [] };
  }

  const matched = [...jobWords].filter((word) => resumeWords.has(word)).slice(0, 12);
  const missing = [...jobWords]
    .filter((word) => !resumeWords.has(word))
    .filter((word) => ["react", "node", "express", "mongodb", "java", "python", "sql", "api", "frontend", "backend"].includes(word))
    .slice(0, 8);

  return {
    score: Math.min(100, Math.round((matched.length / Math.min(jobWords.size, 18)) * 100)),
    matched,
    missing
  };
}

export function analyzeJobRisk(input = {}) {
  const jobText = normalizeText(input.jobText || input.offerText || "");
  const recruiterEmail = normalizeText(input.recruiterEmail || "");
  const companyName = normalizeText(input.companyName || "");
  const salary = normalizeText(input.salary || "");
  const experience = normalizeText(input.experience || "");
  const resumeText = normalizeText(input.resumeText || "");
  const combinedText = `${jobText} ${salary} ${experience}`;
  const flags = [];

  if (hasAny(combinedText, paymentPatterns)) {
    addFlag(
      flags,
      32,
      "Payment or registration fee requested",
      "Legitimate employers normally do not ask candidates to pay for interviews, training, or joining.",
      "payment"
    );
  }

  const domain = getDomain(recruiterEmail);
  if (recruiterEmail && freeEmailDomains.has(domain)) {
    addFlag(
      flags,
      18,
      "Free email domain used by recruiter",
      "Official recruiters usually contact from a company-owned domain, not Gmail/Yahoo-style accounts.",
      "email"
    );
  }

  if (recruiterEmail && companyName && domain && !domain.includes(companyName.toLowerCase().replace(/[^a-z0-9]/g, ""))) {
    addFlag(
      flags,
      10,
      "Email domain does not clearly match company",
      "The recruiter domain should be checked against the official company website.",
      "email"
    );
  }

  if (hasAny(combinedText, pressurePatterns)) {
    addFlag(
      flags,
      13,
      "High-pressure hiring language",
      "Scammers often create urgency so candidates skip verification.",
      "urgency"
    );
  }

  if (hasAny(combinedText, documentPatterns)) {
    addFlag(
      flags,
      13,
      "Sensitive documents requested early",
      "Personal documents should be shared only after verifying the employer and offer process.",
      "documents"
    );
  }

  if (hasAny(combinedText, copiedOrVaguePatterns)) {
    addFlag(
      flags,
      12,
      "Vague or suspicious job promise",
      "Generic promises like direct joining, no interview, or guaranteed job are common scam signals.",
      "description"
    );
  }

  if (/fresher|0\s*-?\s*1\s*year/i.test(experience + " " + jobText) && /(10|12|15|20)\s*lpa|lakhs?/i.test(salary + " " + jobText)) {
    addFlag(
      flags,
      14,
      "Unrealistic salary signal for fresher",
      "A very high package for an entry-level role should be verified carefully.",
      "salary"
    );
  }

  if (jobText.length < 120) {
    addFlag(
      flags,
      8,
      "Job description is too short",
      "A real role usually explains responsibilities, skills, interview process, and company details.",
      "description"
    );
  }

  const score = Math.min(100, flags.reduce((total, flag) => total + flag.points, 0));
  const nextActions = score >= 75
    ? ["Do not pay any amount", "Verify company website and domain", "Ask for official HR contact", "Report suspicious listing"]
    : score >= 45
      ? ["Check LinkedIn company page", "Confirm email domain", "Ask for written interview process"]
      : ["Save proof of communication", "Verify before sharing documents", "Track application status"];

  return {
    riskScore: score,
    riskLevel: getRiskLevel(score),
    verdict: getVerdict(score),
    flags,
    nextActions,
    resumeMatch: calculateResumeMatch(jobText, resumeText),
    checkedAt: new Date().toISOString()
  };
}

export const demoScamInput = {
  companyName: "Future Tech Hiring",
  recruiterEmail: "hr.futuretech@gmail.com",
  salary: "12 LPA",
  experience: "Fresher",
  jobText:
    "Urgent hiring for freshers. Direct joining, no interview. Pay registration fee 4999 today for training kit and guaranteed job. Send Aadhaar, PAN card and bank details immediately.",
  resumeText:
    "MERN stack developer with React, Node.js, Express, MongoDB, Java, DSA and API development projects."
};
