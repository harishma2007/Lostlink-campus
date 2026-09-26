import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { BrowseItemsPage } from './pages/BrowseItemsPage';
import { ItemDetailsPage } from './pages/ItemDetailsPage';
import { ReportLostPage } from './pages/ReportLostPage';
import { ReportFoundPage } from './pages/ReportFoundPage';
import { ClaimPage } from './pages/ClaimPage';
import { QRTagManagerPage } from './pages/QRTagManagerPage';
import { QRRecoverPage } from './pages/QRRecoverPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { SafetyRulesPage } from './pages/SafetyRulesPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/browse" element={<BrowseItemsPage />} />
              <Route path="/item/:id" element={<ItemDetailsPage />} />
              <Route path="/report-lost" element={<ReportLostPage />} />
              <Route path="/report-found" element={<ReportFoundPage />} />
              <Route path="/claim/:itemId" element={<ClaimPage />} />
              <Route path="/qr-tags" element={<QRTagManagerPage />} />
              <Route path="/qr/:tagCode" element={<QRRecoverPage />} />
              <Route path="/student/dashboard" element={<StudentDashboardPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/safety" element={<SafetyRulesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* Catch-all to Landing */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
