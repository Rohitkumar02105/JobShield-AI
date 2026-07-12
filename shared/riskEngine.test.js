import assert from "node:assert/strict";
import { analyzeJobRisk, demoScamInput } from "./riskEngine.js";

const risky = analyzeJobRisk(demoScamInput);
assert.equal(risky.riskLevel, "High scam risk");
assert.ok(risky.riskScore >= 75);
assert.ok(risky.flags.some((flag) => flag.category === "payment"));

const safer = analyzeJobRisk({
  companyName: "Tata Consultancy Services",
  recruiterEmail: "careers@tcs.com",
  salary: "3.6 LPA",
  experience: "Fresher",
  jobText:
    "Graduate trainee role for freshers. Responsibilities include Java development, SQL basics, debugging, and participating in a structured interview process.",
  resumeText: "Java, SQL, React, DSA, backend basics"
});

assert.ok(safer.riskScore < 45);
console.log("Risk engine tests passed.");
