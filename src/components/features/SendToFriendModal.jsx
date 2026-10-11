import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Send,
  Flame,
  Check,
  Sparkles,
  Users,
  CheckCheck,
  UserPlus
} from 'lucide-react';
import { MOCK_FRIENDS } from '../../data/mockFriends';
import { useHealth } from '../../hooks/useHealth';

export const SendToFriendModal = ({ isOpen, onClose, snapData }) => {
  const { sendFoodSnap } = useHealth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriends, setSelectedFriends] = useState(['f-1']); // default select 1st friend
  const [includeMyStory, setIncludeMyStory] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const categories = ['All', 'Best Friends', 'Gym Squad', 'Streaks 🔥'];

  // Filter friends based on search query and category
  const filteredFriends = MOCK_FRIENDS.filter((friend) => {
    const matchesSearch =
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterCategory === 'All') return true;
    if (filterCategory === 'Streaks 🔥') return friend.streak > 10;
    return friend.category === filterCategory;
  });

  const toggleSelectFriend = (id) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedFriends.length === filteredFriends.length) {
      setSelectedFriends([]);
    } else {
      setSelectedFriends(filteredFriends.map((f) => f.id));
    }
  };

  const handleSendSnap = () => {
    setIsSending(true);

    const recipientNames = MOCK_FRIENDS.filter((f) =>
      selectedFriends.includes(f.id)
    ).map((f) => f.name);

    if (includeMyStory) {
      recipientNames.unshift('My Story');
    }

    setTimeout(() => {
      sendFoodSnap(snapData, recipientNames);
      setIsSending(false);
      onClose();
    }, 600);
  };

  const totalRecipientsCount = selectedFriends.length + (includeMyStory ? 1 : 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        {/* Snapchat Style Send Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white dark:bg-[#14213D] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden z-10 my-6 flex flex-col max-h-[88vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-400/20 text-amber-500 flex items-center justify-center">
                <Flame className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Send Food Snap
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  Share nutrition streak with your fitness squad
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4 pb-2 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search friends or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-[#087F5B] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 no-scrollbar">
              <div className="flex items-center space-x-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all ${
                      filterCategory === cat
                        ? 'bg-[#087F5B] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSelectAll}
                className="text-[11px] font-black text-[#087F5B] dark:text-emerald-400 hover:underline shrink-0 ml-1"
              >
                {selectedFriends.length === filteredFriends.length ? 'Deselect' : 'Select All'}
              </button>
            </div>
          </div>

          {/* Friends List Scroll Area */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
            {/* Quick Option: Post to My Story */}
            <div
              onClick={() => setIncludeMyStory(!includeMyStory)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                includeMyStory
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-[#087F5B] p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-amber-500 font-bold">
                    <Sparkles className="w-5 h-5 fill-amber-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      My Story
                    </span>
                    <span className="text-[9px] font-black px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-md">
                      24h
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Visible to all your fitness buddies
                  </p>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  includeMyStory
                    ? 'bg-[#087F5B] border-[#087F5B] text-white shadow-sm'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                {includeMyStory && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* Separator */}
            <div className="px-1 pt-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Friends ({filteredFriends.length})
              </span>
            </div>

            {/* Individual Friends Rows */}
            {filteredFriends.map((friend) => {
              const isSelected = selectedFriends.includes(friend.id);

              return (
                <div
                  key={friend.id}
                  onClick={() => toggleSelectFriend(friend.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50/60 dark:bg-slate-800/80 border-[#087F5B]/40 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {/* Avatar with status indicator */}
                    <div className="relative shrink-0">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      {friend.status === 'online' && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                      )}
                    </div>

                    {/* Friend Name & Streak */}
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                          {friend.name}
                        </span>
                        <div className="flex items-center text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-full">
                          <Flame className="w-3 h-3 fill-amber-500 mr-0.5" />
                          <span>{friend.streak}d</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        @{friend.username} • {friend.category}
                      </p>
                    </div>
                  </div>

                  {/* Circular Selection Toggle */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 ml-3 ${
                      isSelected
                        ? 'bg-[#087F5B] border-[#087F5B] text-white shadow-sm'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Floating Send Bar */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex items-center justify-between">
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
              <span>Sending to </span>
              <strong className="text-[#087F5B] dark:text-emerald-400 font-black">
                {totalRecipientsCount} recipient{totalRecipientsCount === 1 ? '' : 's'}
              </strong>
            </div>

            <button
              onClick={handleSendSnap}
              disabled={totalRecipientsCount === 0 || isSending}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs shadow-lg flex items-center space-x-2 transition-all ${
                totalRecipientsCount === 0 || isSending
                  ? 'opacity-50 cursor-not-allowed bg-slate-300 dark:bg-slate-700 text-slate-500'
                  : 'bg-gradient-to-r from-[#087F5B] to-emerald-500 hover:from-[#056B4A] hover:to-emerald-600 text-white shadow-[#087F5B]/30 hover:scale-105 active:scale-95'
              }`}
            >
              {isSending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Snap</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
