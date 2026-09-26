import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Item, Claim } from '../types/index';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Upload,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowLeft,
  HelpCircle,
} from 'lucide-react';

export const ClaimPage: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [answers, setAnswers] = useState({
    uniqueFeature: '',
    contentsInside: '',
    locationLost: '',
    dateLost: new Date().toISOString().split('T')[0],
  });
  const [proofImage, setProofImage] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedClaim, setSubmittedClaim] = useState<Claim | null>(null);

  useEffect(() => {
    if (!itemId) return;

    const loadItem = async () => {
      try {
        const res = await api.getItem(itemId);
        setItem(res.item);
      } catch (err: any) {
        setError(err.message || 'Failed to load item for claim');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [itemId]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Student Sign In Required</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Ownership claims must be tied to a verified college student ID to prevent wrongful claims.
        </p>
        <Link
          to="/login"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
        >
          Sign In to Submit Claim
        </Link>
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
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await api.submitClaim({
        itemId: item.id,
        answers,
        proofImage,
      });

      setSubmittedClaim(res.claim);
    } catch (err: any) {
      setError(err.message || 'Failed to submit claim verification');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  if (submittedClaim) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Claim Request Submitted!
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Your ownership verification answers have been sent to Campus Safety and LostLink Proctors for review.
          </p>

          <div className="my-6 p-4 bg-slate-50 rounded-xl border border-slate-200 inline-block text-left text-xs space-y-1">
            <p className="text-slate-600">
              <strong>Item:</strong> {item?.name} ({item?.reportId})
            </p>
            <p className="text-slate-600">
              <strong>Claim Status:</strong>{' '}
              <span className="font-semibold text-amber-800">Pending Review</span>
            </p>
            <p className="text-slate-600">
              <strong>Claimant:</strong> {user.name} ({user.studentId})
            </p>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 text-left mb-6">
            <p className="font-bold mb-1">What happens next?</p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-emerald-900">
              <li>Admin will verify your unique feature description against the physical item.</li>
              <li>You will receive an in-app notification when the claim is approved.</li>
              <li>Handover will take place at the designated campus office with your student card.</li>
            </ul>
          </div>

          <div className="flex justify-center gap-3">
            <Link
              to="/student/dashboard"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Track in Student Dashboard
            </Link>
            <Link
              to="/browse"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
            >
              Browse Other Items
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          to={itemId ? `/item/${itemId}` : '/browse'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Item Details
        </Link>

        {/* Item Summary Bar */}
        {item && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Target Found Item
              </span>
              <h2 className="text-base font-bold text-slate-900">{item.name}</h2>
              <p className="text-xs text-slate-500 font-mono">Found at: {item.location}</p>
            </div>
            <span className="font-mono text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              {item.reportId}
            </span>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            <ShieldCheck className="w-4 h-4" />
            Verification Questionnaire
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Claim Ownership of this Item
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            To prevent wrongful property recovery, answer these descriptive questions. These answers are kept private between you and Campus Safety Proctors.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Question 1: Unique Feature */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5">
              1. Describe a unique identifying feature of this item: <span className="text-rose-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              e.g. Scratches, stickers, custom engraving, passcode pattern, lock combination, key chain design.
            </p>
            <textarea
              rows={3}
              required
              value={answers.uniqueFeature}
              onChange={(e) => setAnswers({ ...answers, uniqueFeature: e.target.value })}
              placeholder="e.g. Small red sticker on bottom left corner, faint scratch across the logo..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            ></textarea>
          </div>

          {/* Question 2: Contents inside */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5">
              2. What was inside the item? (If applicable) <span className="text-rose-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              For bags, pouches, or wallets: mention specific items, notebook titles, cards, or approximate denominations.
            </p>
            <textarea
              rows={3}
              required
              value={answers.contentsInside}
              onChange={(e) => setAnswers({ ...answers, contentsInside: e.target.value })}
              placeholder="e.g. Blue spiral notebook for Data Structures, gray earbuds case, library card..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            ></textarea>
          </div>

          {/* Question 3 & 4: Location & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">
                3. Where did you lose it? <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={answers.locationLost}
                onChange={(e) => setAnswers({ ...answers, locationLost: e.target.value })}
                placeholder="e.g. 2nd floor library reading carrel"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">
                4. Approximate date you lost it: <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={answers.dateLost}
                onChange={(e) => setAnswers({ ...answers, dateLost: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Question 5: Optional Proof / Photo */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5">
              5. Upload optional proof or past photo of the item:
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Past selfie with item, purchase invoice, serial number card, or warranty email screenshot.
            </p>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload Proof Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {proofImage && (
                <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200">
                  <img src={proofImage} alt="Proof" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setProofImage('')}
                    className="absolute top-0 right-0 bg-slate-900/70 text-white text-[10px] w-4 h-4 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Safety Pledge */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              By submitting this claim, you confirm under university honor code that this item is your legal property. Submitting fraudulent claims is subject to college disciplinary action.
            </span>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to={`/item/${item?.id}`}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting Claim...' : 'Submit Claim Verification'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
