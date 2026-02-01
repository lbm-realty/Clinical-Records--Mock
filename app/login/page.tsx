'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; 
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/navigation';

type AuthMode = 'login' | 'signup';
type UserRole = 'patient' | 'clinician';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (password !== confirmPass) throw new Error("Passwords don't match");
        
        // 1. Create Auth User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Update Display Name
        await updateProfile(user, { displayName: fullName });

        // 3. Create User Document (Crucial for Role-Based Access)
        // NOTE: In production, this should be done via Cloud Functions to prevent tampering.
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: fullName,
          role: role,
          createdAt: new Date().toISOString()
        });
      } else {

        if (mode === 'login') {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // Fetch the role from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === 'clinician') {
              router.push('/clinician/dashboard');
            } else {
              router.push('/check-in');
            }
          } else {
            // Fallback if the user doc was never created (manual cleanup needed in Console)
            setError("User profile not found. Please contact support.");
          }
        } else { 
            if (mode === 'signup' && role === 'clinician') router.push('/clinician/dashboard');
            else if (mode === 'signup') router.push('/check-in');
            else router.push('/check-in'); // Default for login (you might want to fetch role to redirect correctly)
         }
      }

      // Redirect based on role (simple client-side redirect)
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-black flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="flex gap-4 mb-8 bg-slate-100 p-1 rounded-lg">
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as AuthMode)}
              className={`flex-1 py-2 text-sm font-semibold rounded-md capitalize transition-all
                ${mode === m ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {m}
            </button>
          ))}
        </div>

        <h1 className="text-2xl font-bold mb-2 text-slate-900">
          {mode === 'login' ? 'Welcome Back' : 'Join Ophelia MVP'}
        </h1>
        <p className="text-slate-500 mb-6 text-sm">
          {mode === 'login' ? 'Sign in to access your dashboard.' : 'Create an account to get started.'}
        </p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}

        <form onSubmit={handleAuth} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['patient', 'clinician'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-3 border rounded-lg text-sm font-medium capitalize
                        ${role === r ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm Password</label>
              <input required type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
            </div>
          )}

          <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
}