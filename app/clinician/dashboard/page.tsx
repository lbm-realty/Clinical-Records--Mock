"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";
import { CheckIn } from "@/app/types"; // Ensure you exported this interface
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export default function ClinicianDashboard() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  //   useEffect(() => {
  //     // Real-time listener for incoming patient data

  //     const unsubscribe = auth.onAuthStateChanged((user) => {
  //         if (user) {
  //             setUser(user);
  //             setAuthLoading(false);
  //         } else {
  //             router.push('/login'); // Kick them out if not logged in
  //         }

  //         const q = query(collection(db, 'checkIns'), orderBy('createdAt', 'desc'));
  //         const unsubscribeData = onSnapshot(q, (snapshot) => {
  //         const docs = snapshot.docs.map(doc => ({
  //           id: doc.id,
  //           ...doc.data()
  //         } as CheckIn));

  //         setCheckIns(docs);
  //         setLoading(false);
  //         }, (error) => {
  //             console.error("Firestore Error:", error);
  //             setLoading(false);
  //         });

  //         return () => unsubscribeData();
  //     });

  //     return () => unsubscribe();
  //   }, []);

  useEffect(() => {
    // 1. Listen for Auth State
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setAuthLoading(false);

      // 2. Only if user exists, start listening to Firestore
      const q = query(collection(db, "checkIns"), orderBy("createdAt", "desc"));

      const unsubscribeData = onSnapshot(
        q,
        (snapshot) => {
          const docs = snapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              }) as CheckIn,
          );

          setCheckIns(docs);
          setLoading(false);
        },
        (error) => {
          console.error("For clinician use only.", error);
          router.push("/login");
          setLoading(false);
        },
      );

      // Cleanup Data listener when Auth changes or component unmounts
      return () => unsubscribeData();
    });

    return () => unsubscribeAuth();
  }, [router]);

  if (authLoading)
    return <div className="p-10 text-center">Verifying credentials...</div>;

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="bg-stone-200 flex justify-center h-screen mx-auto py-10 px-32">
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Patient Triage Board
          </h1>
          <div className="text-sm text-slate-500">Live Updates Active ●</div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {checkIns.map((checkIn) => (
              <Link
                key={checkIn.id}
                href={`/clinician/check-in/${checkIn.id}`}
                className="group block bg-white shadow-lg p-5 rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {checkIn.patientName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {checkIn.createdAt
                        ? formatDistanceToNow(checkIn.createdAt.toDate()) +
                          " ago"
                        : "Just now"}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${getRiskColor(checkIn.riskLevel)}`}
                  >
                    {checkIn.riskLevel} Risk
                  </span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {checkIn.cravingsLevel > 3 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                      🔥 High Cravings ({checkIn.cravingsLevel}/5)
                    </span>
                  )}
                  {checkIn.missedDoses > 0 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                      ⚠️ Missed Dose
                    </span>
                  )}
                  {checkIn.riskLevel === "low" && (
                    <span className="text-xs text-slate-400 py-1">
                      No acute symptoms reported
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
