import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Utensils, Search, Calendar, Plus, Filter, Flame } from 'lucide-react';

import { useHealth } from '../hooks/useHealth';
import { MealCard } from '../components/features/MealCard';
import { Button } from '../components/ui/Button';

export const Meals = () => {
  const navigate = useNavigate();
  const { meals, totals } = useHealth();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const tabs = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const filteredMeals = meals.filter((meal) => {
    const matchesTab = activeTab === 'All' || meal.type === activeTab;
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Summary */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Daily Meal Logs & History
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review logged meals, macro breakdowns, and track daily eating schedule.
          </p>
        </div>

        {/* Daily totals summary badges */}
        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl">
          <div className="text-center px-3 border-r border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Calories</span>
            <p className="text-sm font-black text-amber-500">{totals.calories} kcal</p>
          </div>
          <div className="text-center px-3 border-r border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Protein</span>
            <p className="text-sm font-black text-emerald-500">{totals.protein}g</p>
          </div>
          <div className="text-center px-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Carbs</span>
            <p className="text-sm font-black text-sky-500">{totals.carbs}g</p>
          </div>
        </div>
      </div>

      {/* Controls Bar: Tabs + Search + Date Picker */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Category Tabs */}
        <div className="flex items-center space-x-1.5 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm w-full md:w-auto overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input & Date Picker */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search meals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          <Button
            onClick={() => navigate('/food-scan')}
            variant="primary"
            size="sm"
            icon={Plus}
          >
            Log Meal
          </Button>
        </div>
      </div>

      {/* Meals List Grid */}
      <div className="space-y-4">
        {filteredMeals.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <Utensils className="w-12 h-12 stroke-[1.5] text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Meals Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No logged meals match your current search or tab filter. Try scanning a dish to add a new record!
            </p>
            <Button
              onClick={() => navigate('/food-scan')}
              variant="primary"
              size="md"
              icon={Plus}
            >
              Scan Food Photo
            </Button>
          </div>
        ) : (
          filteredMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))
        )}
      </div>
    </div>
  );
};
