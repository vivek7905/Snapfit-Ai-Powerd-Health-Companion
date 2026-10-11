import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Clock,
  Moon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Onboarding = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();

  // Load any previously saved step or data if refreshing during onboarding
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem('snapfit_onboarding_step');
    return savedStep ? parseInt(savedStep, 10) : 1;
  });

  // Step 1: Profile State
  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem('profile');
    if (saved) {
      try { return JSON.parse(saved).role || 'Student'; } catch (e) {}
    }
    return 'Student';
  });

  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem('profile');
    if (saved) {
      try { return JSON.parse(saved).goal || 'Build Muscle'; } catch (e) {}
    }
    return 'Build Muscle';
  });

  const [gender, setGender] = useState(() => {
    const saved = localStorage.getItem('profile');
    if (saved) {
      try { return JSON.parse(saved).gender || 'Male'; } catch (e) {}
    }
    return 'Male';
  });

  // Step 2: Routine State
  const [collegeStartTime, setCollegeStartTime] = useState(() => {
    const saved = localStorage.getItem('routine');
    if (saved) {
      try { return JSON.parse(saved).collegeStartTime || '9:00 AM'; } catch (e) {}
    }
    return '9:00 AM';
  });

  const [collegeEndTime, setCollegeEndTime] = useState(() => {
    const saved = localStorage.getItem('routine');
    if (saved) {
      try { return JSON.parse(saved).collegeEndTime || '5:00 PM'; } catch (e) {}
    }
    return '5:00 PM';
  });

  const [studyWorkTime, setStudyWorkTime] = useState(() => {
    const saved = localStorage.getItem('routine');
    if (saved) {
      try { return JSON.parse(saved).studyWorkTime || '7:00 PM - 10:30 PM'; } catch (e) {}
    }
    return '7:00 PM - 10:30 PM';
  });

  const [sleepTime, setSleepTime] = useState(() => {
    const saved = localStorage.getItem('routine');
    if (saved) {
      try { return JSON.parse(saved).sleepTime || '11:30 PM'; } catch (e) {}
    }
    return '11:30 PM';
  });

  // Step 3: Typical Meal Times State
  const [breakfastTime, setBreakfastTime] = useState(() => {
    const saved = localStorage.getItem('mealTimes');
    if (saved) {
      try { return JSON.parse(saved).breakfast || '8:00 AM'; } catch (e) {}
    }
    return '8:00 AM';
  });

  const [lunchTime, setLunchTime] = useState(() => {
    const saved = localStorage.getItem('mealTimes');
    if (saved) {
      try { return JSON.parse(saved).lunch || '1:30 PM'; } catch (e) {}
    }
    return '1:30 PM';
  });

  const [eveningSnackTime, setEveningSnackTime] = useState(() => {
    const saved = localStorage.getItem('mealTimes');
    if (saved) {
      try { return JSON.parse(saved).eveningSnack || '5:30 PM'; } catch (e) {}
    }
    return '5:30 PM';
  });

  const [dinnerTime, setDinnerTime] = useState(() => {
    const saved = localStorage.getItem('mealTimes');
    if (saved) {
      try { return JSON.parse(saved).dinner || '8:30 PM'; } catch (e) {}
    }
    return '8:30 PM';
  });

  // Step 4: Activity Level State (Default: Moderate)
  const [activityLevel, setActivityLevel] = useState(() => {
    const saved = localStorage.getItem('activityLevel');
    if (saved) {
      try { return JSON.parse(saved).level || 'Moderate'; } catch (e) {}
    }
    return 'Moderate';
  });

  // Save current step to localStorage for session continuity
  useEffect(() => {
    localStorage.setItem('snapfit_onboarding_step', currentStep.toString());
  }, [currentStep]);

  const goalOptions = [
    'Build Muscle',
    'Lose Weight',
    'Maintain Weight',
    'Improve Fitness',
    'Healthy Lifestyle'
  ];

  const genderOptions = ['Male', 'Female', 'Other'];

  const activityOptions = [
    {
      id: 'Sedentary',
      title: 'Sedentary',
      description: 'Little or no exercise',
      icon: '🚶'
    },
    {
      id: 'Light',
      title: 'Light',
      description: '1–3 days / week',
      icon: '🚶'
    },
    {
      id: 'Moderate',
      title: 'Moderate',
      description: '3–5 days / week',
      icon: '🏃'
    },
    {
      id: 'Active',
      title: 'Active',
      description: '6–7 days / week',
      icon: '🏃'
    }
  ];

  // Progress percentage calculation
  const progressPct = currentStep === 1 ? 25 : currentStep === 2 ? 50 : currentStep === 3 ? 75 : 100;

  const handleNextStep = () => {
    if (currentStep === 1) {
      const profileData = { role, goal, gender };
      localStorage.setItem('profile', JSON.stringify(profileData));
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const routineData = {
        collegeStartTime,
        collegeEndTime,
        studyWorkTime,
        sleepTime
      };
      localStorage.setItem('routine', JSON.stringify(routineData));
      setCurrentStep(3);
    } else if (currentStep === 3) {
      const mealTimesData = {
        breakfast: breakfastTime,
        lunch: lunchTime,
        eveningSnack: eveningSnackTime,
        dinner: dinnerTime
      };
      localStorage.setItem('mealTimes', JSON.stringify(mealTimesData));
      setCurrentStep(4);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = () => {
    const profileData = { role, goal, gender };
    const routineData = {
      collegeStartTime,
      collegeEndTime,
      studyWorkTime,
      sleepTime
    };
    const mealTimesData = {
      breakfast: breakfastTime,
      lunch: lunchTime,
      eveningSnack: eveningSnackTime,
      dinner: dinnerTime
    };
    const activityLevelData = {
      level: activityLevel,
      description: activityOptions.find((a) => a.id === activityLevel)?.description || '3–5 days / week'
    };

    // Save all to localStorage and context state
    completeOnboarding({
      profile: profileData,
      routine: routineData,
      mealTimes: mealTimesData,
      activityLevel: activityLevelData
    });

    // Remove temporary step bookmark
    localStorage.removeItem('snapfit_onboarding_step');

    // CRITICAL: Open existing dashboard
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] sm:min-h-screen sm:h-auto sm:max-h-none bg-slate-50 dark:bg-[#14213D] flex flex-col justify-between py-2 px-3.5 sm:py-6 sm:px-6 lg:px-8 relative overflow-hidden sm:overflow-auto transition-colors selection:bg-[#087F5B] selection:text-white safe-area-pt safe-area-pb">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#087F5B]/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Top Header with Logo */}
      <div className="max-w-xl mx-auto w-full z-10 flex items-center justify-between shrink-0">
        <Link to="/" className="inline-flex items-center space-x-2 sm:space-x-2.5">
          <img
            src="/snapfit-logo.png"
            alt="SnapFit Logo"
            className="h-7 sm:h-9 w-auto object-contain"
          />
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black text-[#087F5B] dark:text-emerald-400 leading-none">
              SnapFit
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-400 tracking-wider">
              Setup Wizard
            </span>
          </div>
        </Link>

        <span className="text-[11px] sm:text-xs font-black text-[#087F5B] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#087F5B]/20">
          Step {currentStep} of 4
        </span>
      </div>

      {/* Main Container */}
      <div className="max-w-xl mx-auto w-full z-10 my-auto py-1 sm:py-4">
        {/* Progress Bar Container */}
        <div className="mb-2 sm:mb-6 space-y-1">
          <div className="flex justify-between items-center text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Profile Setup</span>
            <span className="text-[#087F5B] dark:text-emerald-400 font-black">{progressPct}%</span>
          </div>
          <div className="h-2 sm:h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-[#087F5B] rounded-full shadow-sm"
              initial={{ width: `${progressPct}%` }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Dynamic Step Content Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800 relative">
          <AnimatePresence mode="wait">
            {/* ========================================================================= */}
            {/* STEP 1: LET'S SET UP YOUR PROFILE (25%)                                   */}
            {/* ========================================================================= */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-2.5 sm:space-y-5"
              >
                <div>
                  <h2 className="text-base sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    Let's set up your profile
                  </h2>
                  <p className="text-[11px] sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 hidden xs:block">
                    Tell us about yourself to personalize your nutrition recommendations.
                  </p>
                </div>

                {/* Section 1: "I am a" */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    I am a
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {/* Student Option */}
                    <button
                      type="button"
                      onClick={() => setRole('Student')}
                      className={`relative flex items-center justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 text-left transition-all ${
                        role === 'Student'
                          ? 'border-[#087F5B] bg-[#EFFAF5] dark:bg-emerald-950/40 text-[#087F5B] dark:text-emerald-300 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="text-lg sm:text-2xl">🎓</span>
                        <span className="text-xs sm:text-sm font-bold">Student</span>
                      </div>
                      {role === 'Student' && (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#087F5B] flex items-center justify-center text-white shrink-0">
                          <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>

                    {/* Working Professional Option */}
                    <button
                      type="button"
                      onClick={() => setRole('Working Professional')}
                      className={`relative flex items-center justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 text-left transition-all ${
                        role === 'Working Professional'
                          ? 'border-[#087F5B] bg-[#EFFAF5] dark:bg-emerald-950/40 text-[#087F5B] dark:text-emerald-300 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="text-lg sm:text-2xl">💼</span>
                        <span className="text-xs sm:text-sm font-bold leading-tight">Professional</span>
                      </div>
                      {role === 'Working Professional' && (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#087F5B] flex items-center justify-center text-white shrink-0">
                          <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Section 2: "Your Goal" Dropdown */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Your Goal
                  </label>
                  <div className="relative">
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-[#087F5B] focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none transition-all cursor-pointer"
                    >
                      {goalOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Section 3: "Gender" */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Gender
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {genderOptions.map((g) => {
                      const isSelected = gender === g;
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`relative flex items-center justify-between p-2 sm:p-3 rounded-xl sm:rounded-2xl border-2 transition-all ${
                            isSelected
                              ? 'border-[#087F5B] bg-[#EFFAF5] dark:bg-emerald-950/40 text-[#087F5B] dark:text-emerald-300 font-extrabold shadow-sm'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-bold'
                          }`}
                        >
                          <span className="text-xs sm:text-sm">{g}</span>
                          {isSelected && (
                            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#087F5B] flex items-center justify-center text-white shrink-0">
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-1 sm:pt-3">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full py-2.5 sm:py-3.5 px-6 rounded-xl sm:rounded-2xl bg-[#087F5B] hover:bg-[#056B4A] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#087F5B]/25 hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* STEP 2: TELL US ABOUT YOUR ROUTINE (50%)                                  */}
            {/* ========================================================================= */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-2.5 sm:space-y-5"
              >
                <div>
                  <h2 className="text-base sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    Tell us about your routine
                  </h2>
                  <p className="text-[11px] sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 hidden xs:block">
                    Align nutrition reminders and energy windows with your daily schedule.
                  </p>
                </div>

                {/* 2-column on mobile & desktop to keep compact height */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3.5">
                  {/* College Start Time */}
                  <div>
                    <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-0.5 sm:mb-1 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#087F5B]" />
                      <span>Start Time</span>
                    </label>
                    <input
                      type="text"
                      value={collegeStartTime}
                      onChange={(e) => setCollegeStartTime(e.target.value)}
                      placeholder="9:00 AM"
                      className="w-full px-3 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-[#087F5B] focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none transition-all"
                    />
                  </div>

                  {/* College End Time */}
                  <div>
                    <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-0.5 sm:mb-1 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#087F5B]" />
                      <span>End Time</span>
                    </label>
                    <input
                      type="text"
                      value={collegeEndTime}
                      onChange={(e) => setCollegeEndTime(e.target.value)}
                      placeholder="5:00 PM"
                      className="w-full px-3 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-[#087F5B] focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none transition-all"
                    />
                  </div>

                  {/* Study / Work Time */}
                  <div>
                    <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-0.5 sm:mb-1 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#087F5B]" />
                      <span>Study/Work Time</span>
                    </label>
                    <input
                      type="text"
                      value={studyWorkTime}
                      onChange={(e) => setStudyWorkTime(e.target.value)}
                      placeholder="7:00 PM - 10:30 PM"
                      className="w-full px-3 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-[#087F5B] focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none transition-all"
                    />
                  </div>

                  {/* Sleep Time */}
                  <div>
                    <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-0.5 sm:mb-1 flex items-center space-x-1">
                      <Moon className="w-3 h-3 text-indigo-500" />
                      <span>Sleep Time</span>
                    </label>
                    <input
                      type="text"
                      value={sleepTime}
                      onChange={(e) => setSleepTime(e.target.value)}
                      placeholder="11:30 PM"
                      className="w-full px-3 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-[#087F5B] focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="pt-1 sm:pt-3 flex items-center space-x-2.5 sm:space-x-3">
                  <button
                    type="button"
                    onClick={handleBackStep}
                    className="flex-1 py-2.5 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 py-2.5 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl bg-[#087F5B] hover:bg-[#056B4A] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#087F5B]/25 hover:shadow-xl transition-all flex items-center justify-center space-x-1"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* STEP 3: YOUR TYPICAL MEAL TIMES (75%)                                     */}
            {/* ========================================================================= */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-2.5 sm:space-y-5"
              >
                <div>
                  <h2 className="text-base sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    Your typical meal times
                  </h2>
                  <p className="text-[11px] sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 hidden xs:block">
                    Set your preferred meal hours. All times are customizable.
                  </p>
                </div>

                {/* Meal Time Cards Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3.5">
                  {/* Breakfast Card */}
                  <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border-2 border-amber-200/80 dark:border-amber-800/40 space-y-1 sm:space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-base sm:text-xl">☀️</span>
                        <span className="text-[10px] sm:text-xs font-black uppercase text-amber-900 dark:text-amber-300">
                          Breakfast
                        </span>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={breakfastTime}
                      onChange={(e) => setBreakfastTime(e.target.value)}
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700/60 text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Lunch Card */}
                  <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border-2 border-emerald-200/80 dark:border-emerald-800/40 space-y-1 sm:space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-base sm:text-xl">☀️</span>
                        <span className="text-[10px] sm:text-xs font-black uppercase text-emerald-900 dark:text-emerald-300">
                          Lunch
                        </span>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={lunchTime}
                      onChange={(e) => setLunchTime(e.target.value)}
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-700/60 text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                    />
                  </div>

                  {/* Evening Snack Card */}
                  <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-orange-50/60 dark:bg-orange-950/20 border-2 border-orange-200/80 dark:border-orange-800/40 space-y-1 sm:space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-base sm:text-xl">🌅</span>
                        <span className="text-[10px] sm:text-xs font-black uppercase text-orange-900 dark:text-orange-300">
                          Snack
                        </span>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={eveningSnackTime}
                      onChange={(e) => setEveningSnackTime(e.target.value)}
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-700/60 text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Dinner Card */}
                  <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border-2 border-indigo-200/80 dark:border-indigo-800/40 space-y-1 sm:space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-base sm:text-xl">🌙</span>
                        <span className="text-[10px] sm:text-xs font-black uppercase text-indigo-900 dark:text-indigo-300">
                          Dinner
                        </span>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={dinnerTime}
                      onChange={(e) => setDinnerTime(e.target.value)}
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700/60 text-slate-900 dark:text-white font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="pt-1 sm:pt-3 flex items-center space-x-2.5 sm:space-x-3">
                  <button
                    type="button"
                    onClick={handleBackStep}
                    className="flex-1 py-2.5 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 py-2.5 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl bg-[#087F5B] hover:bg-[#056B4A] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#087F5B]/25 hover:shadow-xl transition-all flex items-center justify-center space-x-1"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* STEP 4: YOUR ACTIVITY LEVEL (100%)                                        */}
            {/* ========================================================================= */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-2 sm:space-y-4"
              >
                <div>
                  <h2 className="text-base sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    Your Activity Level
                  </h2>
                  <p className="text-[11px] sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 hidden xs:block">
                    Select how active you are to calibrate calorie burn calculations.
                  </p>
                </div>

                {/* Activity Level Cards */}
                <div className="space-y-1.5 sm:space-y-2.5">
                  {activityOptions.map((opt) => {
                    const isSelected = activityLevel === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setActivityLevel(opt.id)}
                        className={`w-full flex items-center justify-between p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-[#087F5B] bg-[#EFFAF5] dark:bg-emerald-950/40 shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 sm:space-x-3.5">
                          <span className="text-lg sm:text-2xl">{opt.icon}</span>
                          <div>
                            <p
                              className={`text-xs sm:text-sm font-black ${
                                isSelected
                                  ? 'text-[#087F5B] dark:text-emerald-300'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {opt.title}
                            </p>
                            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">
                              {opt.description}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#087F5B] flex items-center justify-center text-white shrink-0">
                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Controls */}
                <div className="pt-1 sm:pt-2 flex items-center space-x-2.5 sm:space-x-3">
                  <button
                    type="button"
                    onClick={handleBackStep}
                    className="flex-1 py-2.5 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="flex-1 py-2.5 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl bg-[#087F5B] hover:bg-[#056B4A] text-white font-black text-xs sm:text-sm shadow-xl shadow-[#087F5B]/30 hover:scale-[1.02] transition-all flex items-center justify-center space-x-1"
                  >
                    <span>Get Started</span>
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="max-w-xl mx-auto w-full z-10 text-center shrink-0">
        <p className="text-[10px] sm:text-[11px] text-slate-400">
          SnapFit AI • You can update routine and meal settings anytime from Settings.
        </p>
      </div>
    </div>
  );
};
