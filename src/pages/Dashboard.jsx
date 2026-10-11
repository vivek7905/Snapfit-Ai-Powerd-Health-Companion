import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Zap,
  Droplets,
  Activity,
  Plus,
  ArrowRight,
  Sparkles,
  Moon,
  Clock,
  Eye,
  Utensils,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useHealth } from '../hooks/useHealth';
import { ProgressRing } from '../components/ui/ProgressRing';
import { AICoachWidget } from '../components/features/AICoachWidget';
import { HealthScoreWidget } from '../components/features/HealthScoreWidget';
import { MealDetailModal } from '../components/features/MealDetailModal';
import { AddMealModal } from '../components/features/AddMealModal';
import { SuggestionsModal } from '../components/features/SuggestionsModal';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    meals,
    totals,
    targets,
    waterGlasses,
    updateWaterGlasses,
    activityMinutes,
    updateActivityMinutes,
    streakDays,
    fitPoints
  } = useHealth();

  // Selected meal for detail view modal
  const [selectedMealForView, setSelectedMealForView] = useState(null);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [addMealDefaultCategory, setAddMealDefaultCategory] = useState('Dinner');
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);

  // Next Best Move Carousel State
  const [activeSlide, setActiveSlide] = useState(0);

  const recommendations = [
    {
      id: 1,
      badge: "Your Next Best Move",
      message: "Your protein is low today.\nTry a protein-rich snack before your study session.",
      subtext: "Current: 42g / 80g target • 38g remaining for peak recovery",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
      actionText: "View Suggestions →"
    },
    {
      id: 2,
      badge: "Hydration Milestone",
      message: "You're at 6 of 8 glasses of water.\nDrink one more glass after your evening walk.",
      subtext: "Proper hydration improves cognitive performance by up to 14%",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
      actionText: "Log Water (+1 Glass) →"
    },
    {
      id: 3,
      badge: "AI Evening Nutrition Strategy",
      message: "Dinner recommendation: Balanced high-protein, moderate carbs with fiber.",
      subtext: "Paneer, grilled chicken, or dal with quinoa will hit your exact daily goal",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
      actionText: "Explore Meal Ideas →"
    }
  ];

  // Auto cycle recommendation slides every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % recommendations.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [recommendations.length]);

  // Derived progress calculations
  const calorieVal = totals.calories || 1350;
  const calorieMax = targets.dailyCalories || 2000;
  const caloriePct = Math.round((calorieVal / calorieMax) * 100);

  const proteinVal = totals.protein || 42;
  const proteinMax = targets.proteinGrams || 80;
  const proteinPct = Math.round((proteinVal / proteinMax) * 100);

  const waterVal = waterGlasses || 6;
  const waterMax = targets.waterGlasses || 8;
  const waterPct = Math.round((waterVal / waterMax) * 100);

  const activityVal = activityMinutes || 30;
  const activityMax = targets.activityMinutes || 60;
  const activityPct = Math.round((activityVal / activityMax) * 100);

  // Today's Meals items mapping
  const breakfastMeal = meals.find(m => m.type.toLowerCase() === 'breakfast') || {
    id: 'm-1',
    name: 'Oats with Fruits and Nuts',
    type: 'Breakfast',
    calories: 320,
    protein: 14,
    carbs: 52,
    fat: 8,
    time: '8:30 AM',
    icon: '☀️',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80'
  };

  const lunchMeal = meals.find(m => m.type.toLowerCase() === 'lunch') || {
    id: 'm-2',
    name: 'Dal, Rice, Salad',
    type: 'Lunch',
    calories: 560,
    protein: 20,
    carbs: 88,
    fat: 12,
    time: '1:30 PM',
    icon: '☀️',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'
  };

  const eveningSnackMeal = meals.find(m => m.type.toLowerCase().includes('snack')) || {
    id: 'm-4',
    name: 'Banana Shake',
    type: 'Evening Snack',
    calories: 180,
    protein: 8,
    carbs: 32,
    fat: 3,
    time: '5:45 PM',
    icon: '🌅',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=80'
  };

  const dinnerMeal = meals.find(m => m.type.toLowerCase() === 'dinner');

  const handleOpenLogDinner = () => {
    setAddMealDefaultCategory('Dinner');
    setShowAddMealModal(true);
  };

  const handleHeroActionClick = () => {
    if (activeSlide === 0) {
      setShowSuggestionsModal(true);
    } else if (activeSlide === 1) {
      updateWaterGlasses(1);
    } else {
      setAddMealDefaultCategory('Dinner');
      setShowAddMealModal(true);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 2-Column Responsive Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT / MAIN COLUMN (7 cols on LG, 8 on XL) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">

          {/* Top Greeting Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Hi Everyone 👋
              </h2>
              <p className="text-sm font-semibold text-[#087F5B] dark:text-emerald-400 mt-0.5">
                Let's make today a healthy day!
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/snap-share')}
                className="px-3.5 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md shadow-amber-400/20 transition-all flex items-center space-x-1.5 hover:scale-105"
              >
                <Flame className="w-3.5 h-3.5 fill-slate-950" />
                <span>Snap & Share 🔥</span>
              </button>
              <button
                onClick={() => navigate('/snap-food')}
                className="px-3.5 py-2 rounded-2xl bg-[#087F5B] hover:bg-[#056B4A] text-white text-xs font-bold shadow-md shadow-[#087F5B]/20 transition-all flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Scanner</span>
              </button>
            </div>
          </div>

          {/* LARGE GREEN RECOMMENDATION CARD: "Your Next Best Move" */}
          <div className="relative rounded-3xl bg-gradient-to-r from-[#087F5B] via-[#077252] to-[#056B4A] text-white p-6 sm:p-7 shadow-xl shadow-[#087F5B]/15 overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute left-1/3 top-0 w-48 h-48 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left Content */}
              <div className="space-y-3.5 max-w-md text-left w-full">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider text-emerald-100">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>{recommendations[activeSlide].badge}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug whitespace-pre-line">
                  {recommendations[activeSlide].message}
                </h3>

                <p className="text-xs text-emerald-100/90 font-medium">
                  {recommendations[activeSlide].subtext}
                </p>

                <div className="pt-1 flex items-center space-x-3">
                  <button
                    onClick={handleHeroActionClick}
                    className="px-5 py-2.5 rounded-full bg-white hover:bg-emerald-50 text-[#087F5B] font-extrabold text-xs shadow-lg transition-all hover:scale-[1.02] flex items-center space-x-1.5"
                  >
                    <span>{recommendations[activeSlide].actionText}</span>
                  </button>

                  {/* Manual Arrow Controls */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setActiveSlide((prev) => (prev - 1 + recommendations.length) % recommendations.length)}
                      className="p-1.5 rounded-full bg-black/15 hover:bg-black/25 text-white transition-colors"
                      title="Previous"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveSlide((prev) => (prev + 1) % recommendations.length)}
                      className="p-1.5 rounded-full bg-black/15 hover:bg-black/25 text-white transition-colors"
                      title="Next"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Image Feature */}
              <div className="relative shrink-0 w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                <img
                  src={recommendations[activeSlide].image}
                  alt="Healthy Recommendation"
                  className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
                  AI Picked
                </span>
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="relative z-10 flex items-center justify-center space-x-2 pt-5">
              {recommendations.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeSlide === idx
                      ? 'w-6 bg-white shadow-sm'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* TODAY'S SUMMARY CARD */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#14213D] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Today's Summary
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time macro balance & hydration tracking
                </p>
              </div>

              <button
                onClick={() => navigate('/progress')}
                className="text-xs font-bold text-[#087F5B] dark:text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <span>See Details</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            {/* 4 Circular Progress Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              
              {/* 1. Calories Circle (Amber / Orange Accent) */}
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-amber-50/50 dark:bg-slate-800/40 border border-amber-500/15">
                <ProgressRing
                  progress={caloriePct}
                  size={100}
                  strokeWidth={9}
                  progressColor="stroke-amber-500"
                  circleColor="text-amber-100 dark:text-slate-700"
                >
                  <span className="text-base font-black text-slate-900 dark:text-white leading-none">
                    {calorieVal}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                    / {calorieMax}
                  </span>
                </ProgressRing>
                <div className="mt-3">
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 block">
                    Calories
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    kcal
                  </span>
                </div>
              </div>

              {/* 2. Protein Circle (Emerald Green Accent) */}
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-emerald-50/50 dark:bg-slate-800/40 border border-[#087F5B]/15">
                <ProgressRing
                  progress={proteinPct}
                  size={100}
                  strokeWidth={9}
                  progressColor="stroke-[#087F5B]"
                  circleColor="text-emerald-100 dark:text-slate-700"
                >
                  <span className="text-base font-black text-slate-900 dark:text-white leading-none">
                    {proteinVal} g
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                    / {proteinMax} g
                  </span>
                </ProgressRing>
                <div className="mt-3">
                  <span className="text-xs font-black text-[#087F5B] dark:text-emerald-400 block">
                    Protein
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Target 80g
                  </span>
                </div>
              </div>

              {/* 3. Water Circle (Sky / Cyan Accent) */}
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-sky-50/50 dark:bg-slate-800/40 border border-sky-500/15">
                <ProgressRing
                  progress={waterPct}
                  size={100}
                  strokeWidth={9}
                  progressColor="stroke-sky-500"
                  circleColor="text-sky-100 dark:text-slate-700"
                >
                  <span className="text-base font-black text-slate-900 dark:text-white leading-none">
                    {waterVal}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                    / {waterMax}
                  </span>
                </ProgressRing>
                <div className="mt-3 flex flex-col items-center">
                  <span className="text-xs font-black text-sky-600 dark:text-sky-400 block">
                    Water
                  </span>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className="text-[11px] text-slate-500 font-semibold">
                      glasses
                    </span>
                    <button
                      onClick={() => updateWaterGlasses(1)}
                      className="text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-950 px-1 rounded hover:bg-sky-200"
                      title="Add 1 glass"
                    >
                      +1
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Activity Circle (Purple / Violet Accent) */}
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-purple-50/50 dark:bg-slate-800/40 border border-purple-500/15">
                <ProgressRing
                  progress={activityPct}
                  size={100}
                  strokeWidth={9}
                  progressColor="stroke-purple-500"
                  circleColor="text-purple-100 dark:text-slate-700"
                >
                  <span className="text-base font-black text-slate-900 dark:text-white leading-none">
                    {activityVal}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                    / {activityMax}
                  </span>
                </ProgressRing>
                <div className="mt-3 flex flex-col items-center">
                  <span className="text-xs font-black text-purple-600 dark:text-purple-400 block">
                    Activity
                  </span>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className="text-[11px] text-slate-500 font-semibold">
                      min
                    </span>
                    <button
                      onClick={() => updateActivityMinutes(15)}
                      className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-1 rounded hover:bg-purple-200"
                      title="Add 15 min"
                    >
                      +15m
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* TODAY'S MEALS SECTION */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#14213D] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            {/* Header with Add Meal + */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Today's Meals
                </h3>
                <p className="text-xs text-slate-400">
                  Track schedule and logged calorie density
                </p>
              </div>

              <button
                onClick={() => {
                  setAddMealDefaultCategory('Lunch');
                  setShowAddMealModal(true);
                }}
                className="px-3.5 py-2 rounded-2xl bg-[#087F5B] hover:bg-[#056B55] text-white text-xs font-extrabold shadow-md shadow-[#087F5B]/20 transition-all flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Meal +</span>
              </button>
            </div>

            {/* 4 MEAL CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* 1. BREAKFAST CARD */}
              <div className="p-4 rounded-2xl bg-[#EFFAF5]/60 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between space-x-3 hover:shadow-md transition-all">
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={breakfastMeal.image}
                    alt={breakfastMeal.name}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200/60 dark:border-slate-700 shadow-sm"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1 text-[11px] font-bold text-amber-500 uppercase">
                      <span>☀️</span>
                      <span>BREAKFAST • {breakfastMeal.time || '8:30 AM'}</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                      {breakfastMeal.name}
                    </h4>
                    <span className="text-xs font-black text-slate-500 dark:text-slate-300">
                      {breakfastMeal.calories} kcal
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMealForView(breakfastMeal)}
                  className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-[#087F5B] hover:text-white text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 font-bold text-xs shadow-sm transition-all shrink-0"
                >
                  View
                </button>
              </div>

              {/* 2. LUNCH CARD */}
              <div className="p-4 rounded-2xl bg-[#EFFAF5]/60 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between space-x-3 hover:shadow-md transition-all">
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={lunchMeal.image}
                    alt={lunchMeal.name}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200/60 dark:border-slate-700 shadow-sm"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1 text-[11px] font-bold text-amber-500 uppercase">
                      <span>☀️</span>
                      <span>LUNCH • {lunchMeal.time || '1:30 PM'}</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                      {lunchMeal.name}
                    </h4>
                    <span className="text-xs font-black text-slate-500 dark:text-slate-300">
                      {lunchMeal.calories} kcal
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMealForView(lunchMeal)}
                  className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-[#087F5B] hover:text-white text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 font-bold text-xs shadow-sm transition-all shrink-0"
                >
                  View
                </button>
              </div>

              {/* 3. EVENING SNACK CARD */}
              <div className="p-4 rounded-2xl bg-[#EFFAF5]/60 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between space-x-3 hover:shadow-md transition-all">
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={eveningSnackMeal.image}
                    alt={eveningSnackMeal.name}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200/60 dark:border-slate-700 shadow-sm"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1 text-[11px] font-bold text-orange-500 uppercase">
                      <span>🌅</span>
                      <span>EVENING SNACK • {eveningSnackMeal.time || '5:45 PM'}</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                      {eveningSnackMeal.name}
                    </h4>
                    <span className="text-xs font-black text-slate-500 dark:text-slate-300">
                      {eveningSnackMeal.calories} kcal
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMealForView(eveningSnackMeal)}
                  className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-[#087F5B] hover:text-white text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 font-bold text-xs shadow-sm transition-all shrink-0"
                >
                  View
                </button>
              </div>

              {/* 4. DINNER CARD */}
              {dinnerMeal ? (
                <div className="p-4 rounded-2xl bg-[#EFFAF5]/60 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between space-x-3 hover:shadow-md transition-all">
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={dinnerMeal.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"}
                      alt={dinnerMeal.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200/60 dark:border-slate-700 shadow-sm"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1 text-[11px] font-bold text-indigo-500 uppercase">
                        <span>🌙</span>
                        <span>DINNER • {dinnerMeal.time || '8:30 PM'}</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                        {dinnerMeal.name}
                      </h4>
                      <span className="text-xs font-black text-slate-500 dark:text-slate-300">
                        {dinnerMeal.calories} kcal
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedMealForView(dinnerMeal)}
                    className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-[#087F5B] hover:text-white text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 font-bold text-xs shadow-sm transition-all shrink-0"
                  >
                    View
                  </button>
                </div>
              ) : (
                /* No Dinner Logged Yet - Empty Illustration */
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between space-x-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex flex-col items-center justify-center shrink-0 border border-indigo-200/60 dark:border-indigo-800/60">
                      <Moon className="w-6 h-6 stroke-[1.8]" />
                      <span className="text-[8px] font-black uppercase mt-0.5">DINNER</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-1 text-[11px] font-bold text-indigo-500 uppercase">
                        <span>🌙</span>
                        <span>DINNER</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                        No dinner logged yet
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Target remaining: ~650 kcal
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleOpenLogDinner}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all shrink-0 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Dinner</span>
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: HEALTH SCORE & AI COACH WIDGETS (5 cols on LG, 4 on XL) */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-6">
          <HealthScoreWidget />
          <AICoachWidget />
        </div>

      </div>

      {/* Reusable Modals */}
      <MealDetailModal
        isOpen={Boolean(selectedMealForView)}
        onClose={() => setSelectedMealForView(null)}
        meal={selectedMealForView}
      />

      <AddMealModal
        isOpen={showAddMealModal}
        onClose={() => setShowAddMealModal(false)}
        defaultType={addMealDefaultCategory}
      />

      <SuggestionsModal
        isOpen={showSuggestionsModal}
        onClose={() => setShowSuggestionsModal(false)}
      />
    </div>
  );
};
