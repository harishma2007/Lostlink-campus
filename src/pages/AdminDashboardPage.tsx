import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AdminStats, Item, Claim, User } from '../types/index';
import {
  ShieldCheck,
  Users,
  Package,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Check,
  X,
  ExternalLink,
  Search,
  Filter,
  BarChart3,
  Building,
  RefreshCw,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeSection, setActiveSection] = useState<'overview' | 'claims' | 'reports' | 'users' | 'suspicious'>('overview');

  // Claim action modal
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [adminComment, setAdminComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, itemsRes, claimsRes, usersRes] = await Promise.all([
        api.getAdminStats(),
        api.getItems(),
        api.getClaims(),
        api.getAdminUsers(),
      ]);

      setStats(statsRes.stats);
      setItems(itemsRes.items);
      setClaims(claimsRes.claims);
      setUsersList(usersRes.users);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          This portal requires administrative privileges (Campus Safety / Faculty Proctors).
        </p>
        <Link to="/login" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">
          Sign In with Admin Account
        </Link>
      </div>
    );
  }

  const handleUpdateClaim = async (status: 'Approved' | 'Rejected' | 'Under Review' | 'Completed') => {
    if (!selectedClaim) return;
    setActionLoading(true);
    try {
      await api.updateClaimStatus(selectedClaim.id, status, adminComment);
      setSelectedClaim(null);
      setAdminComment('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update claim');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to permanently delete this report?')) return;
    try {
      await api.deleteItem(itemId);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete item');
    }
  };

  const handleMarkItemReturned = async (item: Item) => {
    try {
      await api.updateItem(item.id, { status: 'Returned' });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this user account?')) return;
    try {
      await api.deleteUser(userId);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to remove user');
    }
  };

  const suspiciousReports = items.filter(i => i.isSuspicious);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                Campus Safety &amp; Administration Console
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                LostLink Management Portal
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Overseeing verified ownership claims, campus property vaults, and user access.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>
              <Link
                to="/browse"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Public Directory
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Registered Users
                </span>
                <span className="text-xl font-extrabold text-white font-mono tabular-nums mt-0.5 block">
                  {stats.totalUsers}
                </span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Lost Reports
                </span>
                <span className="text-xl font-extrabold text-rose-400 font-mono tabular-nums mt-0.5 block">
                  {stats.totalLost}
                </span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Found Vault Items
                </span>
                <span className="text-xl font-extrabold text-emerald-400 font-mono tabular-nums mt-0.5 block">
                  {stats.totalFound}
                </span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Pending Claims
                </span>
                <span className="text-xl font-extrabold text-amber-400 font-mono tabular-nums mt-0.5 block">
                  {stats.pendingClaims}
                </span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Returned Safely
                </span>
                <span className="text-xl font-extrabold text-white font-mono tabular-nums mt-0.5 block">
                  {stats.returnedItems}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs mb-6 max-w-fit overflow-x-auto">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              activeSection === 'overview'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Analytics &amp; Charts
          </button>
          <button
            onClick={() => setActiveSection('claims')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'claims'
                ? 'bg-amber-100 text-amber-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Review Claims ({claims.filter(c => c.status === 'Pending' || c.status === 'Under Review').length})
          </button>
          <button
            onClick={() => setActiveSection('reports')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              activeSection === 'reports'
                ? 'bg-slate-100 text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Reports ({items.length})
          </button>
          <button
            onClick={() => setActiveSection('suspicious')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'suspicious'
                ? 'bg-rose-100 text-rose-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Suspicious Listings ({suspiciousReports.length})
          </button>
          <button
            onClick={() => setActiveSection('users')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              activeSection === 'users'
                ? 'bg-slate-100 text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Campus Users ({usersList.length})
          </button>
        </div>

        {/* Section 1: Overview & Charts */}
        {activeSection === 'overview' && stats && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Category Breakdown Chart */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Items by Category
                </h3>
                <div className="space-y-3">
                  {stats.itemsByCategory.map((c) => {
                    const percent = Math.round((c.count / (items.length || 1)) * 100);
                    return (
                      <div key={c.category} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">{c.category}</span>
                          <span className="font-mono text-slate-500">{c.count} items ({percent}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${Math.max(8, percent)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reports by Campus Location */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Reports by Campus Location
                </h3>
                <div className="space-y-3">
                  {stats.reportsByLocation.map((loc) => {
                    const percent = Math.round((loc.count / (items.length || 1)) * 100);
                    return (
                      <div key={loc.location} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">{loc.location}</span>
                          <span className="font-mono text-slate-500">{loc.count} reports</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-800 rounded-full"
                            style={{ width: `${Math.max(12, percent * 1.5)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Monthly Recovery Statistics */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Monthly Campus Recovery Progression
              </h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                {stats.monthlyRecovery.map((m) => (
                  <div key={m.month} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-700">{m.month} 2026</span>
                    <div className="mt-2 space-y-1 text-xs font-mono">
                      <div className="text-rose-600 font-semibold">{m.lost} Lost</div>
                      <div className="text-emerald-700 font-semibold">{m.found} Found</div>
                      <div className="text-emerald-900 font-bold bg-emerald-50 rounded py-0.5">
                        {m.returned} Returned
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Section 2: Review Claims */}
        {activeSection === 'claims' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Ownership Claim Verification Queue ({claims.length})
              </h3>
            </div>

            {claims.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No claim requests pending review.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {claims.map((claim) => (
                  <div key={claim.id} className="p-5 hover:bg-slate-50/60 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${
                              claim.status === 'Approved'
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
                          <span className="font-mono text-xs text-slate-500 font-semibold">
                            {claim.item?.reportId}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900">
                          {claim.item?.name || 'Item'}
                        </h4>

                        <div className="text-xs text-slate-600">
                          <strong>Claimant:</strong> {claim.claimantName} ({claim.claimantStudentId}) · {claim.claimantDepartment}
                        </div>

                        {/* Verification Answers */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs space-y-1.5 mt-2">
                          <p>
                            <span className="font-bold text-slate-700">Unique Feature:</span>{' '}
                            <span className="italic">"{claim.answers.uniqueFeature}"</span>
                          </p>
                          <p>
                            <span className="font-bold text-slate-700">Contents Inside:</span>{' '}
                            <span className="italic">"{claim.answers.contentsInside || 'None'}"</span>
                          </p>
                          <p>
                            <span className="font-bold text-slate-700">Lost At:</span>{' '}
                            <span>{claim.answers.locationLost} on {claim.answers.dateLost}</span>
                          </p>
                          {claim.adminComment && (
                            <p className="pt-1 text-emerald-800 font-medium">
                              <strong>Admin Comment:</strong> {claim.adminComment}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedClaim(claim);
                            setAdminComment(claim.adminComment || '');
                          }}
                          className="px-3.5 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
                        >
                          Review &amp; Verify
                        </button>
                        {claim.item && (
                          <Link
                            to={`/item/${claim.item.id}`}
                            className="p-1.5 text-slate-400 hover:text-slate-800"
                            title="Inspect physical report"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 3: All Reports */}
        {activeSection === 'reports' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Report ID</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Item Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((i) => (
                    <tr key={i.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-mono font-semibold text-slate-600">
                        {i.reportId}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                            i.type === 'lost' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {i.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900 max-w-xs truncate">
                        {i.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{i.category}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-[150px] truncate">{i.location}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-700">{i.status}</span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {i.status !== 'Returned' && (
                          <button
                            onClick={() => handleMarkItemReturned(i)}
                            className="px-2 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded font-semibold text-[11px]"
                            title="Mark as returned to owner"
                          >
                            Mark Returned
                          </button>
                        )}
                        <Link
                          to={`/item/${i.id}`}
                          className="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-semibold text-[11px]"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteItem(i.id)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                          title="Delete report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 4: Suspicious Listings */}
        {activeSection === 'suspicious' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 bg-rose-50/50 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                Flagged Campus Listings ({suspiciousReports.length})
              </h3>
            </div>

            {suspiciousReports.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No listings flagged as suspicious at this time.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {suspiciousReports.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-slate-500">{item.reportId}</span>
                        <span className="font-bold text-slate-900">{item.name}</span>
                      </div>
                      <p className="text-xs text-rose-700 mt-1 font-medium">
                        Flag Reason: {item.suspiciousReason || 'Reported by campus user'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/item/${item.id}`}
                        className="px-3 py-1.5 text-xs bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200"
                      >
                        Inspect
                      </Link>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="px-3 py-1.5 text-xs bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700"
                      >
                        Remove Listing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 5: Campus Users */}
        {activeSection === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">College Email</th>
                  <th className="px-4 py-3">Student ID</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-bold text-slate-900">{u.name}</td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{u.studentId}</td>
                    <td className="px-4 py-3 text-slate-600">{u.department}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {u.id !== user.id && (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Remove user account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Claim Review Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Review Ownership Verification
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Item: <strong>{selectedClaim.item?.name}</strong> ({selectedClaim.item?.reportId})
            </p>

            <div className="my-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div>
                <span className="font-bold text-slate-700 block">Claimant:</span>
                <span>{selectedClaim.claimantName} ({selectedClaim.claimantStudentId}) - {selectedClaim.claimantEmail}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">Feature Stated:</span>
                <span className="italic">"{selectedClaim.answers.uniqueFeature}"</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">Contents Inside Stated:</span>
                <span className="italic">"{selectedClaim.answers.contentsInside || 'None'}"</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Evaluation Note / Handover Instructions
              </label>
              <textarea
                rows={2}
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                placeholder="e.g. Verified with student ID card. Handover completed at Security Office."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none"
              ></textarea>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedClaim(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleUpdateClaim('Rejected')}
                className="px-3 py-1.5 text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg border border-rose-200"
              >
                Reject Claim
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleUpdateClaim('Under Review')}
                className="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-lg border border-blue-200"
              >
                Mark Under Review
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleUpdateClaim('Approved')}
                className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-2xs"
              >
                Approve Ownership
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleUpdateClaim('Completed')}
                className="px-4 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-2xs"
              >
                Mark Handover Complete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
