import { Router } from "express";

const router = Router();

const applications = [
  { id: 1, company: "Infosys", role: "MERN Intern", status: "Applied", risk: 18 },
  { id: 2, company: "Future Tech Hiring", role: "Software Fresher", status: "Blocked", risk: 91 },
  { id: 3, company: "TCS", role: "Graduate Trainee", status: "Interview", risk: 12 }
];

router.get("/", (_req, res) => {
  res.json(applications);
});

router.post("/", (req, res) => {
  const application = {
    id: Date.now(),
    company: req.body.company || "Unknown company",
    role: req.body.role || "Job role",
    status: req.body.status || "Saved",
    risk: Number(req.body.risk || 0)
  };
  applications.unshift(application);
  res.status(201).json(application);
});

export default router;
