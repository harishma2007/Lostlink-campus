import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ItemCategory, Item, MatchScore } from '../types/index';
import { useAuth } from '../context/AuthContext';
import {
  HelpCircle,
  Upload,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  Shield,
  Building,
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

export const ReportFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics' as ItemCategory,
    description: '',
    image: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    currentLocation: 'Campus Security Main Gate Desk',
    additionalDetails: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedItem, setSubmittedItem] = useState<Item | null>(null);
  const [matches, setMatches] = useState<MatchScore[]>([]);

  // If not logged in, prompt sign in
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Student Sign In Required</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          To safely log found campus property and prevent malicious prank listings, please sign in.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
          >
            Sign In with College Email
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold"
          >
            Register Student Account
          </Link>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Please choose an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await api.createItem({
        type: 'found',
        name: formData.name,
        category: formData.category,
        description: formData.description,
        image: formData.image,
        location: formData.location,
        date: formData.date,
        time: formData.time,
        currentLocation: formData.currentLocation,
        additionalDetails: formData.additionalDetails,
      });

      setSubmittedItem(res.item);
      setMatches(res.matches || []);
    } catch (err: any) {
      setError(err.message || 'Failed to submit found item report.');
    } finally {
      setSubmitting(false);
    }
  };

  // Confirmation View
  if (submittedItem) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Found Item Logged Successfully!
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Thank you for being a responsible member of the campus community.
          </p>

          <div className="my-6 p-4 bg-slate-50 rounded-xl border border-slate-200 inline-block">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Found Tracking ID
            </span>
            <span className="font-mono text-xl font-extrabold text-emerald-700">
              {submittedItem.reportId}
            </span>
          </div>

          {/* Smart Match Notification Banner */}
          {matches.length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Smart Match: Possible Owner Found!</span>
              </div>
              <p className="text-xs text-emerald-800">
                A student has previously reported losing a matching item around this campus area:
              </p>
              <div className="mt-3 space-y-2">
                {matches.map(({ item: mItem }) => (
                  <Link
                    key={mItem.id}
                    to={`/item/${mItem.id}`}
                    className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-emerald-100 text-xs font-semibold text-slate-800 hover:bg-emerald-50 transition-colors"
                  >
                    <span>{mItem.name} ({mItem.location})</span>
                    <span className="text-emerald-700 font-bold">
                      View Lost Listing &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to={`/item/${submittedItem.id}`}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              View Found Vault Record
            </Link>
            <Link
              to="/student/dashboard"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
            >
              Go to Student Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Found Item Registration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Report a Found Belonging
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Log the item details and safekeeping location so the owner can submit descriptive ownership verification.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Item Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Set of Keys with Blue Lanyard, TI-84 Plus Calculator"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Category & Location Found */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ItemCategory })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Location Found <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Central Library (1st Floor Computer Lab)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Current Safekeeping Spot */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Current Item Safekeeping Location <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.currentLocation}
              onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
              placeholder="e.g. Handed to Library Circulation Desk, Or Kept with Reporter at Hostel 4"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              For high value items (wallets, phones), we recommend depositing them at the nearest Campus Security Desk.
            </p>
          </div>

          {/* Date & Time Found */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Date Found <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Approximate Time Found
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Public Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Give a general description (e.g. Navy blue backpack found on desk). DO NOT describe unique items inside that the owner must specify to prove ownership!"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            ></textarea>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Photo (Optional)
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Choose Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {formData.image && (
                <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="absolute top-0 right-0 bg-slate-900/70 text-white text-[10px] w-4 h-4 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Additional notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Additional Details / Handover Notes
            </label>
            <input
              type="text"
              value={formData.additionalDetails}
              onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
              placeholder="e.g. Has a small key attached, handed to security officer on duty"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/browse"
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
            >
              {submitting ? 'Registering Item...' : 'Log Found Item'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
