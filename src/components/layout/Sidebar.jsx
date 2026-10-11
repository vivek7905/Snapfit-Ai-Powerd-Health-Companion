import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Camera,
  UtensilsCrossed,
  Bot,
  BarChart3,
  Trophy,
  User,
  Settings,
  LogOut,
  Flame,
  Check,
  Sparkles,
  ArrowRight,
  Crown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useHealth } from '../../hooks/useHealth';
import { UpgradeModal } from '../ui/UpgradeModal';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { fitPoints, streakDays, isPro } = useHealth();
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const navItems = [
    { label: 'Home', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Snap & Share', icon: Flame, path: '/snap-share', badge: 'Story' },
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
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white dark:bg-[#14213D] border-r border-slate-200/80 dark:border-slate-800 shrink-0 z-30 select-none">
      {/* Brand Logo */}
      <div className="flex items-center px-6 h-20 border-b border-slate-100 dark:border-slate-800/80">
        <Link to="/dashboard" className="flex items-center space-x-3">
          <img
            src="/snapfit-logo.png"
            alt="SnapFit Logo"
            className="h-10 w-auto object-contain"
          />
          <div className="flex flex-col">
            <span className="text-xl font-black text-[#087F5B] dark:text-emerald-400 tracking-tight leading-none">
              SnapFit
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
              AI Health Companion
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3.5 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-[#087F5B] text-white shadow-md shadow-[#087F5B]/25 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-[#EFFAF5] dark:hover:bg-slate-800/60 hover:text-[#087F5B] dark:hover:text-emerald-400'
              }`
            }
          >
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 shrink-0">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        {/* Sidebar Cards Area */}
        <div className="pt-4 space-y-3">
          {/* Card 1: FIT POINTS */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#EFFAF5] to-emerald-50/50 dark:from-slate-800/80 dark:to-slate-900 border border-[#087F5B]/20 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#087F5B] dark:text-emerald-400">
                FIT POINTS
              </span>
              <div className="flex items-center space-x-1 text-amber-500 font-black text-xs">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                <span>{streakDays} Day Streak</span>
              </div>
            </div>

            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {fitPoints}
              </span>
              <span className="text-xs font-bold text-slate-400">pts</span>
            </div>

            <button
              onClick={() => navigate('/rewards')}
              className="text-xs font-bold text-[#087F5B] dark:text-emerald-400 hover:underline flex items-center pt-1"
            >
              <span>View Rewards</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>

          {/* Card 2: UPGRADE TO SNAPFIT PRO */}
          <div className="p-4 rounded-2xl bg-[#14213D] text-white shadow-md relative overflow-hidden space-y-3">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#087F5B]/30 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center space-x-1.5 text-amber-300">
              <Crown className="w-3.5 h-3.5 fill-amber-300" />
              <span className="text-[10px] font-black uppercase tracking-wider">
                {isPro ? 'PRO ACTIVE' : 'UPGRADE TO SNAPFIT PRO'}
              </span>
            </div>

            <ul className="space-y-1.5 text-[11px] text-slate-200">
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[3]" />
                <span>Advanced AI Insights</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[3]" />
                <span>Personalized Meal Plans</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[3]" />
                <span>Ad-free Experience</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[3]" />
                <span>Exclusive Rewards</span>
              </li>
            </ul>

            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-[#087F5B] hover:from-emerald-400 hover:to-[#056B4A] text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1"
            >
              <span>{isPro ? 'Manage Pro →' : 'Upgrade Now →'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-3 truncate cursor-pointer group"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
              alt={user?.name || "Rahul Sharma"}
              className="w-9 h-9 rounded-full object-cover border-2 border-[#087F5B]"
            />
            <div className="truncate">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-[#087F5B] transition-colors">
                {user?.name || "Rahul Sharma"}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.email || "rahul.sharma@snapfit.ai"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </aside>
  );
};
