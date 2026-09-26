import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../services/api';
import { QRTag, ItemCategory } from '../types/index';
import { useAuth } from '../context/AuthContext';
import {
  QrCode,
  Plus,
  ShieldCheck,
  Download,
  ExternalLink,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  Sparkles,
} from 'lucide-react';

const CATEGORIES: ItemCategory[] = [
  'Electronics',
  'ID Cards',
  'Books',
  'Bags',
  'Wallets',
  'Keys',
  'Accessories',
  'Clothing',
  'Other',
];

export const QRTagManagerPage: React.FC = () => {
  const { user } = useAuth();
  const [tags, setTags] = useState<QRTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<QRTag | null>(null);

  const [newItemName, setNewItemName] = useState('');
  const [newCategory, setNewCategory] = useState<ItemCategory>('Electronics');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadTags();
  }, [user]);

  const loadTags = async () => {
    setLoading(true);
    try {
      const res = await api.getQRTags();
      setTags(res.tags);
      if (res.tags.length > 0 && !selectedTag) {
        setSelectedTag(res.tags[0]);
      }
    } catch (err) {
      console.error('Failed to load QR tags:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setCreating(true);
    try {
      const res = await api.createQRTag({
        itemName: newItemName.trim(),
        category: newCategory,
      });
      setTags(prev => [res.tag, ...prev]);
      setSelectedTag(res.tag);
      setNewItemName('');
      setShowCreateModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create QR tag');
    } finally {
      setCreating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Student Sign In Required</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          To generate LostLink QR Tags for your belongings, sign in with your college account.
        </p>
        <Link
          to="/login"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                <QrCode className="w-4 h-4 text-emerald-700" />
                Asset Protection Suite
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                LostLink QR Tags
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Generate anonymous recovery tags for your laptops, keys, and textbooks without sharing your private contact details.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition-colors self-start"
            >
              <Plus className="w-4 h-4" />
              Generate New Tag
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Registered Tags List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                My Protected Belongings ({tags.length})
              </h2>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map(n => (
                  <div key={n} className="h-24 bg-white rounded-xl border border-slate-200 animate-pulse"></div>
                ))}
              </div>
            ) : tags.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <QrCode className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">No QR Tags Registered</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Create a printable tag for your valuable campus belongings now.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg"
                >
                  Create My First Tag
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    onClick={() => setSelectedTag(tag)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedTag?.id === tag.id
                        ? 'bg-emerald-50/50 border-emerald-300 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-semibold text-emerald-800">{tag.category}</span>
                          <span>·</span>
                          <span className="font-mono text-[11px]">{tag.tagCode}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">{tag.itemName}</h4>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{tag.recoveries.length} scan log(s)</span>
                      <span className="text-emerald-700 font-semibold">View Print Tag &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: QR Code Tag Preview & Print Card */}
          <div className="lg:col-span-7">
            {selectedTag ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Printable Digital Asset Tag
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{selectedTag.itemName}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrint}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print Tag
                    </button>
                    <Link
                      to={`/qr/${selectedTag.tagCode}`}
                      target="_blank"
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Test Scan
                    </Link>
                  </div>
                </div>

                {/* Physical Tag Simulation Badge */}
                <div className="my-8 max-w-sm mx-auto p-6 bg-white border-2 border-dashed border-emerald-500 rounded-2xl text-center shadow-lg print:border-solid">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-slate-900 mb-1">
                    <div className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                      L
                    </div>
                    <span>LostLink Protected Asset</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-700">{selectedTag.itemName}</p>
                  
                  {/* Real QR Code */}
                  <div className="my-4 flex items-center justify-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <QRCodeSVG
                      value={`${window.location.origin}/qr/${selectedTag.tagCode}`}
                      size={160}
                      level="H"
                      includeMargin={false}
                    />
                  </div>

                  <p className="font-mono text-xs font-extrabold text-slate-900">{selectedTag.tagCode}</p>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] mx-auto leading-tight">
                    If found on campus, scan with any phone camera to notify the owner.
                  </p>
                </div>

                {/* Recovery / Scan History */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                    Scan Recovery Messages ({selectedTag.recoveries.length})
                  </h4>

                  {selectedTag.recoveries.length === 0 ? (
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-4 rounded-xl">
                      No scans reported yet. If someone scans your tag, their drop-off location and message will appear here and in your notifications.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedTag.recoveries.map((rec) => (
                        <div key={rec.id} className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs space-y-1.5">
                          <div className="flex items-center justify-between font-semibold text-emerald-950">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                              {rec.location}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {rec.date} · {rec.time}
                            </span>
                          </div>
                          <p className="text-slate-700 leading-relaxed italic">
                            "{rec.message}"
                          </p>
                          {rec.finderContact && (
                            <p className="text-[11px] text-slate-500 pt-1">
                              Finder note: {rec.finderContact}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
                Select or generate a QR tag to view details and print.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-600" />
              Generate LostLink Asset Tag
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Give your valuable possession an anonymous recovery identity.
            </p>

            <form onSubmit={handleCreateTag} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. MacBook Pro 14 M3, Keys with Car Fob, TI-84"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ItemCategory)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:bg-white focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50"
                >
                  {creating ? 'Generating Tag...' : 'Generate Tag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
