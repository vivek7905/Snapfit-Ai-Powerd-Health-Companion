import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  Info,
  Flame,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useHealth } from '../../hooks/useHealth';
import { HealthScoreBreakdownModal } from './HealthScoreBreakdownModal';

export const HealthScoreWidget = ({ className = '', compact = false }) => {
  const { healthScoreDetails } = useHealth();
  const [showModal, setShowModal] = useState(false);

  if (!healthScoreDetails) return null;

  const {
    score,
    rating,
    badgeColor,
    ringColor,
    ringHex,
    ratingDescription,
    actionableTip,
    breakdown
  } = healthScoreDetails;

  // SVG Progress Ring calculations
  const size = compact ? 100 : 130;
  const strokeWidth = compact ? 9 : 11;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  // Icon corresponding to rating
  const getRatingIcon = () => {
    if (score >= 90) return <Sparkles className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />;
    if (score >= 75) return <Award className="w-3.5 h-3.5 text-teal-500" />;
    if (score >= 50) return <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />;
    return <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
  };

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-3xl bg-white dark:bg-[#14213D] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all ${className}`}
      >
        {/* Soft Ambient Radial Glow */}
        <div
          className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl opacity-15 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: ringHex }}
        />

        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#087F5B] dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                Daily Health Score
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Nutrition & Vitality Index
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="text-[11px] font-bold text-[#087F5B] dark:text-emerald-400 hover:underline flex items-center space-x-1"
          >
            <span>Breakdown</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Score Area */}
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
          {/* Animated Visual Progress Ring */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background Ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                className="text-slate-100 dark:text-slate-800/80 fill-none"
              />

              {/* Dynamic Colored Animated Progress Ring */}
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                strokeLinecap="round"
                stroke={ringHex}
                className="fill-none drop-shadow-sm transition-all duration-500"
              />
            </svg>

            {/* Centered Score & Rating Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={score}
                className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tight"
              >
                {score}
              </motion.span>
              <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                / 100
              </span>
            </div>
          </div>

          {/* Right Side: Rating Badge & Status Information */}
          <div className="flex-1 text-center sm:text-left space-y-2 min-w-0 w-full">
            {/* Dynamic Status Rating Badge */}
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-black uppercase tracking-wider shadow-sm transition-all duration-300"
              style={{ borderColor: `${ringHex}33` }}
            >
              {getRatingIcon()}
              <span className={badgeColor.split(' ')[0]}>
                {rating}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              {ratingDescription}
            </p>

            {/* Actionable Coach Tip */}
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300 flex items-start space-x-2">
              <span className="text-amber-500 shrink-0 font-bold">💡</span>
              <span className="font-semibold leading-tight line-clamp-2">
                {actionableTip}
              </span>
            </div>
          </div>
        </div>

        {/* Micro-Metrics Quick Bar (Calories, Protein, Water) */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-center">
          {breakdown.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-2 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
            >
              <span className="text-[10px] text-slate-400 font-bold block uppercase truncate">
                {item.name}
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white mt-0.5 block">
                {item.current} <span className="text-[10px] font-normal text-slate-400">{item.unit}</span>
              </span>
              <span className="text-[9px] font-extrabold text-[#087F5B] dark:text-emerald-400">
                +{item.score} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Full Detailed Breakdown Modal */}
      <HealthScoreBreakdownModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};
