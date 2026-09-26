import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, AlertTriangle, EyeOff, UserCheck, FileText, CheckCircle2 } from 'lucide-react';

export const SafetyRulesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            LostLink Trust &amp; Safety
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Campus Verification &amp; Privacy Mandate
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            LostLink was engineered to replace unmoderated chat groups and exposed notice boards with a structured, verified handover architecture.
          </p>
        </div>

        {/* 6 Core Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <EyeOff className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              1. Zero Public Phone Numbers
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never publicly publish student phone numbers or room addresses. Inquiries happen via anonymous in-app notifications and official campus dispatch help desks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              2. Protected Personal Email Addresses
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your college email is strictly used for authentication and official safety alerts. Neither finders nor claimants can harvest contact data.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              3. Two-Step Descriptive Proof Testing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anyone claiming an item must identify private physical characteristics (hidden scratches, contents inside bags, exact lost timestamp) that only the genuine owner knows.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              4. Proctored Campus Admin Review
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every ownership claim is routed to campus safety personnel or department proctors who cross-reference the claim details prior to authorizing handover.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              5. Community Flagging &amp; Scam Prevention
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students can report fraudulent listings with a single click. Accounts flagged for unethical behavior or false claims face immediate campus security review.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              6. Minimal Sensitive Document Storage
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Do not upload government IDs or debit card numbers. For high-value recoveries (wallets, laptops), verification takes place in person at the Security Office.
            </p>
          </div>

        </div>

        {/* Handover locations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            Designated Campus Safe Handover Points
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            For personal safety, never meet alone at late night or in isolated campus zones. Use these official locations:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold block text-slate-900">Central Security Desk</span>
              <span className="text-slate-500 mt-1 block">Admin Block B, Room 104 (24/7 Monitored)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold block text-slate-900">Central Library Circulation</span>
              <span className="text-slate-500 mt-1 block">Main Entrance Help Desk (8 AM - 10 PM)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold block text-slate-900">Student Activity Center</span>
              <span className="text-slate-500 mt-1 block">Campus Union Front Desk (9 AM - 6 PM)</span>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link
            to="/browse"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Explore Active Campus Listings &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
};
