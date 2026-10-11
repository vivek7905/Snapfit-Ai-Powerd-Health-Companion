import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Camera,
  UtensilsCrossed,
  Bot,
  BarChart3,
  Trophy,
  User,
  Settings,
  X,
  LogOut,
  Flame,
  Crown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useHealth } from '../../hooks/useHealth';
import { UpgradeModal } from '../ui/UpgradeModal';

export const MobileNav = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { fitPoints, streakDays } = useHealth();
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const bottomNavItems = [
    { label: 'Home', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Snap & Share', icon: Flame, path: '/snap-share' },
    { label: 'Snap Food', icon: Camera, path: '/snap-food' },
    { label: 'AI Coach', icon: Bot, path: '/ai-coach' },
    { label: 'Rewards', icon: Trophy, path: '/rewards' },
  ];

  const drawerNavItems = [
    { label: 'Home', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Snap & Share Story 🔥', icon: Flame, path: '/snap-share' },
    { label: 'Snap Food', icon: Camera, path: '/snap-food' },
    { label: 'Log Meal', icon: UtensilsCrossed, path: '/log-meal' },
    { label: 'AI Coach', icon: Bot, path: '/ai-coach' },
    { label: 'Progress', icon: BarChart3, path: '/progress' },
    { label: 'Rewards', icon: Trophy, path: '/rewards' },
    { label: 'Profile', icon: User, path: '/profile' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate('/login');
  };

  return (
    <>
      {/* Fixed Bottom Bar for Mobile Devices */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#14213D]/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 px-2 py-2 flex items-center justify-around shadow-lg">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-[#087F5B] dark:text-emerald-400 font-black scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Slide-out Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Content Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-4/5 max-w-xs bg-white dark:bg-[#14213D] h-full shadow-2xl flex flex-col z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 h-20 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <img
                    src="/snapfit-logo.png"
                    alt="SnapFit Logo"
                    className="h-8 w-auto object-contain"
                  />
                  <span className="text-xl font-black text-[#087F5B] dark:text-emerald-400 tracking-tight">
                    SnapFit
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Fit Points Bar */}
              <div className="p-3 mx-4 mt-3 rounded-2xl bg-[#EFFAF5] dark:bg-slate-800/80 border border-[#087F5B]/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#087F5B] dark:text-emerald-400 block">
                    Fit Points
                  </span>
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    {fitPoints} pts
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-amber-500 font-bold text-xs bg-white dark:bg-slate-900 px-2.5 py-1 rounded-full shadow-sm">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{streakDays}d Streak</span>
                </div>
              </div>

              {/* Items */}
              <div className="flex-1 px-4 py-3 space-y-1 overflow-y-auto">
                {drawerNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                        isActive
                          ? 'bg-[#087F5B] text-white shadow-md'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-[#EFFAF5] dark:hover:bg-slate-800 hover:text-[#087F5B]'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}

                <button
                  onClick={() => {
                    onClose();
                    setShowUpgradeModal(true);
                  }}
                  className="w-full mt-2 flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-bold text-sm"
                >
                  <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Upgrade to Pro</span>
                </button>
              </div>

              {/* User Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div
                  onClick={() => {
                    onClose();
                    navigate('/profile');
                  }}
                  className="flex items-center space-x-3 truncate cursor-pointer"
                >
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                    alt="User"
                    className="w-8 h-8 rounded-full border-2 border-[#087F5B] object-cover"
                  />
                  <div className="truncate">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                      {user?.name || "Rahul Sharma"}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate block">
                      {user?.email || "rahul.sharma@snapfit.ai"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </>
  );
};
