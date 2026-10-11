import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Flame,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Send
} from 'lucide-react';
import { useHealth } from '../../hooks/useHealth';

export const SnapStoryViewer = ({ isOpen, onClose, initialStoryIndex = 0, stories = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { showToast } = useHealth();

  useEffect(() => {
    setCurrentIndex(initialStoryIndex);
    setProgress(0);
  }, [initialStoryIndex, isOpen]);

  // Auto advance timer
  useEffect(() => {
    if (!isOpen || isPaused || stories.length === 0) return;

    const interval = 50; // update every 50ms
    const step = (interval / 5000) * 100; // 5000ms total duration

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((idx) => idx + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, isPaused, currentIndex, stories.length, onClose]);

  if (!isOpen || stories.length === 0) return null;

  const currentStory = stories[currentIndex];

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((idx) => idx + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
      setProgress(0);
    }
  };

  const handleSendFlameReaction = () => {
    showToast(`Sent 🔥 reaction to ${currentStory.friendName || 'Story'}!`, 'success');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-lg">
        {/* Story Phone Mockup Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm aspect-[9/16] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-between"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Background Story Image */}
          <img
            src={currentStory.image}
            alt={currentStory.foodName || 'Food Snap Story'}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradient Overlays for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none" />

          {/* TOP CONTROLS & TIMERS */}
          <div className="relative z-20 p-4 space-y-3">
            {/* Segmented Progress Bars */}
            <div className="flex items-center gap-1.5 w-full">
              {stories.map((_, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden"
                >
                  <div
                    className="h-full bg-white rounded-full transition-all duration-75"
                    style={{
                      width:
                        idx < currentIndex
                          ? '100%'
                          : idx === currentIndex
                          ? `${progress}%`
                          : '0%'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Friend Info & Close */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2.5">
                <img
                  src={currentStory.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                  alt={currentStory.friendName || 'User'}
                  className="w-9 h-9 rounded-full object-cover border-2 border-emerald-400 shadow-md"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-black drop-shadow">
                      {currentStory.friendName || 'Priya Patel'}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-black/40 px-1.5 py-0.5 rounded-full flex items-center">
                      <Flame className="w-2.5 h-2.5 fill-emerald-400 mr-0.5" />
                      {currentStory.streak || 18}d
                    </span>
                  </div>
                  <span className="text-[10px] text-white/75 font-medium block">
                    {currentStory.time || '2h ago'}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TAP NAVIGATION HIT AREAS */}
          <div className="absolute inset-y-20 left-0 w-1/3 z-10 cursor-pointer" onClick={handlePrev} />
          <div className="absolute inset-y-20 right-0 w-1/3 z-10 cursor-pointer" onClick={handleNext} />

          {/* CENTER STICKER OVERLAYS (SNAPCHAT STYLE) */}
          <div className="relative z-20 px-4 space-y-3 pointer-events-none mb-4">
            {/* Health Score Pill */}
            {currentStory.healthScore && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-emerald-400/40 text-white shadow-xl"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black text-emerald-300">
                  ⚡ Health Score {currentStory.healthScore}/100
                </span>
                <span className="text-[10px] text-white/80 font-bold">
                  • Excellent 🥗
                </span>
              </motion.div>
            )}

            {/* Macro Tags Pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-black/65 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 shadow-lg">
              <span className="text-amber-400 font-black">
                🔥 {currentStory.calories || 420} kcal
              </span>
              <span className="text-white/40">|</span>
              <span className="text-emerald-400">
                🍗 {currentStory.protein || 32}g Pro
              </span>
              <span className="text-white/40">|</span>
              <span className="text-sky-300">
                🍞 {currentStory.carbs || 40}g Carb
              </span>
            </div>

            {/* Caption Banner */}
            {currentStory.caption && (
              <div className="w-full bg-black/60 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl border border-white/10 text-xs font-bold shadow-xl">
                <p className="leading-snug">{currentStory.caption}</p>
              </div>
            )}
          </div>

          {/* BOTTOM INTERACTION BAR */}
          <div className="relative z-20 p-4 pt-0 flex items-center space-x-2">
            <div className="flex-1 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs placeholder-white/70">
              <span>Send a reply...</span>
            </div>

            <button
              onClick={handleSendFlameReaction}
              className="p-2.5 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-lg active:scale-95 transition-transform"
              title="Send Flame"
            >
              <Flame className="w-5 h-5 fill-white" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
