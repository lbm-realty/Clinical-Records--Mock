export type RiskLevel = 'low' | 'medium' | 'high';

export interface Patient {
  uid: string;
  email: string;
  displayName: string;
  role: 'patient';
  assignedClinicianId: string; // Critical for security rules later
}

export interface CheckIn {
  id: string; // Firestore Document ID
  patientId: string;
  patientName: string; // Denormalized for easier display on dashboard
  createdAt: number; // Store as timestamp (Date.now()) for easier sorting
  
  // Clinical Data
  cravingsLevel: number; // 1-5
  withdrawalSeverity: number; // 1-5
  sideEffectsSeverity: number; // 1-5
  missedDoses: number;
  notes?: string;

  // Calculated Fields (Client-side for this MVP)
  riskLevel: RiskLevel;
  riskFactors: string[]; // e.g., ["High Cravings", "Missed Doses"]
}