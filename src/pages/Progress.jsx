import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  Award,
  Flame,
  Droplets,
  Activity,
  Zap,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useHealth } from '../hooks/useHealth';

export const Progress = () => {
  const { totals, targets, healthScore, waterGlasses, activityMinutes } = useHealth();
  const [dateFilter, setDateFilter] = useState('This Week');

  // Chart datasets based on filter
  const thisWeekData = [
    { day: 'Mon', calories: 2050, protein: 78, water: 7, activity: 45, healthScore: 84 },
    { day: 'Tue', calories: 1920, protein: 84, water: 8, activity: 50, healthScore: 89 },
    { day: 'Wed', calories: 2180, protein: 82, water: 8, activity: 60, healthScore: 91 },
    { day: 'Thu', calories: 1980, protein: 76, water: 6, activity: 35, healthScore: 82 },
    { day: 'Fri', calories: 2100, protein: 86, water: 8, activity: 55, healthScore: 92 },
    { day: 'Sat', calories: 2020, protein: 79, water: 7, activity: 40, healthScore: 86 },
    { day: 'Sun', calories: totals.calories || 1350, protein: totals.protein || 42, water: waterGlasses || 6, activity: activityMinutes || 30, healthScore: healthScore || 87 },
  ];

  const lastWeekData = [
    { day: 'Mon', calories: 1850, protein: 70, water: 6, activity: 30, healthScore: 78 },
    { day: 'Tue', calories: 2050, protein: 75, water: 7, activity: 45, healthScore: 82 },
    { day: 'Wed', calories: 1980, protein: 72, water: 6, activity: 40, healthScore: 80 },
    { day: 'Thu', calories: 2200, protein: 80, water: 8, activity: 60, healthScore: 88 },
    { day: 'Fri', calories: 1900, protein: 68, water: 7, activity: 35, healthScore: 79 },
    { day: 'Sat', calories: 2150, protein: 82, water: 8, activity: 50, healthScore: 87 },
    { day: 'Sun', calories: 2000, protein: 74, water: 7, activity: 40, healthScore: 83 },
  ];

  const thisMonthData = [
    { day: 'W1', calories: 1980, protein: 74, water: 7, activity: 42, healthScore: 82 },
    { day: 'W2', calories: 2050, protein: 79, water: 8, activity: 48, healthScore: 86 },
    { day: 'W3', calories: 2120, protein: 83, water: 8, activity: 52, healthScore: 89 },
    { day: 'W4', calories: 2020, protein: 81, water: 7, activity: 46, healthScore: 88 },
  ];

  const currentChartData = dateFilter === 'This Week'
    ? thisWeekData
    : dateFilter === 'Last Week'
    ? lastWeekData
    : thisMonthData;

  // Compute summary values
  const avgCalories = Math.round(currentChartData.reduce((acc, c) => acc + c.calories, 0) / currentChartData.length);
  const avgProtein = Math.round(currentChartData.reduce((acc, c) => acc + c.protein, 0) / currentChartData.length);
  const avgWater = (currentChartData.reduce((acc, c) => acc + c.water, 0) / currentChartData.length).toFixed(1);
  const avgActivity = Math.round(currentChartData.reduce((acc, c) => acc + c.activity, 0) / currentChartData.length);
  const avgScore = Math.round(currentChartData.reduce((acc, c) => acc + c.healthScore, 0) / currentChartData.length);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Date Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#14213D] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Progress & Health Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor weekly caloric intake, protein adherence, hydration consistency, and activity milestones.
          </p>
        </div>

        {/* Date Filter: This Week, Last Week, This Month */}
        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl shrink-0">
          {['This Week', 'Last Week', 'This Month'].map((filter) => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateFilter === filter
                  ? 'bg-[#087F5B] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Top Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* 1. Weekly Calories */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#14213D] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-amber-500">
            <Flame className="w-4 h-4 fill-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Weekly Calories
            </span>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">
            {avgCalories} <span className="text-xs font-bold text-slate-400">kcal/d</span>
          </p>
          <span className="text-[10px] font-bold text-[#087F5B] bg-[#EFFAF5] dark:bg-emerald-950/40 px-2 py-0.5 rounded-full inline-block">
            Target 2000 kcal
          </span>
        </div>

        {/* 2. Weekly Protein */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#14213D] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-[#087F5B] dark:text-emerald-400">
            <Zap className="w-4 h-4 fill-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Weekly Protein
            </span>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">
            {avgProtein} <span className="text-xs font-bold text-slate-400">g/d</span>
          </p>
          <span className="text-[10px] font-bold text-[#087F5B] bg-[#EFFAF5] dark:bg-emerald-950/40 px-2 py-0.5 rounded-full inline-block">
            Target 80g
          </span>
        </div>

        {/* 3. Water Intake */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#14213D] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-sky-500">
            <Droplets className="w-4 h-4 fill-sky-500" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Water Intake
            </span>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">
            {avgWater} <span className="text-xs font-bold text-slate-400">glasses</span>
          </p>
          <span className="text-[10px] font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded-full inline-block">
            Goal 8 glasses
          </span>
        </div>

        {/* 4. Activity */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#14213D] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-purple-500">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Activity
            </span>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">
            {avgActivity} <span className="text-xs font-bold text-slate-400">min/d</span>
          </p>
          <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full inline-block">
            Goal 60 min
          </span>
        </div>

        {/* 5. Health Score */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#14213D] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 col-span-2 sm:col-span-1">
          <div className="flex items-center space-x-2 text-rose-500">
            <Award className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Health Score
            </span>
          </div>
          <p className="text-xl font-black text-[#087F5B] dark:text-emerald-400">
            {avgScore} <span className="text-xs font-bold text-slate-400">/ 100</span>
          </p>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full inline-block">
            Top 10% Habit Tier
          </span>
        </div>

      </div>

      {/* Weekly Insight Card as specified */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#EFFAF5] via-emerald-50/70 to-teal-50/50 dark:from-[#087F5B]/20 dark:to-slate-800/60 border border-[#087F5B]/25 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#087F5B] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#087F5B]/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Great job! You hit your protein goal on 4 of 7 days this week.
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Keep logging your evening meals to sustain your 5-day streak and earn +100 bonus Fit Points.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Calories by Day */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#14213D] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Calories by Day
              </h3>
              <p className="text-[11px] text-slate-400">Daily calorie consumption vs 2000 kcal target</p>
            </div>
            <span className="text-xs font-bold text-amber-500">Target: 2000 kcal</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis domain={[0, 2400]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#14213D',
                    borderColor: '#334155',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="calories" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Protein by Day */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#14213D] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Protein by Day
              </h3>
              <p className="text-[11px] text-slate-400">Daily protein grams vs 80g goal</p>
            </div>
            <span className="text-xs font-bold text-[#087F5B] dark:text-emerald-400">Goal: 80g</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#14213D',
                    borderColor: '#334155',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="protein" fill="#087F5B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Water Intake */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#14213D] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Water Intake
              </h3>
              <p className="text-[11px] text-slate-400">Daily glasses of water consumed</p>
            </div>
            <span className="text-xs font-bold text-sky-500">Goal: 8 glasses</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#14213D',
                    borderColor: '#334155',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="water" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Health Score Trend */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#14213D] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Health Score Trend
              </h3>
              <p className="text-[11px] text-slate-400">Composite score based on nutrition, hydration & activity</p>
            </div>
            <span className="text-xs font-bold text-purple-500">Avg: 87 / 100</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#087F5B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#087F5B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#14213D',
                    borderColor: '#334155',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="healthScore"
                  stroke="#087F5B"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#scoreGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
