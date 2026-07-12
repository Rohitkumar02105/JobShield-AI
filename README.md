# JobShield AI

AI-powered job safety assistant for freshers and job seekers. JobShield AI checks job descriptions, recruiter emails, payment requests, and offer messages before a candidate applies or pays.

## Why I Built This

Many freshers are targeted with fake recruiters, registration fees, training fees, security deposits, copied job descriptions, and unrealistic salary promises. I wanted to convert that real job-seeker problem into a practical MERN + Agentic AI project.

This project also connects with my 60-hour **Agentic AI Applications** training certificate issued by Baraka Resources on **July 1, 2026**. Instead of building a generic job board, JobShield AI uses agent-style checks to help candidates make safer decisions.

## Features

- Fake job and recruiter risk analysis
- Recruiter email and domain verification signals
- Payment scam keyword detection
- Salary and experience mismatch detection
- Offer letter/message red flag analysis
- Resume-to-job match suggestions
- Application tracker dashboard
- Clear risk score with reasons, next actions, and interview-ready story

## Tech Stack

- React.js + Vite
- Node.js + Express
- MongoDB-ready data model with Mongoose
- Shared JavaScript risk engine
- Agentic AI-ready service layer

## Project Structure

```text
JobShield-AI/
  client/      React frontend
  server/      Express API
  shared/      Risk scoring engine used by API
  samples/     Demo job scams and safe job examples
  docs/        Project story and interview notes
```

## Quick Start

```bash
pnpm install
pnpm run install:all
pnpm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:8080`

If you prefer npm, run `npm install` inside `client` and `server`, then start both apps separately.

## Environment

Copy the server env file:

```bash
cp server/.env.example server/.env
```

MongoDB is optional for the demo. Without `MONGODB_URI`, the API still runs with in-memory demo data.

## API

```http
POST /api/analyze
Content-Type: application/json

{
  "jobText": "We are hiring freshers. Registration fee 4999 required...",
  "recruiterEmail": "hr.company@gmail.com",
  "companyName": "Future Tech Hiring",
  "salary": "12 LPA",
  "experience": "Fresher"
}
```

## Sample Output

```json
{
  "riskScore": 91,
  "riskLevel": "High scam risk",
  "verdict": "Do not pay. Verify company identity first.",
  "flags": [
    "Payment or registration fee requested",
    "Free email domain used by recruiter",
    "Unrealistic salary signal for fresher"
  ]
}
```

## Interview Pitch

> I built JobShield AI because many students and freshers lose money to fake recruitment scams. The system analyzes job posts, recruiter emails, payment requests, and offer messages before a candidate takes action. It gives a risk score, explains the red flags, and recommends the next safe step.

## Roadmap

- OCR for payment screenshots
- PDF offer letter parsing
- Gemini/OpenAI agent for natural language explanation
- VirusTotal or URL reputation API
- Browser extension for job portals
- Persistent user application tracker
