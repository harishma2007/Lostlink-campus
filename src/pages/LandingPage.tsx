import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Item } from '../types/index';
import { ItemCard } from '../components/ItemCard';
import {
  Search,
  PlusCircle,
  ShieldCheck,
  QrCode,
  ArrowRight,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Lock,
  Building2,
  FileSearch,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [recentLost, setRecentLost] = useState<Item[]>([]);
  const [recentFound, setRecentFound] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await api.getRecentItems();
        setRecentLost(data.recentLost);
        setRecentFound(data.recentFound);
      } catch (err) {
        console.error('Failed to load recent items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-slate-50 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                Official University Campus Lost &amp; Found Network
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] text-balance">
                Lost Something? <br />
                <span className="text-emerald-700">Let’s Find It.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
                LostLink helps campus students report, discover, and safely recover lost belongings through two-step descriptive ownership claims.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/report-lost"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2 group"
                >
                  <PlusCircle className="w-4 h-4" />
                  Report Lost Item
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/report-found"
                  className="px-5 py-3 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold text-sm shadow-2xs hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  Report Found Item
                </Link>

                <Link
                  to="/browse"
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-slate-500" />
                  Browse Directory
                </Link>
              </div>

              {/* Fast Campus Search Bar */}
              <div className="pt-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const q = (form.elements.namedItem('query') as HTMLInputElement).value;
                    window.location.href = `/browse?search=${encodeURIComponent(q)}`;
                  }}
                  className="flex items-center max-w-lg bg-white rounded-xl border border-slate-300 p-1.5 shadow-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all"
                >
                  <Search className="w-5 h-5 text-slate-400 ml-2.5 shrink-0" />
                  <input
                    type="text"
                    name="query"
                    placeholder="Search campus by item name (e.g. Boat earbuds, calculator)..."
                    className="w-full px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-100 aspect-16/11">
                <img
                  src="/src/assets/images/hero_campus_recovery_1790444220111.jpg"
                  alt="University Students at Campus Library Atrium"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Central Campus Dispatch
                    </span>
                  </div>
                  <p className="text-sm font-semibold">
                    100% verified claims. No personal contact details revealed.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Campus Live Statistics */}
      <section className="py-10 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <p className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">142</p>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
                Items Reported
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <p className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">118</p>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
                Items Found &amp; Logged
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <p className="text-3xl font-extrabold text-emerald-800 font-mono tabular-nums">94</p>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
                Safely Returned
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <p className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">1,850+</p>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
                Active Campus Students
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. How LostLink Works */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
            Campus Recovery Protocol
          </h2>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How LostLink Works
          </p>
          <p className="text-sm text-slate-600 mt-2">
            A three-step safe verification process to reconnect students with their belongings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold font-mono text-base mb-4">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">1. Log a Report</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Submit your lost item details or log an item you picked up anywhere on campus. A unique tracking ID (e.g. LL-2026-00125) is generated immediately.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold font-mono text-base mb-4">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">2. Smart Matching &amp; Claims</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our rule-based engine correlates categories, timestamps, and locations. Students submit descriptive proof questions (unique scratches, contents) to claim items.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold font-mono text-base mb-4">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">3. Admin Review &amp; Handover</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Campus security or department proctors approve legitimate claims. Handover occurs safely at designated campus help desks with official student ID.
            </p>
          </div>

        </div>
      </section>

      {/* 4. Recently Found Items Showcase */}
      <section className="py-12 bg-slate-50 border-t border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Campus Vault
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Recently Found Items
              </h2>
            </div>
            <Link
              to="/browse?type=found"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
            >
              View all found items
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 rounded-xl bg-slate-200 animate-pulse"></div>
              ))}
            </div>
          ) : recentFound.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-500">
              No found items logged recently.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentFound.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Recently Reported Lost Items */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Active Searches
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Recently Reported Lost Items
            </h2>
          </div>
          <Link
            to="/browse?type=lost"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            View all lost reports
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-xl bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : recentLost.length === 0 ? (
          <div className="text-center py-12 text-sm text-slate-500">
            No lost reports logged recently.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentLost.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Special Feature Spotlight: LostLink QR Tag */}
      <section className="py-16 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold text-emerald-300">
                <QrCode className="w-3.5 h-3.5" />
                Special Campus Protection Feature
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                LostLink QR Tag for Valuables
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Generate an anonymous digital QR tag for your laptop, backpack, water bottle, or calculator. If someone finds your item on campus and scans the tag, they can report its location directly to you without ever seeing your personal phone number or email.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    Zero personal contact information exposed to the public
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    Instant in-app notification when someone scans your tag
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    Finder can upload location note &amp; pickup desk details
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    Printable sticker format for binders and device covers
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/qr-tags"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  Generate My First QR Tag
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-2xl max-w-xs w-full text-center border-4 border-emerald-500">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <QrCode className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  LostLink Protected
                </p>
                <h4 className="text-base font-extrabold text-slate-900 mt-1">
                  TAG-LL-84920
                </h4>
                <div className="my-4 p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=LostLink-Campus-TAG-84920"
                    alt="Sample LostLink QR Tag"
                    className="w-36 h-36"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  If found, scan to report item safely to the student owner.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Safety & Verification Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200/80 p-8 sm:p-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Safety &amp; Privacy Mandate
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Built to Protect Student Privacy and Ensure Honest Returns
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Unlike generic bulletin boards or public social media chat groups, LostLink implements a zero-leak safety protocol:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>No Public Phone Numbers:</strong> All inquiries and communication stay securely inside the campus verification workflow.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Descriptive Proof Testing:</strong> Claimants must detail hidden contents or distinctive serial markers before claiming.</span>
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Help Desk Safekeeping:</strong> Found valuables can be logged directly with campus reception or security desks.</span>
              </div>
              <div className="flex items-start gap-2">
                <FileSearch className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Admin Proctor Verification:</strong> Suspicious listings or fraudulent claims are verified and banned by campus staff.</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/safety"
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 underline underline-offset-4"
              >
                Read the Complete Campus Recovery Protocol &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
