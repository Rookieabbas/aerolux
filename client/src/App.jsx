import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

import { LandingPage } from './pages/LandingPage';
import { JetsPage } from './pages/JetsPage';
import { JetDetailPage } from './pages/JetDetailPage';
import { BookingFlowPage } from './pages/BookingFlowPage';
import { BookingsPage } from './pages/BookingsPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll to top helper on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      {/* Toast Notifications Configuration with Luxury Theme */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#141414',
            color: '#ffffff',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '16px',
            fontSize: '13px',
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 15px rgba(212, 175, 55, 0.15)',
            padding: '12px 18px',
          },
          success: {
            iconTheme: {
              primary: '#d4af37',
              secondary: '#141414',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#141414',
            },
            style: {
              border: '1px solid rgba(239, 68, 68, 0.4)',
            },
          },
        }}
      />

      <div className="flex flex-col min-h-screen bg-background text-white selection:bg-gold selection:text-black">
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/jets" element={<JetsPage />} />
            <Route path="/jets/:id" element={<JetDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Authenticated User Charter Routes */}
            <Route
              path="/book/:jetId"
              element={
                <ProtectedRoute>
                  <BookingFlowPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingsPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
