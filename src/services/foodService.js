import { BARCODE_DATABASE } from '../data/mockMeals';

const FOOD_PRESETS = [
  {
    foodName: "Grilled Chicken Caesar Salad",
    calories: 420,
    protein: 38,
    carbs: 18,
    fat: 22,
    fiber: 5,
    servingSize: "1 Large Bowl (350g)",
    confidence: 94,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80"
  },
  {
    foodName: "Wild Salmon Quinoa & Avocado Plate",
    calories: 580,
    protein: 44,
    carbs: 48,
    fat: 24,
    fiber: 9,
    servingSize: "1 Plate (400g)",
    confidence: 97,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80"
  },
  {
    foodName: "Berry Smoothie Bowl & Granola",
    calories: 340,
    protein: 16,
    carbs: 58,
    fat: 8,
    fiber: 11,
    servingSize: "1 Bowl (300g)",
    confidence: 91,
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=80"
  }
];

export const foodService = {
  // Simulate AI Food Scanning with 1.8s analysis delay
  async scanFoodImage(imageDataUrl) {
    await new Promise((res) => setTimeout(res, 1800));

    // Pick random preset or customized mock response
    const randomIndex = Math.floor(Math.random() * FOOD_PRESETS.length);
    const result = FOOD_PRESETS[randomIndex];

    return {
      ...result,
      previewUrl: imageDataUrl || result.image
    };
  },

  // Voice natural language parser simulator
  async parseVoiceMeal(transcript) {
    await new Promise((res) => setTimeout(res, 1200));

    const text = transcript.toLowerCase();
    let calories = 350;
    let protein = 25;
    let carbs = 30;
    let fat = 12;
    let items = [];

    if (text.includes("egg")) {
      items.push("Eggs × 2");
      calories += 140;
      protein += 12;
    }
    if (text.includes("banana")) {
      items.push("Banana × 1");
      calories += 105;
      carbs += 27;
    }
    if (text.includes("milk")) {
      items.push("Whole Milk × 1 Glass");
      calories += 150;
      protein += 8;
      fat += 8;
    }
    if (text.includes("chicken")) {
      items.push("Grilled Chicken Breast × 150g");
      calories += 240;
      protein += 32;
    }
    if (items.length === 0) {
      items = ["Mixed Meal Log", "Natural Language Entry"];
    }

    return {
      summaryItems: items,
      foodName: items.join(", "),
      calories,
      protein,
      carbs,
      fat,
      fiber: 4,
      confidence: 95
    };
  },

  // Barcode Lookup Service
  async scanBarcode(barcodeString) {
    await new Promise((res) => setTimeout(res, 1000));
    
    const cleanCode = barcodeString.trim();
    if (BARCODE_DATABASE[cleanCode]) {
      return BARCODE_DATABASE[cleanCode];
    }

    // Dynamic mock for unrecognized barcode
    return {
      barcode: cleanCode,
      name: `Nutritional Product (#${cleanCode.slice(-4)})`,
      brand: "SnapFit Verified Product",
      servingSize: "1 Serving (100g)",
      calories: 210,
      protein: 15,
      carbs: 22,
      fat: 7,
      fiber: 3,
      ingredients: "Whole grain oats, whey isolate, stevia, almonds",
      nutritionGrade: "A",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80"
    };
  }
};
