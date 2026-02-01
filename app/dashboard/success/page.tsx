'use client';

import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/outline'; // npm install @heroicons/react

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 p-4 rounded-full">
            <CheckCircleIcon className="w-12 h-12 text-emerald-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Check-in Complete
        </h1>
        
        <p className="text-slate-600 leading-relaxed mb-8">
          Your care team has received your update. We're here to support you every step of the way on your journey to recovery.
        </p>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 text-left">
          <h2 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-1">
            What's Next?
          </h2>
          <p className="text-sm text-blue-700">
            A clinician will review your responses. If any immediate adjustments to your care plan are needed, we will reach out to you directly.
          </p>
        </div>

        <div className="space-y-3">
          <Link 
            href="/check-in" 
            className="block w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all"
          >
            Back to Home
          </Link>
          <button 
            onClick={() => window.print()} 
            className="block w-full py-3 text-slate-500 text-sm font-medium hover:text-slate-700 transition-all"
          >
            Save a Copy for My Records
          </button>
        </div>
      </div>
    </div>
  );
}