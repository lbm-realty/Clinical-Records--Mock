import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Nav */}
      <nav className="p-6 border-b border-slate-100 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">CareSync</span>
        </div>
        <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600">
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Bridging the gap in <span className="text-blue-600">OUD Recovery.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl">
            A specialized clinical triage platform designed to help Ophelia clinicians monitor patient stability, withdrawal symptoms, and medication adherence in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/login" 
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Get Started
            </Link>
            <Link 
              href="https://github.com/your-username/your-repo" 
              className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-center hover:bg-slate-50 transition-all"
            >
              View Documentation
            </Link>
          </div>
        </div>

        {/* Mockup / Visual Area */}
        <div className="relative">
          <div className="bg-slate-100 rounded-3xl p-8 aspect-video flex items-center justify-center border border-slate-200">
            <div className="text-center">
              <p className="text-slate-400 font-medium">Clinician Triage Dashboard</p>
              <div className="mt-4 flex gap-2 justify-center">
                <div className="h-2 w-12 bg-red-400 rounded-full animate-pulse"></div>
                <div className="h-2 w-12 bg-slate-300 rounded-full"></div>
                <div className="h-2 w-12 bg-slate-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg mb-2">Real-time Triage</h3>
            <p className="text-slate-500 text-sm">Instant alerts for high-risk check-ins based on clinical indicators.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg mb-2">MAT Adherence</h3>
            <p className="text-slate-500 text-sm">Monitor medication consistency to ensure patient stability on protocol.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg mb-2">Patient Security</h3>
            <p className="text-slate-500 text-sm">Role-based access control protecting sensitive health information.</p>
          </div>
        </div>
      </section>
    </div>
  );
}