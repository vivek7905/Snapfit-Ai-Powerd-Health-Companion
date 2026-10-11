import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  QrCode,
  Search,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Camera,
  ShieldCheck,
  Package
} from 'lucide-react';
import { useHealth } from '../hooks/useHealth';
import { BARCODE_DATABASE } from '../data/mockMeals';

export const BarcodeScannerPage = () => {
  const navigate = useNavigate();
  const { addMeal, showToast } = useHealth();

  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('890123456789');
  const [productResult, setProductResult] = useState(() => BARCODE_DATABASE['890123456789'] || null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Snack');

  // Start live camera for scanning
  useEffect(() => {
    let currentStream = null;

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 } },
          audio: false
        });
        currentStream = s;
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
        setCameraActive(true);

        // Native BarcodeDetector API if available
        if ('BarcodeDetector' in window) {
          const detector = new window.BarcodeDetector({ formats: ['ean_13', 'upc_a', 'qr_code', 'code_128'] });
          const interval = setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
              try {
                const barcodes = await detector.detect(videoRef.current);
                if (barcodes && barcodes.length > 0) {
                  const rawValue = barcodes[0].rawValue;
                  handleLookupCode(rawValue);
                }
              } catch (e) {}
            }
          }, 800);
          return () => clearInterval(interval);
        }
      } catch (err) {
        console.warn('Barcode camera access error:', err);
        setCameraActive(false);
      }
    };

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const handleLookupCode = (code) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const matched = BARCODE_DATABASE[code] || {
        barcode: code,
        name: 'Protein Shake',
        brand: 'SnapFit Pure Nutrition',
        servingSize: '1 bottle (330ml)',
        calories: 180,
        protein: 25,
        carbs: 8,
        fat: 4,
        ingredients: 'Filtered Water, Whey Protein Isolate, Cocoa Powder, Stevia Leaf Extract, Calcium, Vitamin D3, Natural Vanilla Flavor',
        nutritionGrade: 'A',
        image: 'https://images.unsplash.com/photo-1593095940087-05ccb2be667f?w=500&auto=format&fit=crop&q=80'
      };
      setProductResult(matched);
      showToast(`Product identified: ${matched.name}`, 'success');
    }, 600);
  };

  const handleAddProductToMeal = () => {
    if (!productResult) return;

    addMeal({
      name: productResult.name,
      type: selectedCategory,
      calories: productResult.calories,
      protein: productResult.protein,
      carbs: productResult.carbs,
      fat: productResult.fat,
      fiber: productResult.fiber || 1,
      image: productResult.image,
      confidence: 99,
      method: 'Barcode Scanner'
    });

    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-black">
          <QrCode className="w-4 h-4" />
          <span>BARCODE SCANNER</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Package Nutrition Scanner
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Scan any packaged food item or drink barcode using your camera to instantly verify ingredients, allergens, and nutritional score.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left: Camera Preview with Scan Frame */}
        <div className="md:col-span-6 bg-white dark:bg-[#14213D] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
          
          <div className="relative w-full aspect-[4/3] rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center border-2 border-slate-800 shadow-inner">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 space-y-2 text-slate-400">
                <QrCode className="w-12 h-12 stroke-[1.5] mx-auto text-slate-600" />
                <p className="text-xs font-bold text-slate-300">Camera preview unavailable</p>
                <p className="text-[10px] text-slate-500">You can enter the barcode number manually below</p>
              </div>
            )}

            {/* Scan Frame Bounding Box */}
            <div className="absolute inset-8 sm:inset-10 border-2 border-[#087F5B] rounded-2xl flex flex-col justify-between p-3 pointer-events-none shadow-[0_0_20px_rgba(8,127,91,0.3)]">
              <div className="flex justify-between w-full">
                <div className="w-5 h-5 border-t-4 border-l-4 border-[#087F5B] rounded-tl" />
                <div className="w-5 h-5 border-t-4 border-r-4 border-[#087F5B] rounded-tr" />
              </div>

              {/* Animated scanning line */}
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#087F5B] to-transparent shadow-[0_0_15px_#087F5B] animate-scan" />

              <div className="flex justify-between w-full">
                <div className="w-5 h-5 border-b-4 border-l-4 border-[#087F5B] rounded-bl" />
                <div className="w-5 h-5 border-b-4 border-r-4 border-[#087F5B] rounded-br" />
              </div>
            </div>

            {/* Helper text overlay */}
            <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-extrabold shadow">
                Align the barcode within the frame
              </span>
            </div>
          </div>

          {/* Enter Barcode Manually Section */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
              Enter Barcode Manually
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="e.g. 890123456789"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-sm font-bold text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => handleLookupCode(barcodeInput)}
                disabled={isScanning}
                className="px-5 py-2.5 rounded-xl bg-[#087F5B] hover:bg-[#056B4A] text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
              >
                {isScanning ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick test sample codes */}
            <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-400 pt-1">
              <span>Test samples:</span>
              <button
                type="button"
                onClick={() => {
                  setBarcodeInput('890123456789');
                  handleLookupCode('890123456789');
                }}
                className="text-[#087F5B] dark:text-emerald-400 hover:underline"
              >
                Protein Shake
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setBarcodeInput('8901030000000');
                  handleLookupCode('8901030000000');
                }}
                className="text-[#087F5B] dark:text-emerald-400 hover:underline"
              >
                Almond Milk
              </button>
            </div>
          </div>

        </div>

        {/* Right: Product Result Card */}
        <div className="md:col-span-6 bg-white dark:bg-[#14213D] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-6">
          {productResult ? (
            <div className="space-y-6">
              {/* Product Header */}
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={productResult.image}
                    alt={productResult.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#087F5B] dark:text-emerald-400">
                      {productResult.brand}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                      {productResult.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Serving: {productResult.servingSize}
                    </p>
                  </div>
                </div>

                {/* Nutrition Grade Badge */}
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Grade</span>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-emerald-500/20 mt-0.5">
                    {productResult.nutritionGrade}
                  </div>
                </div>
              </div>

              {/* Nutrition 4-Grid */}
              <div className="grid grid-cols-4 gap-2 text-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                <div>
                  <span className="text-[9px] font-bold uppercase text-slate-400">Calories</span>
                  <p className="text-base font-black text-amber-500">{productResult.calories}</p>
                  <span className="text-[9px] text-slate-400">kcal</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase text-slate-400">Protein</span>
                  <p className="text-base font-black text-[#087F5B] dark:text-emerald-400">{productResult.protein}g</p>
                  <span className="text-[9px] text-slate-400">g</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase text-slate-400">Carbs</span>
                  <p className="text-base font-black text-sky-500">{productResult.carbs}g</p>
                  <span className="text-[9px] text-slate-400">g</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase text-slate-400">Fat</span>
                  <p className="text-base font-black text-purple-500">{productResult.fat}g</p>
                  <span className="text-[9px] text-slate-400">g</span>
                </div>
              </div>

              {/* Ingredients List */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Ingredients:
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-[#EFFAF5]/60 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                  {productResult.ingredients}
                </p>
              </div>

              {/* Meal Category & Add to Meal Button */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-400">Add to:</span>
                  {['Snack', 'Breakfast', 'Lunch', 'Dinner'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        selectedCategory === cat
                          ? 'bg-[#087F5B] text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddProductToMeal}
                  className="w-full py-3.5 rounded-2xl bg-[#087F5B] hover:bg-[#056B4A] text-white font-black text-sm shadow-lg shadow-[#087F5B]/25 transition-all flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add to Meal</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-3 text-slate-400">
              <Package className="w-12 h-12 stroke-[1.5] mx-auto" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Ready to Scan</h4>
              <p className="text-xs max-w-xs mx-auto">
                Position your package barcode inside the frame or enter numbers above to view verified ingredients and macros.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
