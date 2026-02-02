# Follow-Up Adherence & Side-Effect Tracker

A tiny, focused telehealth tool for tracking how patients are doing *between* visits: cravings, withdrawal symptoms, side effects, and missed doses. Built to mirror a real workflow a clinician at Ophelia might use to triage patients after check-ins. [web:22][web:24][web:30][web:32]

---

## 1. Problem

Patients in treatment for opioid use disorder have a lot happening between visits: cravings, withdrawal, side effects, and life issues that can affect whether they take their meds or drop out of care. [web:22][web:29][web:30]

Clinicians need a simple way to:

- See who is struggling **right now**
- Catch missed doses and severe symptoms early
- Focus their time on the **highest-risk** patients first [web:22][web:29]

Most generic dashboards don’t reflect this reality. They show data, but don’t help answer the key question: *“Who should I reach out to first today?”* [web:22][web:30]

---

## 2. Solution

This project is a small, opinionated slice of that workflow:

### Patient flow

- Sign up / sign in as a **patient**
- Fill out a daily follow-up check-in:
  - Cravings level (1–5)
  - Withdrawal symptoms (1–5)
  - Side effects (1–5)
  - Missed doses (number)
  - Optional note to the care team
- On submit, the app:
  - Calculates a risk level (Low / Medium / High)
  - Stores the check-in in Firestore
  - Shows a confirmation that the care team received it

### Clinician flow

- Sign up / sign in as a **clinician**
- See a dashboard of recent patient check-ins:
  - Sorted by **risk level** first (High → Medium → Low), then by time
  - Each card/row shows:
    - Patient label
    - Cravings and missed doses
    - A clear risk badge (color + text)
- Click into a check-in to see details:
  - All scores
  - Notes
  - A short explanation of **why** the check-in was flagged as High/Medium risk

The goal isn’t to be a full EHR or full Ophelia clone. It’s a focused MVP to show:

- I understand the workflows around telehealth OUD follow-up and retention
- I can scope and ship a real product slice end-to-end, not just a generic CRUD app [web:22][web:24][web:30][web:32]

---

## 3. Risk Scoring

Risk is computed on the client when a patient submits a check-in.

### Inputs

- `cravings` (1–5)
- `withdrawalSeverity` (1–5)
- `sideEffectsSeverity` (1–5)
- `missedDoses` (integer)
- Optional note

Each condition also adds a human-readable reason, for example:

- “High cravings”
- “Severe withdrawal symptoms”
- “Multiple missed doses”

These reasons are shown on the clinician detail page so it’s clear why a check-in is flagged.

---

## 4. Tech Stack

This project is aligned with Ophelia’s stack for the Software Engineer I role. [web:24][web:26][web:31][web:32]

- **Frontend:** Next.js (App Router), React, TypeScript
- **Auth:** Firebase Authentication (email/password)
- **Database:** Firestore
- **Hosting:** Vercel (easy to move to Firebase Hosting or GCP later)
- **Styling:** Tailwind CSS / simple custom CSS (kept minimal on purpose)

Project structure (high-level):

- `app/`
  - `page.tsx` – landing / basic routing
  - `check-in/page.tsx` – patient check-in page
  - `clinician/dashboard/page.tsx` – clinician dashboard
  - `clinician/check-in/[id]/page.tsx` – check-in detail view
  - `login/page.tsx` - login and signup
  - `lib/`
    - `firebase.ts` – Firebase init (Auth + Firestore)
  - `utils/`
    - `riskCalculator.ts`
  - `components/`
    - `CheckInForm.tsx`

---

## 5. Notes and Future Ideas

This is intentionally a small, weekend-sized MVP focused on one critical workflow: follow-up adherence and side-effect tracking in telehealth OUD care. [web:22][web:29]

If I extend this, I’d like to explore:

Longitudinal trends for each patient (cravings and adherence over time)

Better role-based access control and stricter Firestore security rules

Simple “reach out” workflows for clinicians (documenting calls, messages, or follow-up actions)

More nuanced scoring aligned with clinical guidelines

For now, the goal was to ship a clear, working slice that shows:

Strong alignment with Ophelia’s tech stack

Product thinking around telehealth OUD workflows

Ability to independently design, build, and deploy an MVP end-to-end [web:22][web:24][web:30][web:32]
