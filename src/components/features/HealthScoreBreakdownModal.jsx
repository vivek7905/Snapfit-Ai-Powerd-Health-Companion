import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Activity,
  Droplets,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight
} from 'lucide-react';
import { useHealth } from '../../hooks/useHealth';

export const HealthScoreBreakdownModal = ({ isOpen, onClose }) => {
  const { healthScoreDetails, totals, targets, waterGlasses, activityMinutes } = useHealth();

  if (!isOpen || !healthScoreDetails) return null;

  const { score, rating, badgeColor, ringHex, ratingDescription, actionableTip, breakdown } = healthScoreDetails;

  // Determine next milestone
  let nextMilestone = null;
  if (score < 50) {
    nextMilestone = { targetRating: 'Fair (50 pts)', pointsNeeded: 50 - score };
  } else if (score < 75) {
    nextMilestone = { targetRating: 'Good (75 pts)', pointsNeeded: 75 - score };
  } else if (score < 90) {
    nextMilestone = { targetRating: 'Excellent (90 pts)', pointsNeeded: 90 - score };
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#14213D] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header Banner */}
          <div className="relative p-6 bg-gradient-to-br from-emerald-500/10 via-[#087F5B]/10 to-transparent border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-[#087F5B] dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Nutrition Science Algorithm</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Health Score Analysis
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  How your daily food, hydration, and movement combine into your score
                </p>
              </div>

              {/* Score Display Badge */}
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-md">
                <span className="text-3xl font-black" style={{ color: ringHex }}>
                  {score}
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full mt-0.5 uppercase tracking-wider border ${badgeColor}`}>
                  {rating}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[68vh] overflow-y-auto">
            {/* Status Narrative & Next Milestone */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {ratingDescription}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    💡 <strong className="text-slate-700 dark:text-slate-200">Coach Tip:</strong> {actionableTip}
                  </p>
                </div>
              </div>

              {nextMilestone && (
                <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600 dark:text-slate-300">
                    Next Tier: <strong className="text-[#087F5B] dark:text-emerald-400">{nextMilestone.targetRating}</strong>
                  </span>
                  <span className="font-bold text-amber-500">
                    +{nextMilestone.pointsNeeded} pts needed
                  </span>
                </div>
              )}
            </div>

            {/* Granular Breakdown Categories */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Score Weighting Breakdown (100 pts total)
              </h4>

              <div className="space-y-3">
                {breakdown.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#087F5B]/30 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          ({item.current} / {item.target} {item.unit})
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          {item.status}
                        </span>
                        <span className="text-xs font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                          +{item.score} / {item.max}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Guidelines Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-800/40 border border-emerald-500/15 space-y-2 text-xs">
              <h5 className="font-extrabold text-[#087F5B] dark:text-emerald-400">
                Health Score Rating Tiers:
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] font-bold pt-1">
                <div className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 border border-rose-200/60 dark:border-rose-900/60">
                  <span>0 - 49</span>
                  <span className="block text-[9px] font-normal">Needs Impr.</span>
                </div>
                <div className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 border border-amber-200/60 dark:border-amber-900/60">
                  <span>50 - 74</span>
                  <span className="block text-[9px] font-normal">Fair</span>
                </div>
                <div className="p-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/30 text-teal-600 border border-teal-200/60 dark:border-teal-900/60">
                  <span>75 - 89</span>
                  <span className="block text-[9px] font-normal">Good</span>
                </div>
                <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border border-emerald-200/60 dark:border-emerald-900/60">
                  <span>90 - 100</span>
                  <span className="block text-[9px] font-normal">Excellent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-[#087F5B] hover:bg-[#056B4A] text-white text-xs font-black shadow-md shadow-[#087F5B]/20 transition-all"
            >
              Got it! Keep Tracking
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
