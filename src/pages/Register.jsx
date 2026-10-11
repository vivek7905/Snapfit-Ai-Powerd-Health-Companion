import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Target, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword, validateName } from '../utils/validators';

export const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  // Required Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Additional Optional Setup
  const [showOptionalSetup, setShowOptionalSetup] = useState(false);
  const [age, setAge] = useState('24');
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('68');
  const [activityLevel, setActivityLevel] = useState('Moderate');
  const [healthGoal, setHealthGoal] = useState('Build Muscle');

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const healthGoals = [
    'Build Muscle',
    'Lose Weight',
    'Maintain Weight',
    'Improve Fitness',
    'Healthy Lifestyle'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    let confirmErr = '';

    if (password !== confirmPassword) {
      confirmErr = 'Passwords do not match';
    }

    if (nameErr || emailErr || passErr || confirmErr) {
      setErrors({
        name: nameErr,
        email: emailErr,
        password: passErr,
        confirmPassword: confirmErr
      });
      return;
    }

    setErrors({});

    try {
      await register(name, email, password, healthGoal, {
        age: parseInt(age, 10) || 24,
        heightCm: parseInt(height, 10) || 175,
        weightKg: parseInt(weight, 10) || 68,
        activityLevel
      });
      // CRITICAL REQUIREMENT: DO NOT OPEN DASHBOARD. Open LOGIN screen with email pre-filled.
      navigate('/login', { state: { registeredEmail: email, justRegistered: true } });
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] sm:min-h-screen sm:h-auto sm:max-h-none bg-slate-50 dark:bg-[#14213D] flex flex-col justify-between sm:justify-center py-2 px-3.5 sm:py-12 sm:px-6 lg:px-8 relative overflow-hidden sm:overflow-auto transition-colors safe-area-pt safe-area-pb">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#087F5B]/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 space-y-1 sm:space-y-3 shrink-0">
        {/* Official Brand Logo */}
        <Link to="/" className="inline-flex items-center space-x-2.5 sm:space-x-3 mb-0.5 sm:mb-2">
          <img
            src="/snapfit-logo.png"
            alt="SnapFit Logo"
            className="h-7 sm:h-12 w-auto object-contain"
          />
          <div className="flex flex-col text-left">
            <span className="text-lg sm:text-2xl font-black text-[#087F5B] dark:text-emerald-400 leading-none">
              SnapFit
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
              AI Health Companion
            </span>
          </div>
        </Link>

        <h2 className="text-base sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Create Your Free Account
        </h2>
        <p className="text-[11px] sm:text-sm text-slate-500 dark:text-slate-400 hidden xs:block">
          Join SnapFit to track meals, optimize macros, and build healthy habits.
        </p>
      </div>

      {/* Form Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 my-auto sm:my-0 sm:mt-8">
        <div className="bg-white dark:bg-slate-900 py-3.5 px-4 sm:py-8 sm:px-10 shadow-2xl rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-2.5 sm:space-y-4">
          
          {serverError && (
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-[11px] sm:text-xs font-bold text-rose-600 dark:text-rose-400">
              {serverError}
            </div>
          )}

          <form className="space-y-2 sm:space-y-3.5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-0.5 sm:mb-1">
                Full Name
              </label>
              <div className="relative rounded-xl sm:rounded-2xl">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`block w-full pl-9 sm:pl-10 pr-3 py-1.5 sm:py-2.5 text-xs sm:text-sm rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 border ${
                    errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  } text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#087F5B]`}
                  placeholder="Rahul Sharma"
                />
              </div>
              {errors.name && <p className="mt-0.5 text-[10px] sm:text-xs text-rose-500">{errors.name}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-0.5 sm:mb-1">
                Email Address
              </label>
              <div className="relative rounded-xl sm:rounded-2xl">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-9 sm:pl-10 pr-3 py-1.5 sm:py-2.5 text-xs sm:text-sm rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 border ${
                    errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  } text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#087F5B]`}
                  placeholder="name@snapfit.ai"
                />
              </div>
              {errors.email && <p className="mt-0.5 text-[10px] sm:text-xs text-rose-500">{errors.email}</p>}
            </div>

            {/* Password & Confirm Password - Grid on mobile to save vertical space */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {/* Password */}
              <div>
                <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-0.5 sm:mb-1">
                  Password
                </label>
                <div className="relative rounded-xl sm:rounded-2xl">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-9 sm:pl-10 pr-3 py-1.5 sm:py-2.5 text-xs sm:text-sm rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 border ${
                      errors.password ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#087F5B]`}
                    placeholder="Min 6 chars"
                  />
                </div>
                {errors.password && <p className="mt-0.5 text-[10px] sm:text-xs text-rose-500">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-0.5 sm:mb-1">
                  Confirm
                </label>
                <div className="relative rounded-xl sm:rounded-2xl">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full pl-9 sm:pl-10 pr-3 py-1.5 sm:py-2.5 text-xs sm:text-sm rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 border ${
                      errors.confirmPassword ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#087F5B]`}
                    placeholder="Repeat password"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-0.5 text-[10px] sm:text-xs text-rose-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Additional Optional Setup Accordion */}
            <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowOptionalSetup(!showOptionalSetup)}
                className="w-full flex items-center justify-between py-1 text-[11px] sm:text-xs font-bold text-[#087F5B] dark:text-emerald-400 hover:underline"
              >
                <span>+ Additional Optional Setup (Biometrics & Goals)</span>
                {showOptionalSetup ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showOptionalSetup && (
                <div className="space-y-2 pt-1.5">
                  <div className="grid grid-cols-3 gap-1.5">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase">Age</label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border-none text-[11px] font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase">Height (cm)</label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border-none text-[11px] font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase">Weight (kg)</label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border-none text-[11px] font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Health Goal</label>
                    <select
                      value={healthGoal}
                      onChange={(e) => setHealthGoal(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border-none text-[11px] font-bold text-slate-900 dark:text-white"
                    >
                      {healthGoals.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl bg-[#087F5B] hover:bg-[#056B4A] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#087F5B]/25 transition-all flex items-center justify-center space-x-2 mt-1 sm:mt-2"
            >
              <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </form>

          <p className="text-center text-[11px] sm:text-xs text-slate-500 pt-0.5 sm:pt-2">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#087F5B] dark:text-emerald-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Spacer to balance viewport */}
      <div className="shrink-0 h-1 sm:h-4" />
    </div>
  );
};
