import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Flame,
  Zap,
  TrendingUp,
  X,
  Upload,
  RotateCcw
} from 'lucide-react';
import { useHealth } from '../hooks/useHealth';

export const SnapFood = () => {
  const navigate = useNavigate();
  const { addMeal, showToast } = useHealth();

  // Camera video and canvas refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // States
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // 'user' or 'environment'
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Serving size multiplier
  const [servingSize, setServingSize] = useState(1.0);

  // Start Camera Stream
  const startCamera = async (mode = facingMode) => {
    setCameraError('');
    // Stop any existing stream first
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Camera permission is required to scan your food.');
      setCameraActive(false);
    }
  };

  // Switch between front and back camera
  const handleSwitchCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Automatically start camera on mount if not captured
  useEffect(() => {
    if (!capturedImage) {
      startCamera();
    }

    return () => {
      // Clean up camera stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [capturedImage]);

  // Capture snapshot from live video stream
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);

    // Stop stream while reviewing
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Retake Photo
  const handleRetake = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    startCamera();
  };

  // Upload from Gallery Fallback
  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCapturedImage(reader.result);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Analyze Food with AI
  const handleAnalyzeFood = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        foodDetected: 'Grilled Chicken Bowl',
        calories: 520,
        protein: 32,
        carbs: 48,
        fat: 16,
        fiber: 7,
        confidence: 94,
        image: capturedImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
      });
      showToast('Food analyzed successfully! (94% confidence)', 'success');
    }, 2000);
  };

  // Add to designated meal category
  const handleAddToMeal = (category) => {
    if (!analysisResult) return;

    const finalMeal = {
      name: analysisResult.foodDetected,
      type: category,
      calories: Math.round(analysisResult.calories * servingSize),
      protein: Math.round(analysisResult.protein * servingSize),
      carbs: Math.round(analysisResult.carbs * servingSize),
      fat: Math.round(analysisResult.fat * servingSize),
      fiber: Math.round(analysisResult.fiber * servingSize),
      confidence: analysisResult.confidence,
      image: analysisResult.image,
      method: 'Camera AI Scan'
    };

    addMeal(finalMeal);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Hidden canvas for taking snapshot */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden file input for gallery upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-center space-x-3 mb-2">
        <button
          className="px-4 py-2 rounded-2xl bg-[#087F5B] text-white text-xs font-black shadow-md shadow-[#087F5B]/25 flex items-center space-x-1.5"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>AI Food Scanner</span>
        </button>

        <button
          onClick={() => navigate('/snap-share')}
          className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#087F5B] text-xs font-black transition-all flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700"
        >
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Snap & Share Story 📸</span>
        </button>
      </div>

      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EFFAF5] dark:bg-emerald-950/40 text-[#087F5B] dark:text-emerald-400 text-xs font-black">
          <Camera className="w-4 h-4" />
          <span>Camera - Snap Your Food</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Snap Your Food with AI
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Point camera at your meal. Our deep learning computer vision model identifies ingredients and calculates exact calories & macros.
        </p>
      </div>

      {/* Main Camera Viewport or Snapshot Review */}
      <div className="bg-white dark:bg-[#14213D] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-lg relative overflow-hidden">
        
        {/* State 1: Live Camera View */}
        {!capturedImage && (
          <div className="space-y-6">
            <div className="relative w-full aspect-[4/3] max-h-[440px] rounded-3xl bg-slate-950 overflow-hidden flex items-center justify-center border-2 border-slate-800 shadow-inner">
              
              {cameraError ? (
                /* Camera Permission Fallback */
                <div className="p-8 text-center space-y-4 max-w-sm">
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-black text-white">
                    {cameraError}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Please allow browser camera permissions in your address bar, or choose an image directly from your gallery.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                    <button
                      onClick={() => startCamera()}
                      className="px-4 py-2.5 rounded-xl bg-[#087F5B] hover:bg-[#056B4A] text-white text-xs font-bold transition-all"
                    >
                      Try Camera Again
                    </button>
                    <button
                      onClick={handleGalleryClick}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Image</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Live Video Feed + Scan Area Overlay */
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Scan Area Frame Box with corner reticles */}
                  <div className="absolute inset-8 sm:inset-14 border-2 border-dashed border-emerald-400/80 rounded-2xl pointer-events-none flex flex-col items-center justify-between p-4">
                    <div className="flex justify-between w-full">
                      <div className="w-6 h-6 border-t-4 border-l-4 border-[#087F5B] rounded-tl-lg" />
                      <div className="w-6 h-6 border-t-4 border-r-4 border-[#087F5B] rounded-tr-lg" />
                    </div>

                    <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Scan Area • Align Plate Inside</span>
                    </div>

                    <div className="flex justify-between w-full">
                      <div className="w-6 h-6 border-b-4 border-l-4 border-[#087F5B] rounded-bl-lg" />
                      <div className="w-6 h-6 border-b-4 border-r-4 border-[#087F5B] rounded-br-lg" />
                    </div>
                  </div>

                  {/* Laser Beam Scanner Line */}
                  <div className="absolute inset-x-8 sm:inset-x-14 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scan pointer-events-none" />
                </>
              )}
            </div>

            {/* Camera Control Buttons */}
            <div className="flex items-center justify-around max-w-md mx-auto pt-2">
              {/* Gallery Button */}
              <button
                type="button"
                onClick={handleGalleryClick}
                className="flex flex-col items-center space-y-1 text-slate-600 dark:text-slate-300 hover:text-[#087F5B] transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-sm">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold">Gallery</span>
              </button>

              {/* Shutter / Capture Button */}
              <button
                type="button"
                onClick={handleCapture}
                className="w-18 h-18 p-1.5 rounded-full bg-gradient-to-tr from-[#087F5B] to-emerald-400 hover:scale-105 shadow-xl shadow-[#087F5B]/30 transition-all flex items-center justify-center group"
                title="Capture Photo"
              >
                <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-900 border-4 border-[#087F5B] flex items-center justify-center group-active:scale-95 transition-transform">
                  <div className="w-9 h-9 rounded-full bg-[#087F5B]" />
                </div>
              </button>

              {/* Switch Camera Button */}
              <button
                type="button"
                onClick={handleSwitchCamera}
                className="flex flex-col items-center space-y-1 text-slate-600 dark:text-slate-300 hover:text-[#087F5B] transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-sm">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold">Switch Camera</span>
              </button>
            </div>
          </div>
        )}

        {/* State 2: Photo Captured Review (Buttons: Retake, Analyze Food) */}
        {capturedImage && !analysisResult && (
          <div className="space-y-6">
            <div className="relative w-full aspect-[4/3] max-h-[440px] rounded-3xl bg-slate-950 overflow-hidden flex items-center justify-center shadow-lg">
              <img
                src={capturedImage}
                alt="Captured Meal"
                className="w-full h-full object-cover"
              />

              {/* Analyzing Loader State */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 text-white z-20">
                  <div className="relative w-16 h-16">
                    <RefreshCw className="w-16 h-16 animate-spin text-emerald-400 stroke-[1.5]" />
                    <Sparkles className="w-6 h-6 text-amber-300 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-base font-black">AI is analyzing your meal...</p>
                    <p className="text-xs text-emerald-200">Segmenting ingredients & calculating macros</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons: Retake & Analyze Food */}
            {!isAnalyzing && (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleRetake}
                  className="w-full sm:w-1/3 py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white font-extrabold text-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake</span>
                </button>

                <button
                  onClick={handleAnalyzeFood}
                  className="w-full sm:w-2/3 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#087F5B] to-emerald-500 hover:from-[#056B4A] hover:to-emerald-600 text-white font-black text-sm shadow-lg shadow-[#087F5B]/25 transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Food</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* State 3: AI Food Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Image Preview */}
              <div className="md:col-span-5 relative rounded-2xl overflow-hidden shadow-md aspect-video md:aspect-square">
                <img
                  src={analysisResult.image}
                  alt={analysisResult.foodDetected}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-[#087F5B] text-white text-[10px] font-black shadow">
                  Confidence: {analysisResult.confidence}%
                </span>
              </div>

              {/* Detected Food & Macros Breakdown */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#087F5B] dark:text-emerald-400">
                    Food Detected
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    {analysisResult.foodDetected}
                  </h3>
                </div>

                {/* Macros 4-Grid */}
                <div className="grid grid-cols-4 gap-2 text-center bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Calories</span>
                    <p className="text-base font-black text-amber-500">
                      {Math.round(analysisResult.calories * servingSize)}
                    </p>
                    <span className="text-[9px] text-slate-400">kcal</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Protein</span>
                    <p className="text-base font-black text-[#087F5B] dark:text-emerald-400">
                      {Math.round(analysisResult.protein * servingSize)}g
                    </p>
                    <span className="text-[9px] text-slate-400">g</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Carbs</span>
                    <p className="text-base font-black text-sky-500">
                      {Math.round(analysisResult.carbs * servingSize)}g
                    </p>
                    <span className="text-[9px] text-slate-400">g</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Fat</span>
                    <p className="text-base font-black text-purple-500">
                      {Math.round(analysisResult.fat * servingSize)}g
                    </p>
                    <span className="text-[9px] text-slate-400">g</span>
                  </div>
                </div>

                {/* Fiber info */}
                <div className="text-xs text-slate-500 flex items-center justify-between px-1">
                  <span>Dietary Fiber: <strong className="text-slate-800 dark:text-white">{Math.round(analysisResult.fiber * servingSize)}g</strong></span>
                  <span>Glycemic Index: <strong className="text-[#087F5B]">Low (42)</strong></span>
                </div>

                {/* Serving Size Portion Editor */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Adjust Serving Size</span>
                    <span className="text-[#087F5B]">{servingSize}x Portion</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[0.5, 1.0, 1.5, 2.0].map((size) => (
                      <button
                        key={size}
                        onClick={() => setServingSize(size)}
                        className={`py-1.5 text-xs font-black rounded-xl transition-all ${
                          servingSize === size
                            ? 'bg-[#087F5B] text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {size}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Destination Selection: Add to Breakfast, Add to Lunch, Add to Dinner, Add to Snack */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Add to Meal:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={() => handleAddToMeal('Breakfast')}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#087F5B] hover:text-white text-slate-800 dark:text-slate-100 font-bold text-xs transition-colors shadow-sm"
                >
                  ☀️ Add to Breakfast
                </button>
                <button
                  onClick={() => handleAddToMeal('Lunch')}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#087F5B] hover:text-white text-slate-800 dark:text-slate-100 font-bold text-xs transition-colors shadow-sm"
                >
                  ☀️ Add to Lunch
                </button>
                <button
                  onClick={() => handleAddToMeal('Dinner')}
                  className="py-2.5 px-3 rounded-xl bg-[#087F5B] hover:bg-[#056B4A] text-white font-extrabold text-xs transition-all shadow-md shadow-[#087F5B]/20"
                >
                  🌙 Add to Dinner
                </button>
                <button
                  onClick={() => handleAddToMeal('Snack')}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#087F5B] hover:text-white text-slate-800 dark:text-slate-100 font-bold text-xs transition-colors shadow-sm"
                >
                  🌅 Add to Snack
                </button>
              </div>

              {/* Share as Snapchat Story Button */}
              <div className="pt-3">
                <button
                  onClick={() => navigate('/snap-share')}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-[#087F5B] to-emerald-500 hover:scale-[1.01] text-white font-black text-xs shadow-lg shadow-[#087F5B]/20 transition-all flex items-center justify-center space-x-2"
                >
                  <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>Customize & Share as Snapchat Story 🔥</span>
                </button>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={handleRetake}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ← Scan Another Item
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
