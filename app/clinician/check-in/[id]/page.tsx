"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { CheckIn } from "@/app/types";
import { useParams, useRouter } from "next/navigation";

export default function CheckInDetail() {
  const { id } = useParams(); // Get ID from URL
  const router = useRouter();
  const [data, setData] = useState<CheckIn | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDoc = async () => {
      const docRef = doc(db, "checkIns", id as string);
      const snap = await getDoc(docRef);
      if (snap.exists()) setData({ id: snap.id, ...snap.data() } as CheckIn);
      console.log(Object.getOwnPropertyNames(snap.data()))
    };
    fetchDoc();
  }, [id]);

  if (!data)
    return (
      <div className="p-10 text-center text-slate-400">
        Loading patient record...
      </div>
    );

  return (
    <div className="bg-stone-200 h-screen mx-auto py-12 px-24">
      <div className="">
        <button
          onClick={() => router.back()}
          className="text-sm text-slate-500 hover:text-blue-600 mb-6 flex items-center gap-1"
        >
          ← Back to Dashboard
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div
            className={`p-6 border-b ${data.riskLevel === "high" ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {data.patientName}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Check-in ID: {data.id.slice(0, 8)}...
                </p>
              </div>
              <div
                className={`text-center px-4 py-2 rounded-lg border ${data.riskLevel === "high" ? "bg-white border-red-200 text-red-700" : "bg-white border-slate-200 text-slate-700"}`}
              >
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Risk Status
                </div>
                <div className="font-bold text-lg capitalize">
                  {data.riskLevel}
                </div>
              </div>
            </div>

            {/* Calculated Insight */}
            {data.riskFactors && data.riskFactors.length > 0 && (
              <div className="mt-4 p-3 bg-white/60 rounded-lg border border-black/5 text-sm font-medium text-slate-700">
                Analysis: Flagged due to{" "}
                {data.riskFactors.join(" and ").toLowerCase()}.
              </div>
            )}
          </div>

          {/* Clinical Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100 border-b border-slate-100">
            <MetricBox label="Cravings" value={data.cravingsLevel} max={5} />
            <MetricBox
              label="Withdrawal"
              value={data.withdrawalSeverity}
              max={5}
            />
            <MetricBox
              label="Side Effects"
              value={data.sideEffectsSeverity}
              max={5}
            />
            <div className="p-4 text-center">
              <div className="text-xs text-slate-400 uppercase font-bold mb-1">
                Missed Doses
              </div>
              <div
                className={`text-xl font-bold ${data.missedDoses > 0 ? "text-red-600" : "text-slate-700"}`}
              >
                {data.missedDoses}
              </div>
            </div>
          </div>

          {/* Patient Notes */}
          <div className="p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase mb-3">
              Patient Notes
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg italic">
              "{data.notes || "No additional notes provided."}"
            </p>
          </div>
        </div>

        {/* Action Buttons (Fake for MVP) */}
        <div className="flex gap-4">
          <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
            Contact Patient
          </button>
          <button className="flex-1 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all">
            Resolve Alert
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper Component for the Metrics Grid
function MetricBox({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const isHigh = value >= 4;
  return (
    <div className="p-4 text-center">
      <div className="text-xs text-slate-400 uppercase font-bold mb-1">
        {label}
      </div>
      <div
        className={`text-xl font-bold ${isHigh ? "text-red-600" : "text-slate-700"}`}
      >
        {value}
        <span className="text-slate-300 text-sm font-normal">/{max}</span>
      </div>
    </div>
  );
}
