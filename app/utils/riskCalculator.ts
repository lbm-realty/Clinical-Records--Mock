import { RiskLevel } from "../types";

interface RiskInput {
  cravings: number;
  withdrawal: number;
  missedDoses: number;
}

export function calculateRisk(input: RiskInput): { level: RiskLevel; reasons: string[] } {
  const reasons: string[] = [];
  let level: RiskLevel = 'low';

  // Ophelia-style logic: prioritize safety
  if (input.cravings >= 4) {
    level = 'high';
    reasons.push('Severe Cravings');
  }
  
  if (input.withdrawal >= 4) {
    level = 'high';
    reasons.push('Severe Withdrawal Symptoms');
  }

  if (input.missedDoses >= 2) {
    level = 'high';
    reasons.push('Multiple Missed Doses');
  }

  // Fallback to medium if high criteria aren't met but some concern exists
  if (level !== 'high') {
    if (input.cravings === 3 || input.withdrawal === 3 || input.missedDoses === 1) {
      level = 'medium';
      reasons.push('Moderate Symptoms/Adherence Issues');
    }
  }

  return { level, reasons };
}