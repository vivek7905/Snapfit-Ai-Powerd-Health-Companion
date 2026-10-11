import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { HealthProvider } from './context/HealthContext';
import { useAuth } from './hooks/useAuth';
import { useHealth } from './hooks/useHealth';

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Toast } from './components/ui/Toast';

// Public Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Features } from './pages/Features';
import { HowItWorks } from './pages/HowItWorks';
import { Onboarding } from './pages/Onboarding';

// Authenticated Pages
import { Dashboard } from './pages/Dashboard';
import { SnapFood } from './pages/SnapFood';
import { SnapSharePage } from './pages/SnapSharePage';
import { LogMeal } from './pages/LogMeal';
import { AICoach } from './pages/AICoach';
import { VoiceLog } from './pages/VoiceLog';
import { BarcodeScannerPage } from './pages/BarcodeScannerPage';
import { Progress } from './pages/Progress';
import { Rewards } from './pages/Rewards';
import { Meals } from './pages/Meals';
import { Recommendations } from './pages/Recommendations';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

// Logout Helper Route Component
const LogoutRoute = () => {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
  }, [logout]);
  return <Navigate to="/login" replace />;
};

// Home Route Router Guard: Returning users go directly to Dashboard
const HomeRoute = () => {
  const { isLoggedIn, onboardingCompleted } = useAuth();
  if (isLoggedIn && onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }
  if (isLoggedIn && !onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  return <Landing />;
};

// Auth Route Guard for /login and /register
const AuthPublicRoute = ({ children }) => {
  const { isLoggedIn, onboardingCompleted } = useAuth();
  if (isLoggedIn && onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }
  if (isLoggedIn && !onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
};

// Onboarding Guard
const OnboardingRoute = () => {
  const { isLoggedIn, onboardingCompleted } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Onboarding />;
};

// Protected Inner Shell for Authenticated Routes
const AuthenticatedShell = () => {
  const { isLoggedIn, onboardingCompleted } = useAuth();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { toast } = useHealth();

  // If unauthenticated, redirect to login with return path
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If authenticated but onboarding not complete, redirect to onboarding wizard
  if (!onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#102033] text-slate-900 dark:text-slate-100 transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Snap Food & Camera Routes */}
            <Route path="/snap-food" element={<SnapFood />} />
            <Route path="/food-scan" element={<SnapFood />} />
            <Route path="/snap-share" element={<SnapSharePage />} />
            <Route path="/share-snap" element={<SnapSharePage />} />

            {/* Meal Logging Routes */}
            <Route path="/log-meal" element={<LogMeal />} />
            <Route path="/meals" element={<Meals />} />

            {/* AI Coach & Voice Log Routes */}
            <Route path="/ai-coach" element={<AICoach />} />
            <Route path="/voice-log" element={<VoiceLog />} />

            {/* Barcode Scanner Routes */}
            <Route path="/barcode" element={<BarcodeScannerPage />} />
            <Route path="/scanner" element={<BarcodeScannerPage />} />

            {/* Analytics & Progress Routes */}
            <Route path="/progress" element={<Progress />} />
            <Route path="/analytics" element={<Progress />} />

            {/* Rewards & Gamification Routes */}
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/achievements" element={<Rewards />} />

            {/* Secondary Routes */}
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <Toast toast={toast} />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HealthProvider>
          <Routes>
            {/* Public Marketing Routes */}
            <Route path="/" element={<HomeRoute />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/features" element={<Features />} />
            <Route path="/how-it-works" element={<HowItWorks />} />

            {/* Auth Routes */}
            <Route
              path="/login"
              element={
                <AuthPublicRoute>
                  <Login />
                </AuthPublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <AuthPublicRoute>
                  <Register />
                </AuthPublicRoute>
              }
            />
            <Route path="/logout" element={<LogoutRoute />} />

            {/* 4-Step Onboarding Route */}
            <Route path="/onboarding" element={<OnboardingRoute />} />

            {/* Authenticated Dashboard Routes (Protected) */}
            <Route path="/*" element={<AuthenticatedShell />} />
          </Routes>
        </HealthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
