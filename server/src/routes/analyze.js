import { Router } from "express";
import { analyzeJobRisk } from "../../../shared/riskEngine.js";

const router = Router();

router.post("/", (req, res) => {
  const result = analyzeJobRisk(req.body);
  res.json(result);
});

export default router;
