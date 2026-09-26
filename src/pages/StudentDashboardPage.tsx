import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Item, Claim, NotificationItem } from '../types/index';
import { ItemCard } from '../components/ItemCard';
import {
  User,
  PlusCircle,
  HelpCircle,
  Search,
  QrCode,
  ShieldCheck,
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Calendar,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const { user, notifications, updateProfile, markNotificationAsRead } = useAuth();

  const [activeTab, setActiveTab] = useState<'lost' | 'found' | 'claims' | 'notifications'>('lost');
  const [myLostItems, setMyLostItems] = useState<Item[]>([]);
  const [myFoundItems, setMyFoundItems] = useState<Item[]>([]);
  const [myClaims, setMyClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editDepartment, setEditDepartment] = useState(user?.department || '');
  const [editYear, setEditYear] = useState(user?.year || '');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!user) return;
    setEditName(user.name);
    setEditDepartment(user.department);
    setEditYear(user.year);

    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [lostRes, foundRes, claimsRes] = await Promise.all([
          api.getItems({ type: 'lost', reporterId: user.id }),
          api.getItems({ type: 'found', reporterId: user.id }),
          api.getClaims(),
        ]);

        setMyLostItems(lostRes.items);
        setMyFoundItems(foundRes.items);
        setMyClaims(claimsRes.claims);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({
        name: editName,
        department: editDepartment,
        year: editYear,
      });
      setShowProfileModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900">Student Login Required</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">Please log in to view your dashboard.</p>
        <Link to="/login" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">
          Sign In
        </Link>
      </div>
    );
  }

  // Calculate stats
  const activeClaimsCount = myClaims.filter(c => c.status !== 'Completed' && c.status !== 'Rejected').length;
  const returnedCount = myLostItems.filter(i => i.status === 'Returned').length + myFoundItems.filter(i => i.status === 'Returned').length;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header Profile Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-black shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Student Portal
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-mono text-slate-500">{user.studentId}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back, {user.name}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {user.department} · {user.year}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowProfileModal(true)}
                className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
              <Link
                to="/report-lost"
                className="px-3.5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Report Lost
              </Link>
              <Link
                to="/report-found"
                className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Report Found
              </Link>
              <Link
                to="/qr-tags"
                className="px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <QrCode className="w-3.5 h-3.5" />
                Generate QR Tag
              </Link>
            </div>

          </div>

          {/* Student Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                My Lost Reports
              </span>
              <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-1 block">
                {myLostItems.length}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                My Found Reports
              </span>
              <span className="text-2xl font-extrabold text-emerald-800 font-mono tabular-nums mt-1 block">
                {myFoundItems.length}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Active Claims
              </span>
              <span className="text-2xl font-extrabold text-blue-800 font-mono tabular-nums mt-1 block">
                {activeClaimsCount}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Returned Items
              </span>
              <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-1 block">
                {returnedCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Navigation Tabs (Functional Segmented Control) */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs mb-6 max-w-fit overflow-x-auto">
          <button
            onClick={() => setActiveTab('lost')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'lost'
                ? 'bg-rose-50 text-rose-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Lost Items ({myLostItems.length})
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'found'
                ? 'bg-emerald-50 text-emerald-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Found Items ({myFoundItems.length})
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'claims'
                ? 'bg-blue-50 text-blue-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Claim Requests ({myClaims.length})
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'bg-slate-100 text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Notifications ({notifications.length})
          </button>
        </div>

        {/* Tab 1: My Lost Items */}
        {activeTab === 'lost' && (
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2].map(n => (
                  <div key={n} className="h-64 bg-white rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : myLostItems.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto">
                <p className="text-sm font-bold text-slate-800">No lost items reported yet</p>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  If you misplaced anything on campus, register a report to get notified when it is found.
                </p>
                <Link
                  to="/report-lost"
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold"
                >
                  Report Lost Belonging
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myLostItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Found Items */}
        {activeTab === 'found' && (
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2].map(n => (
                  <div key={n} className="h-64 bg-white rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : myFoundItems.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto">
                <p className="text-sm font-bold text-slate-800">No found items logged</p>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Picked up an unattended card, book, or earphones? Help return it safely.
                </p>
                <Link
                  to="/report-found"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                >
                  Log Found Item
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myFoundItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Claim Requests */}
        {activeTab === 'claims' && (
          <div className="space-y-4">
            {myClaims.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto">
                <p className="text-sm font-bold text-slate-800">No ownership claims submitted</p>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Browse found items and submit descriptive verification to claim your property.
                </p>
                <Link
                  to="/browse?type=found"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                >
                  Browse Found Directory
                </Link>
              </div>
            ) : (
              myClaims.map((claim) => (
                <div key={claim.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-emerald-800">
                          {claim.item?.category || 'Item'}
                        </span>
                        <span>·</span>
                        <span className="font-mono text-[11px]">{claim.item?.reportId}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        {claim.item?.name || 'Claimed Item'}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400">Claim Status:</span>
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                          claim.status === 'Approved' || claim.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : claim.status === 'Under Review'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : claim.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>
                  </div>

                  {/* Answers summary */}
                  <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                    <div>
                      <span className="font-semibold block text-slate-800">Your Feature Description:</span>
                      <p className="mt-0.5 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        "{claim.answers.uniqueFeature}"
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold block text-slate-800">Contents Inside Specified:</span>
                      <p className="mt-0.5 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        "{claim.answers.contentsInside || 'None reported'}"
                      </p>
                    </div>
                  </div>

                  {/* Admin comment if any */}
                  {claim.adminComment && (
                    <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 text-xs text-blue-900 mb-3">
                      <strong>Campus Proctor Note:</strong> {claim.adminComment}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Submitted on {new Date(claim.createdAt).toLocaleDateString()}</span>
                    {claim.item && (
                      <Link
                        to={`/item/${claim.item.id}`}
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        View Item Page <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Notifications */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No notifications logged yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                  className={`p-4 flex items-start justify-between gap-4 hover:bg-slate-50 cursor-pointer ${
                    !n.read ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{n.title}</span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono shrink-0">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Edit Student Profile</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Update your department and enrolled year for claim verifications.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Year</label>
                <input
                  type="text"
                  required
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50"
                >
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
