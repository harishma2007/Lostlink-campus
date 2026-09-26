import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ItemCategory } from '../types/index';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  Calendar,
  Lock,
  ArrowRight,
  HeartHandshake,
  AlertTriangle,
} from 'lucide-react';

export const QRRecoverPage: React.FC = () => {
  const { tagCode } = useParams<{ tagCode: string }>();

  const [tagInfo, setTagInfo] = useState<{
    tagCode: string;
    itemName: string;
    category: ItemCategory;
    active: boolean;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [finderName, setFinderName] = useState('');
  const [finderContact, setFinderContact] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!tagCode) return;

    const lookup = async () => {
      setLoading(true);
      try {
        const res = await api.lookupQRTag(tagCode);
        setTagInfo(res.tag);
      } catch (err: any) {
        setError(err.message || 'Invalid or unregistered LostLink QR Tag.');
      } finally {
        setLoading(false);
      }
    };

    lookup();
  }, [tagCode]);

  const handleSubmitRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagCode || !location.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      await api.recoverQRTag(tagCode, {
        finderName: finderName.trim() || undefined,
        finderContact: finderContact.trim() || undefined,
        location: location.trim(),
        date,
        message: message.trim(),
      });
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message || 'Failed to submit recovery notice.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs text-slate-500">Verifying LostLink Campus Tag...</p>
      </div>
    );
  }

  if (error || !tagInfo) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Tag Unrecognized</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          This QR code is either unregistered or has been deactivated by the student owner.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
        >
          Return to LostLink Campus Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/80 py-12 px-4 sm:px-6">
      <div className="max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-emerald-700 p-6 text-white text-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-2 text-white font-bold text-xl">
            L
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
            Campus Property Protection
          </span>
          <h1 className="text-xl font-extrabold mt-0.5">
            This item is registered with LostLink
          </h1>
        </div>

        {/* Item Info Card (Privacy Compliant: NO email, NO phone, NO student name!) */}
        <div className="p-6">
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mb-6 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Registered Belonging
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {tagInfo.itemName}
            </h2>
            <div className="mt-1 flex items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-emerald-800">{tagInfo.category}</span>
              <span>·</span>
              <span className="font-mono text-[11px]">{tagInfo.tagCode}</span>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Owner Successfully Notified!
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Thank you for being an honest member of the campus community. The owner has received your drop-off location note in their LostLink dashboard.
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-block"
                >
                  Visit LostLink Campus Portal
                </Link>
              </div>
            </div>
          ) : !showForm ? (
            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-600 leading-relaxed">
                Did you find this item on campus? You can notify the owner anonymously or let them know which campus reception desk you left it at.
              </p>

              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" />
                I Found This Item
              </button>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 flex items-center gap-2 text-left">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Owner contact credentials are kept private to protect student security.
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitRecovery} className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Notify Owner About Found Item
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Where is the item currently located? <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Central Library 1st Floor Reception, or With me at Hostel 2"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message for Owner <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Found on desk 14 after 2 PM lecture. Handed to security guard Officer Dave."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={finderName}
                    onChange={(e) => setFinderName(e.target.value)}
                    placeholder="e.g. Sarah / Student"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Contact (Optional)
                  </label>
                  <input
                    type="text"
                    value={finderContact}
                    onChange={(e) => setFinderContact(e.target.value)}
                    placeholder="e.g. WhatsApp / Email"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Sending Notice...' : 'Send Safe Notification'}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
