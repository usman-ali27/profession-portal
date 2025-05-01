"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const SIDEBAR_LINKS = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Statics", href: "#statics" },
];

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Finnhub state
  const [quote, setQuote] = useState<any>(null);
  const [quoteError, setQuoteError] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (!u) router.replace("/");
    });
    return unsub;
  }, [router]);

  const fetchFinnhub = async () => {
    setQuote(null);
    setQuoteError("");
    setQuoteLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/finnhub", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "API error");
      setQuote(json.data);
    } catch (e: any) {
      setQuoteError(e.message);
    } finally {
      setQuoteLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-tr from-[#1A1832] via-[#1b2033] to-[#131c31] text-white">
        Loading...
      </div>
    );
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#181828] via-[#1e2a3e] to-[#2e185b] text-white">
      {/* Sidebar for desktop, Topbar for mobile */}
      <aside className={
        `w-full md:w-60 flex-col md:h-screen py-4 md:py-8 px-2 md:px-3 bg-gradient-to-br from-[#22213d] via-[#2e185b] to-[#293b7e] shadow-xl border-b md:border-b-0 md:border-r border-purple-900
        flex md:flex-col md:justify-between md:relative z-20 ${sidebarOpen ? '' : 'hidden md:flex'}`}
      >
        <div>
          <div className="flex items-center gap-2 mb-6 md:mb-10 px-2 justify-between md:justify-start">
            <div className="flex items-center gap-2">
              <svg className="h-7 w-7 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" />
              </svg>
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-200 via-blue-200 to-green-200 bg-clip-text text-transparent">
                CryptoPro Admin
              </span>
            </div>
            <button className="md:hidden p-2 text-xl" aria-label="Close menu" onClick={() => setSidebarOpen(false)}>
              ✕
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {SIDEBAR_LINKS.map((l) => (
              <a
                key={l.name}
                href={l.href}
                className="block px-4 py-2 rounded-md hover:bg-purple-900/70 font-medium text-sm md:text-base transition-colors"
              >
                {l.name}
              </a>
            ))}
            <button
              onClick={() => signOut(auth)}
              className="px-4 py-2 rounded-md hover:bg-red-700 font-medium text-sm md:text-base transition-colors mt-4 text-left text-red-300 flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-8V5m-6 1v12a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-8a2 2 0 00-2 2v0" />
              </svg>
              Logout
            </button>
          </nav>
        </div>
        <div className="text-xs px-3 opacity-60 hidden md:block">&copy; {new Date().getFullYear()} CryptoPro</div>
      </aside>
      {/* Mobile bar toggle */}
      <div className="flex md:hidden items-center justify-between w-full p-3 bg-gradient-to-r from-[#22213d] via-[#2e185b] to-[#293b7e] border-b border-purple-900 sticky top-0 z-10">
        <span className="text-lg font-bold bg-gradient-to-r from-cyan-200 via-blue-200 to-green-200 bg-clip-text text-transparent">
          CryptoPro Admin
        </span>
        <button className="p-2 text-xl" aria-label="Open menu" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
      </div>
      {/* Main content (top bar + page) */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar (Desktop) */}
        <header className="hidden md:flex items-center justify-between w-full px-4 md:px-7 py-4 shadow bg-gradient-to-r from-[#231942] via-[#3646ce] to-[#29ffc6]">
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-cyan-200 to-purple-200 bg-clip-text text-transparent">
            Admin Dashboard
          </span>
          <span className="text-xs opacity-80 max-w-[180px] truncate">
            {user.email || user.displayName}
          </span>
        </header>
        {/* Page Content */}
        <main className="flex-grow flex flex-col items-center py-6 md:py-16 px-2 sm:px-4 md:px-8 bg-transparent">
          <section
            className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-[#232450] border border-purple-400 rounded-2xl shadow-lg p-4 sm:p-8 mb-8"
            id="apidemo"
          >
            <h2 className="text-base sm:text-lg font-bold text-cyan-300 mb-1">Finnhub API Demo</h2>
            <div className="mb-3 sm:mb-4 text-xs text-purple-200 opacity-80">
              Secure API call for AAPL stock quote via Finnhub.
            </div>
            <Button
              disabled={quoteLoading}
              onClick={fetchFinnhub}
              className="mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-bold w-full text-base md:text-lg"
            >
              {quoteLoading ? "Loading..." : "Get AAPL Stock Quote"}
            </Button>
            {quote && (
              <pre className="bg-[#1a1a36] text-cyan-200 rounded-md p-2 text-xs overflow-x-auto mb-2 border border-cyan-800">
                {JSON.stringify(quote, null, 2)}
              </pre>
            )}
            {quoteError && <div className="text-red-400 text-xs">{quoteError}</div>}
          </section>
          <section
            id="statics"
            className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-[#1a1a36] border border-cyan-900 rounded-2xl shadow p-4 sm:p-8 opacity-40 flex flex-col items-center justify-center"
          >
            <h2 className="text-base sm:text-lg font-semibold text-cyan-300">Statics</h2>
            <div className="mt-2 text-purple-100">(Coming soon!)</div>
          </section>
        </main>
      </div>
    </div>
  );
}
