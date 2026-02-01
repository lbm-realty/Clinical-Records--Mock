'use client';

import { useState } from 'react';
import { db, auth } from '../lib/firebase'; // Ensure these are exported from your firebase.ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { calculateRisk } from '../utils/riskCalculator';
import { useRouter } from 'next/navigation';

export default function CheckInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cravingsLevel: 1,
    withdrawalSeverity: 1,
    sideEffectsSeverity: 1,
    missedDoses: '' as unknown as number,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return alert('You must be logged in');

    setLoading(true);
    
    try {
      const { level, reasons } = calculateRisk({
        cravingsLevel: formData.cravingsLevel,
        withdrawalSeverity: formData.withdrawalSeverity,
        missedDoses: formData.missedDoses
      });

      await addDoc(collection(db, 'checkIns'), {
        patientId: auth.currentUser.uid,
        patientName: auth.currentUser.displayName || 'Anonymous', // Denormalization
        createdAt: serverTimestamp(),
        ...formData,
        riskLevel: level,
        riskReasons: reasons,
      });

      router.push('/dashboard/success'); // Or wherever you want them to go
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to submit check-in. See console.');
    } finally {
      setLoading(false);
    }
  };

  // Helper for 1-5 Scale Buttons
  const RatingGroup = ({ label, value, field }: { label: string, value: number, field: string }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => setFormData({ ...formData, [field]: rating })}
            className={`flex-1 py-3 rounded-lg border text-sm font-semibold transition-all
              ${value === rating 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
          >
            {rating}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-1 px-1">
        <span>None</span>
        <span>Severe</span>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Daily Check-in</h2>

      <RatingGroup label="Cravings Level" value={formData.cravingsLevel} field="cravingsLevel" />
      <RatingGroup label="Withdrawal Symptoms" value={formData.withdrawalSeverity} field="withdrawalSeverity" />
      <RatingGroup label="Side Effects Severity" value={formData.sideEffectsSeverity} field="sideEffectsSeverity" />

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Missed Doses (Last 24h)</label>
        <input
          type="number"
          min="0"
          value={formData.missedDoses}
          placeholder="0"
          onChange={(e) => {
              const val = e.target.value;
                // If empty, set as empty string; otherwise parse as int
              setFormData({ 
              ...formData, 
              missedDoses: val === '' ? '' as any : parseInt(val) 
              });
          }}          
          className="w-full p-3 rounded-lg text-gray-800 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-2">Notes for Clinician</label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full p-3 text-gray-800 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Anything else we should know?"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all
          ${loading 
            ? 'bg-slate-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl active:scale-[0.98]'}`}
      >
        {loading ? 'Submitting...' : 'Complete Check-in'}
      </button>
    </form>
  );
}