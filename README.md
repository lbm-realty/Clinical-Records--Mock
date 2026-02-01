**Ophelia "Tiny Slice" MVP – Patient Triage System**

**The Context**
I noticed Ophelia uses TypeScript, React, and Firebase to power their telehealth platform. To demonstrate my technical alignment and product-mindedness, I spent a weekend building a functional "slice" of a clinical triage flow.

The goal of this MVP is to show how real-time data can be used to identify high-risk patients in an Opioid Use Disorder (OUD) treatment context, ensuring clinicians can prioritize care where it’s needed most.

🛠️ Tech Stack & Architecture
Framework: Next.js 14 (App Router)

Language: TypeScript (Strictly typed interfaces for all data models)

Backend-as-a-Service: Firebase (Auth & Firestore)

Styling: Tailwind CSS

✨ Key Features
Role-Based Access (RBAC): Distinct flows for Patients (check-in submission) and Clinicians (triage dashboard).

Real-Time Triage: The Clinician Dashboard uses Firestore onSnapshot listeners to surface high-risk check-ins the moment they are submitted.

Clinical Risk Logic: Automatic risk calculation (Low/Medium/High) based on cravings, withdrawal severity, and medication adherence.

Security-First Data: Implemented Firestore Security Rules to ensure patients can only access their own records, while clinicians have read access to the triage board.

🧠 Technical Decisions & Trade-offs
1. Why NoSQL (Firestore)?
I chose Firestore over a relational database specifically for its Real-Time SDK. In a telehealth environment, a delay in seeing a "High Risk" alert could have real-world consequences. Firestore allows for an event-driven UI that updates the clinician's board without a page refresh.

2. Schema Denormalization
To optimize for dashboard performance, I denormalized the patientName into each checkIn document. This avoids expensive client-side "joins" or multiple round-trips to the users collection, allowing the triage board to stay snappy even as data grows.

3. Handling Async Race Conditions
I implemented a nested observer pattern to synchronize Firebase Auth state with Firestore listeners. This ensures the app only attempts to fetch clinical data after a valid session is verified, preventing permission errors during the initial mount.

⚠️ Important Note for Reviewers
For the scope of this weekend MVP, roles are self-assigned during signup. In a production environment, I would move this to a Server-Side Admin SDK using Firebase Custom Claims to ensure the "Clinician" role cannot be spoofed by a client-side request.

🚀 Getting Started
Clone the repo.

Add your Firebase config to a .env.local (see .env.example).

npm install and npm run dev.

Sign up as a Patient to submit a check-in, then sign up as a Clinician to view the triage board.
