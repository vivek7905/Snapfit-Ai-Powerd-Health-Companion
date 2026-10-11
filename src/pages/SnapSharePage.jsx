import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Upload,
  RotateCcw,
  Sparkles,
  Flame,
  Send,
  Plus,
  X,
  MapPin,
  Clock,
  Sliders,
  Check,
  Award,
  Share2,
  Utensils,
  Eye,
  Bookmark
} from 'lucide-react';
import { useHealth } from '../hooks/useHealth';
import { useAuth } from '../hooks/useAuth';
import { MOCK_FRIENDS, PRESET_FOOD_SNAPS } from '../data/mockFriends';
import { SendToFriendModal } from '../components/features/SendToFriendModal';
import { SnapStoryViewer } from '../components/features/SnapStoryViewer';

export const SnapSharePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    healthScore,
    healthScoreDetails,
    addMeal,
    sharedSnaps,
    showToast,
    streakDays
  } = useHealth();

  // Camera & Canvas refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // States
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(PRESET_FOOD_SNAPS[0].image);
  const [foodName, setFoodName] = useState(PRESET_FOOD_SNAPS[0].name);
  const [calories, setCalories] = useState(PRESET_FOOD_SNAPS[0].calories);
  const [protein, setProtein] = useState(PRESET_FOOD_SNAPS[0].protein);
  const [carbs, setCarbs] = useState(PRESET_FOOD_SNAPS[0].carbs);
  const [caption, setCaption] = useState(PRESET_FOOD_SNAPS[0].caption);
  const [locationName, setLocationName] = useState('SnapFit Kitchen');

  // Overlay Toggles
  const [showHealthScoreTag, setShowHealthScoreTag] = useState(true);
  const [showMacroTag, setShowMacroTag] = useState(true);
  const [showGeotag, setShowGeotag] = useState(true);
  const [showStreakTag, setShowStreakTag] = useState(true);
  const [showCaptionTag, setShowCaptionTag] = useState(true);

  // Active Filter: 'normal' | 'warm' | 'fresh' | 'sunset' | 'noir'
  const [activeFilter, setActiveFilter] = useState('normal');

  // Modal States
  const [showSendModal, setShowSendModal] = useState(false);
  const [storyViewerOpen, setStoryViewerOpen] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  // Camera Controls
  const startCamera = async () => {
    try {
      if (stream) stream.getTracks().forEach((track) => track.stop());
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
      setCapturedImage(null);
    } catch (err) {
      console.warn('Camera stream error:', err);
      showToast('Camera access unavailable. Choose from presets or gallery.', 'info');
      setCameraActive(false);
    }
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    setFoodName('Fresh Meal Snap');
    setCaption('Fueling up with nutritious goodness! 🥗✨');
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCapturedImage(reader.result);
      setFoodName('Home Cooked Meal');
      setCaption('Look at this delicious plate! 😋🥑');
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      setCameraActive(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset) => {
    setCapturedImage(preset.image);
    setFoodName(preset.name);
    setCalories(preset.calories);
    setProtein(preset.protein);
    setCarbs(preset.carbs);
    setCaption(preset.caption);
    setLocationName(preset.location);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  // Log to Meals
  const handleLogToMeals = () => {
    addMeal({
      name: foodName,
      type: 'Lunch',
      calories: Number(calories) || 450,
      protein: Number(protein) || 25,
      carbs: Number(carbs) || 45,
      fat: 14,
      image: capturedImage,
      method: 'Snap & Share'
    });
    showToast(`Logged "${foodName}" to today's meals!`, 'success');
  };

  // Friends' active stories list for the story viewer
  const storiesList = MOCK_FRIENDS.filter((f) => f.hasStory).map((f) => ({
    friendName: f.name,
    avatar: f.avatar,
    streak: f.streak,
    image: f.story.image,
    foodName: f.story.foodName,
    calories: f.story.calories,
    protein: f.story.protein,
    carbs: f.story.carbs,
    healthScore: f.story.healthScore,
    time: f.story.time,
    caption: f.story.caption
  }));

  const openStoryViewer = (idx) => {
    setActiveStoryIndex(idx);
    setStoryViewerOpen(true);
  };

  // Filter CSS class mapping
  const filterStyles = {
    normal: '',
    warm: 'sepia-[0.25] saturate-[1.3] contrast-[1.05]',
    fresh: 'hue-rotate-15 saturate-[1.25] contrast-[1.08] brightness-[1.02]',
    sunset: 'saturate-[1.4] brightness-[0.98] contrast-[1.1] hue-rotate-[-10deg]',
    noir: 'grayscale contrast-[1.2] brightness-[0.95]'
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Hidden elements for capture/upload */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* TOP: FRIENDS STORY CAROUSEL (SNAPCHAT/INSTAGRAM STYLE) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#14213D] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Fitness Squad Food Stories
            </h3>
          </div>
          <span className="text-xs font-bold text-amber-500 flex items-center">
            <Flame className="w-3.5 h-3.5 fill-amber-500 mr-1" />
            {streakDays} Day Healthy Streak
          </span>
        </div>

        {/* Stories Horizontal Scroll */}
        <div className="flex items-center space-x-4 sm:space-x-5 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {/* User's "Add to Story" Bubble */}
          <div
            onClick={() => setShowSendModal(true)}
            className="flex flex-col items-center space-y-1.5 shrink-0 cursor-pointer group"
          >
            <div className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#087F5B] to-emerald-400 p-0.5 flex items-center justify-center transition-transform group-hover:scale-105 shadow-md">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                alt="My Story"
                className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900"
              />
              <div className="absolute bottom-0 right-0 p-1 rounded-full bg-[#087F5B] text-white border-2 border-white dark:border-slate-900 shadow">
                <Plus className="w-3 h-3 stroke-[3]" />
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              My Story
            </span>
          </div>

          {/* Friends with active stories */}
          {MOCK_FRIENDS.filter((f) => f.hasStory).map((friend, idx) => (
            <div
              key={friend.id}
              onClick={() => openStoryViewer(idx)}
              className="flex flex-col items-center space-y-1.5 shrink-0 cursor-pointer group"
            >
              <div className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-[#087F5B] p-0.5 flex items-center justify-center transition-transform group-hover:scale-105 shadow-md">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900"
                />
                <div className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-black/75 backdrop-blur-sm text-amber-400 text-[9px] font-black border border-amber-400/40 flex items-center">
                  <Flame className="w-2.5 h-2.5 fill-amber-400 mr-0.5" />
                  {friend.streak}
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[70px] text-center">
                {friend.name.split(' ')[0]}
              </span>
            </div>
          ))}

          {/* Other friends for invitation / quick send */}
          {MOCK_FRIENDS.filter((f) => !f.hasStory).map((friend) => (
            <div
              key={friend.id}
              onClick={() => setShowSendModal(true)}
              className="flex flex-col items-center space-y-1.5 shrink-0 cursor-pointer group opacity-75 hover:opacity-100"
            >
              <div className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-slate-200 dark:bg-slate-700 p-0.5 flex items-center justify-center transition-transform group-hover:scale-105">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900"
                />
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[70px] text-center">
                {friend.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN TWO-COLUMN STUDIO AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: SNAPCHAT PHONE VIEWPORT WITH REALTIME OVERLAYS (LG: 7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          {/* Smartphone Frame Container */}
          <div className="relative w-full max-w-[360px] sm:max-w-[380px] aspect-[9/16] bg-slate-950 rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-white/10 flex flex-col justify-between overflow-hidden">
            
            {/* Top Phone Notch / Dynamic Island */}
            <div className="absolute top-4 inset-x-0 mx-auto w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 mr-2" />
              <span className="w-2 h-2 rounded-full bg-slate-800" />
            </div>

            {/* LIVE CAMERA FEED OR CAPTURED IMAGE */}
            <div className="absolute inset-0 rounded-[36px] overflow-hidden">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${filterStyles[activeFilter]}`}
                />
              ) : (
                <img
                  src={capturedImage}
                  alt="Food Snap"
                  className={`w-full h-full object-cover transition-all duration-300 ${filterStyles[activeFilter]}`}
                />
              )}

              {/* Ambient Vignette Gradients for Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />
            </div>

            {/* OVERLAY 1: TOP BADGES (HEALTH SCORE & STREAK) */}
            <div className="relative z-20 pt-7 px-3 space-y-2">
              <div className="flex items-center justify-between">
                {/* Health Score Overlay Sticker */}
                {showHealthScoreTag && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-400/50 text-white shadow-lg"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-black text-emerald-300">
                      ⚡ Health Score {healthScore}/100
                    </span>
                    <span className="text-[10px] font-bold text-emerald-100/80">
                      • {healthScoreDetails?.rating || 'Excellent'}
                    </span>
                  </motion.div>
                )}

                {/* Streak Tag */}
                {showStreakTag && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/85 backdrop-blur-md text-white text-[11px] font-black shadow-lg"
                  >
                    <Flame className="w-3.5 h-3.5 fill-white" />
                    <span>{streakDays}d Streak</span>
                  </motion.div>
                )}
              </div>

              {/* Geotag & Time Overlay */}
              {showGeotag && (
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 shadow">
                  <MapPin className="w-3 h-3 text-rose-300" />
                  <span>{locationName}</span>
                  <span className="text-white/50">•</span>
                  <Clock className="w-3 h-3 text-amber-300" />
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
            </div>

            {/* OVERLAY 2: LOWER STICKERS (MACROS & CAPTION) */}
            <div className="relative z-20 px-3 pb-4 space-y-2.5">
              {/* Macro Tags Overlay */}
              {showMacroTag && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="w-full flex items-center justify-between p-2 rounded-2xl bg-black/65 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-xl"
                >
                  <span className="text-amber-400 font-black">
                    🔥 {calories} kcal
                  </span>
                  <span className="text-white/30">|</span>
                  <span className="text-emerald-400">
                    🍗 {protein}g Pro
                  </span>
                  <span className="text-white/30">|</span>
                  <span className="text-sky-300">
                    🥑 {carbs}g Carb
                  </span>
                </motion.div>
              )}

              {/* Snapchat Editable Caption Banner */}
              {showCaptionTag && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="w-full bg-black/60 backdrop-blur-md text-white p-2.5 rounded-2xl border border-white/10 text-xs font-extrabold shadow-xl"
                >
                  <p className="leading-snug">{caption}</p>
                </motion.div>
              )}

              {/* Bottom In-Phone Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                {cameraActive ? (
                  <button
                    onClick={handleCaptureSnapshot}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#087F5B] to-emerald-400 hover:scale-[1.02] text-white font-black text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Snap Photo</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSendModal(true)}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-[#087F5B] to-emerald-500 hover:scale-[1.02] text-white font-black text-xs shadow-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send to Friend 🔥</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Capture / Retake Controls below phone */}
          <div className="flex items-center space-x-3 mt-4">
            <button
              onClick={startCamera}
              className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold hover:border-[#087F5B] transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Camera className="w-3.5 h-3.5 text-[#087F5B]" />
              <span>Use Camera</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold hover:border-[#087F5B] transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Upload className="w-3.5 h-3.5 text-[#087F5B]" />
              <span>Upload Photo</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: SNAPCHAT CONTROLS, FILTERS & PRESET TEMPLATES (LG: 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Sticker & Overlay Toggles */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#14213D] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#087F5B] dark:text-emerald-400" />
                <span>Snapchat Story Stickers</span>
              </h4>
              <span className="text-[10px] font-bold text-slate-400">Live Overlays</span>
            </div>

            {/* Toggle Chips */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setShowHealthScoreTag(!showHealthScoreTag)}
                className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                  showHealthScoreTag
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#087F5B] text-[#087F5B] dark:text-emerald-400'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                <span>⚡ Health Score Tag</span>
                {showHealthScoreTag && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>

              <button
                onClick={() => setShowMacroTag(!showMacroTag)}
                className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                  showMacroTag
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#087F5B] text-[#087F5B] dark:text-emerald-400'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                <span>🔥 Macro Calories</span>
                {showMacroTag && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>

              <button
                onClick={() => setShowGeotag(!showGeotag)}
                className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                  showGeotag
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#087F5B] text-[#087F5B] dark:text-emerald-400'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                <span>📍 Geotag & Time</span>
                {showGeotag && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>

              <button
                onClick={() => setShowStreakTag(!showStreakTag)}
                className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                  showStreakTag
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#087F5B] text-[#087F5B] dark:text-emerald-400'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                <span>🔥 Streak Badge</span>
                {showStreakTag && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            </div>

            {/* Custom Caption Input */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                Caption Text Sticker:
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your snap caption..."
                className="w-full px-3.5 py-2 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#087F5B]"
              />
            </div>
          </div>

          {/* Card 2: Snapchat Filter Effects */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#14213D] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-[#087F5B] dark:text-emerald-400" />
              <span>Camera Filters</span>
            </h4>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'normal', name: 'Original' },
                { id: 'warm', name: 'Warm Glow ☀️' },
                { id: 'fresh', name: 'Fresh Green 🥑' },
                { id: 'sunset', name: 'Sunset 🌅' },
                { id: 'noir', name: 'Noir 🖤' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                    activeFilter === filter.id
                      ? 'bg-[#087F5B] text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          {/* Card 3: Quick Preset Food Snaps (Instant Test) */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#14213D] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Sample Healthy Snaps
              </h4>
              <span className="text-[10px] text-slate-400">Click to load</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {PRESET_FOOD_SNAPS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2 rounded-2xl border transition-all cursor-pointer flex items-center space-x-2.5 ${
                    capturedImage === preset.image
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-[#087F5B] shadow-sm'
                      : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100'
                  }`}
                >
                  <img
                    src={preset.image}
                    alt={preset.name}
                    className="w-11 h-11 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                      {preset.name}
                    </p>
                    <span className="text-[10px] text-[#087F5B] dark:text-emerald-400 font-bold">
                      {preset.calories} kcal • Score {preset.healthScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Action Buttons (Share, Log, My Story) */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#087F5B] to-[#045339] text-white shadow-xl space-y-3">
            <div>
              <h4 className="text-base font-black tracking-tight">
                Ready to Share Your Snap?
              </h4>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Send to your fitness squad or log directly to today's nutrition diary.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                onClick={() => setShowSendModal(true)}
                className="flex-1 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center space-x-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Send to Friend 🔥</span>
              </button>

              <button
                onClick={handleLogToMeals}
                className="flex-1 py-3 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-extrabold text-xs transition-all flex items-center justify-center space-x-1.5 border border-white/20"
              >
                <Utensils className="w-4 h-4" />
                <span>Log to Meals</span>
              </button>
            </div>
          </div>

          {/* Card 5: Previously Shared Snaps Feed */}
          {sharedSnaps.length > 0 && (
            <div className="p-5 rounded-3xl bg-white dark:bg-[#14213D] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Recently Sent Snaps ({sharedSnaps.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {sharedSnaps.map((snap) => (
                  <div
                    key={snap.id}
                    className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={snap.image || capturedImage}
                        alt="Snap"
                        className="w-9 h-9 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {snap.foodName || 'Meal Snap'}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          Sent to {snap.recipients?.join(', ') || 'Friends'} • {snap.timestamp}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                      +25 pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODALS */}
      <SendToFriendModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        snapData={{
          image: capturedImage,
          foodName,
          calories,
          protein,
          carbs,
          healthScore,
          caption,
          location: locationName
        }}
      />

      <SnapStoryViewer
        isOpen={storyViewerOpen}
        onClose={() => setStoryViewerOpen(false)}
        initialStoryIndex={activeStoryIndex}
        stories={storiesList}
      />
    </div>
  );
};
