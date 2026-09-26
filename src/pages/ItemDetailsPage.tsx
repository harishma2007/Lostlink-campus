import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Item, MatchScore } from '../types/index';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  UserCheck,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Lock,
  Package,
  Flag,
  Share2,
} from 'lucide-react';

export const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState<Item | null>(null);
  const [matches, setMatches] = useState<MatchScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  // Suspicious flag modal
  const [showFlagModal, setShowFlagModal] = useState<boolean>(false);
  const [flagReason, setFlagReason] = useState<string>('');
  const [flagSuccess, setFlagSuccess] = useState<boolean>(false);
  const [flagSubmitting, setFlagSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const loadItemAndMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const itemRes = await api.getItem(id);
        setItem(itemRes.item);

        // Fetch rule matches
        const matchesRes = await api.getItemMatches(id);
        setMatches(matchesRes.matches);
      } catch (err: any) {
        setError(err.message || 'Failed to load item details');
      } finally {
        setLoading(false);
      }
    };

    loadItemAndMatches();
  }, [id]);

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !flagReason.trim()) return;

    setFlagSubmitting(true);
    try {
      await api.flagSuspicious(item.id, flagReason);
      setFlagSuccess(true);
      setItem(prev => prev ? { ...prev, isSuspicious: true } : null);
      setTimeout(() => {
        setShowFlagModal(false);
        setFlagSuccess(false);
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to flag report');
    } finally {
      setFlagSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-slate-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-slate-200 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-24 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Item Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          This report may have been resolved, removed, or the link is invalid.
        </p>
        <Link
          to="/browse"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
        >
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top back navigation */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to listings
          </button>
          
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-500 font-semibold">{item.reportId}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Item link copied to clipboard!');
              }}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100"
              title="Share item link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Large Image & Meta */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-4/3 w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
              {item.image && !imageError ? (
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-linear-to-br from-slate-100 to-slate-200 text-center">
                  <Package className="w-16 h-16 text-slate-400 mb-2" />
                  <p className="text-sm font-bold text-slate-700">Official Report Photo Vault</p>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">
                    No public photo was provided or image is secured at Campus Desk.
                  </p>
                  <span className="mt-3 font-mono text-xs font-semibold text-slate-600 bg-white px-3 py-1 rounded-md border border-slate-300">
                    {item.reportId}
                  </span>
                </div>
              )}

              {/* Status pill-less text tag */}
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-lg shadow-sm border ${
                    item.type === 'lost'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {item.type === 'lost' ? 'Reported Lost' : 'Found & In Safekeeping'}
                </span>
              </div>
            </div>

            {/* Smart Rule-Based Match Box (if any) */}
            {matches.length > 0 && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-sm font-bold text-emerald-900">
                    Smart Match Engine: Possible Candidate Found
                  </h4>
                </div>
                <p className="text-xs text-emerald-800 mb-4">
                  Our system correlated this listing with active campus reports. Matches are algorithmically suggested and require official claim verification:
                </p>

                <div className="space-y-3">
                  {matches.slice(0, 2).map(({ item: matchedItem, matchReasons, score }) => (
                    <div
                      key={matchedItem.id}
                      className="bg-white p-3.5 rounded-lg border border-emerald-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-semibold text-emerald-700 uppercase tracking-wider text-[10px]">
                            Candidate {matchedItem.type}
                          </span>
                          <span>·</span>
                          <span className="font-mono">{matchedItem.reportId}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">{matchedItem.name}</p>
                        <ul className="mt-1 text-[11px] text-slate-600 space-y-0.5">
                          {matchReasons.map((reason, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Link
                        to={`/item/${matchedItem.id}`}
                        className="self-start sm:self-center px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md whitespace-nowrap transition-colors"
                      >
                        Inspect Candidate &rarr;
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Information, Claim Button, Campus Safeguards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
                  <span className="text-emerald-800 font-semibold">{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Logged {new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {item.name}
                </h1>
              </div>

              {/* Status Box */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Current Status
                  </span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                    {item.status}
                  </span>
                </div>
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  ID: {item.reportId}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Report Description
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  {item.description}
                </p>
              </div>

              {/* Location and Time Details */}
              <div className="space-y-3 pt-2 text-xs text-slate-700 border-t border-slate-100">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-slate-900">
                      {item.type === 'lost' ? 'Location Lost' : 'Location Found'}
                    </span>
                    <span className="text-slate-600">{item.location}</span>
                  </div>
                </div>

                {item.currentLocation && (
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-slate-900">Current Safekeeping Spot</span>
                      <span className="text-slate-600">{item.currentLocation}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.time}</span>
                  </div>
                </div>

                {item.additionalDetails && (
                  <div className="pt-2 text-xs text-slate-500 italic">
                    Note: "{item.additionalDetails}"
                  </div>
                )}
              </div>

              {/* Ownership Claim Action Section */}
              {item.type === 'found' && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200/80 mb-4">
                    <p className="text-xs font-bold text-emerald-900">
                      This item may belong to you?
                    </p>
                    <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                      Submit an ownership claim verification. To protect student property, you will answer specific questions only the true owner would know.
                    </p>
                  </div>

                  {item.status === 'Returned' ? (
                    <div className="w-full py-2.5 px-4 bg-slate-100 text-slate-600 rounded-xl text-center text-xs font-bold">
                      Item Already Safely Returned to Owner
                    </div>
                  ) : (
                    <Link
                      to={`/claim/${item.id}`}
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      Request Ownership / Submit Claim
                    </Link>
                  )}
                </div>
              )}

              {/* Privacy Notice Banner */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5 text-[11px] text-slate-500">
                <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Privacy Safeguard:</strong> Direct student phone numbers and emails are never exposed. Verification and handovers are coordinated by campus safety proctors.
                </span>
              </div>

              {/* Flag Suspicious Listing */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                <span>Reporter: {item.reporterDepartment}</span>
                <button
                  onClick={() => setShowFlagModal(true)}
                  className="text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
                >
                  <Flag className="w-3.5 h-3.5" />
                  Report Listing
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Flag Report Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flag className="w-4 h-4 text-rose-600" />
              Report Inappropriate or Suspicious Listing
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Help campus administration keep LostLink reliable and honest.
            </p>

            {flagSuccess ? (
              <div className="my-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg text-center">
                Report logged. Campus safety proctors have been alerted.
              </div>
            ) : (
              <form onSubmit={handleFlagSubmit} className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reason for Flagging
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    placeholder="Describe why this listing is suspicious (e.g. fraudulent claim, inappropriate photo, duplicate entry)..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowFlagModal(false)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={flagSubmitting}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg disabled:opacity-50"
                  >
                    {flagSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
