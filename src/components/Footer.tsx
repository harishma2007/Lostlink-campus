import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, Mail, Phone, Lock, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-sm">
                L
              </div>
              <span className="text-lg font-bold text-white tracking-tight">LostLink</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart campus lost and found verification system connecting students, faculty, and campus security for safe property recovery.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>Campus Security Certified Protocol</span>
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Directory</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/browse?type=lost" className="hover:text-emerald-400 transition-colors">
                  Lost Belongings Catalog
                </Link>
              </li>
              <li>
                <Link to="/browse?type=found" className="hover:text-emerald-400 transition-colors">
                  Found Items Vault
                </Link>
              </li>
              <li>
                <Link to="/report-lost" className="hover:text-emerald-400 transition-colors">
                  Submit Lost Report
                </Link>
              </li>
              <li>
                <Link to="/report-found" className="hover:text-emerald-400 transition-colors">
                  Hand Over Found Item
                </Link>
              </li>
              <li>
                <Link to="/qr-tags" className="hover:text-emerald-400 transition-colors">
                  LostLink QR Tag Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Dispatch */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Campus Help Desks</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Security Main Office, Admin Block B, Room 104</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Library Circulation Desk (1st Floor)</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Ext. 2044 (Campus Safety Dispatch)</span>
              </li>
            </ul>
          </div>

          {/* Safety & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Safety &amp; Privacy</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Personal student telephone numbers and room details are never published. All ownership claims undergo two-factor descriptive verification by college proctors.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Strict Student Data Protection</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} LostLink Campus Network. Built for university student community safety.</p>
          <div className="flex items-center gap-4">
            <Link to="/safety" className="hover:text-slate-300 transition-colors">
              Campus Privacy Policy
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/safety" className="hover:text-slate-300 transition-colors">
              Claim Verification Guidelines
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
