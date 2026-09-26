import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, PlusCircle, ShieldCheck, QrCode, User as UserIcon, LogOut, ChevronDown, CheckCheck, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <Link to="/" className="flex items-center gap-2 group focus:outline-none">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-emerald-700 transition-colors">
            L
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
            LostLink
          </span>
          <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wider">
            Campus
          </span>
        </Link>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <Link
            to="/browse"
            className={`hover:text-emerald-700 transition-colors ${
              location.pathname === '/browse' ? 'text-emerald-700 font-semibold' : ''
            }`}
          >
            Browse Directory
          </Link>
          <Link
            to="/report-lost"
            className={`hover:text-emerald-700 transition-colors ${
              location.pathname === '/report-lost' ? 'text-emerald-700 font-semibold' : ''
            }`}
          >
            Report Lost
          </Link>
          <Link
            to="/report-found"
            className={`hover:text-emerald-700 transition-colors ${
              location.pathname === '/report-found' ? 'text-emerald-700 font-semibold' : ''
            }`}
          >
            Report Found
          </Link>
          <Link
            to="/qr-tags"
            className={`hover:text-emerald-700 transition-colors ${
              location.pathname === '/qr-tags' ? 'text-emerald-700 font-semibold' : ''
            }`}
          >
            QR Tag Recovery
          </Link>
          <Link
            to="/safety"
            className={`hover:text-emerald-700 transition-colors ${
              location.pathname === '/safety' ? 'text-emerald-700 font-semibold' : ''
            }`}
          >
            Safety &amp; Rules
          </Link>
        </nav>

        {/* Zone 3: 1-2 primary actions & User controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Notification Bell Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Campus notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white tabular-nums">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">Notifications</span>
                        <span className="text-xs text-slate-500 tabular-nums">({unreadCount} new)</span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-500">
                          No notifications at this time
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationAsRead(n.id);
                              if (n.link) navigate(n.link);
                              setNotifOpen(false);
                            }}
                            className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                              !n.read ? 'bg-emerald-50/40' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                              <span className="text-[10px] text-slate-600 shrink-0 font-mono">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="px-4 py-2 border-t border-slate-100 text-center">
                      <Link
                        to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                        onClick={() => setNotifOpen(false)}
                        className="text-xs font-medium text-emerald-700 hover:underline"
                      >
                        View all in Dashboard &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Menu */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 py-1 px-2.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-medium transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline-block max-w-[120px] truncate font-semibold">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        <span className="capitalize">{user.role}</span>
                        <span>·</span>
                        <span>{user.studentId}</span>
                      </div>
                    </div>

                    <div className="py-1">
                      {user.role === 'admin' ? (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Admin Console
                        </Link>
                      ) : (
                        <Link
                          to="/student/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          <UserIcon className="w-4 h-4 text-emerald-600" />
                          Student Dashboard
                        </Link>
                      )}

                      <Link
                        to="/qr-tags"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <QrCode className="w-4 h-4 text-emerald-600" />
                        My QR Tags
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm whitespace-nowrap"
              >
                Join LostLink
              </Link>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <Link
              to="/browse"
              className="px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-900 font-semibold"
            >
              Browse Directory
            </Link>
            <Link
              to="/report-lost"
              className="px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-900 font-semibold"
            >
              Report Lost Item
            </Link>
            <Link
              to="/report-found"
              className="px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-900 font-semibold"
            >
              Report Found Item
            </Link>
            <Link
              to="/qr-tags"
              className="px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-900 font-semibold"
            >
              QR Tag Recovery
            </Link>
            <Link
              to="/safety"
              className="px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-900 font-semibold"
            >
              Safety &amp; Rules
            </Link>
            {user && (
              <Link
                to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 font-bold"
              >
                {user.role === 'admin' ? 'Admin Console' : 'My Student Dashboard'}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
