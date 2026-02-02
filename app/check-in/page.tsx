'use client'

import CheckInForm from "../components/CheckInForm";
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db, auth } from "../lib/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function CheckInPage() {
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // If no user, stop loading so we don't hang (maybe redirect to login)
        setLoading(false);
        return;
      }

      try {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const q = query(
          collection(db, 'checkIns'),
          where('patientId', '==', user.uid), // Use user.uid from the listener
          where('createdAt', '>=', twentyFourHoursAgo),
          limit(1)
        );

        const querySnapshot = await getDocs(q);
        setHasCheckedInToday(!querySnapshot.empty);
      } catch (error) {
        console.error("Query failed:", error);
      } finally {
        setLoading(false); // 2. ALWAYS set loading to false here
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-10 text-center">Checking status...</div>;

  if (hasCheckedInToday) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Daily Limit Reached</h2>
          <p className="text-slate-500 mb-6">
            You've already submitted your check-in for today. Consistency is key, and we'll see you again tomorrow!
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard/success'} 
            className="text-blue-600 font-semibold hover:underline"
          >
            View your last submission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* This renders your component */}
      <CheckInForm />
    </div>
  );
}