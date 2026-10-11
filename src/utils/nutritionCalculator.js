/**
 * Calculate total daily macro sums from logged meals
 */
export function calculateTotals(meals = []) {
  return meals.reduce(
    (acc, meal) => {
      acc.calories += Number(meal.calories || 0);
      acc.protein += Number(meal.protein || 0);
      acc.carbs += Number(meal.carbs || 0);
      acc.fat += Number(meal.fat || 0);
      acc.fiber += Number(meal.fiber || 0);
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}

/**
 * Calculate dynamic overall health score (0 - 100) based on goals & current intake
 */
export function calculateHealthScore(totals, targets, waterLiters = 1.5) {
  const details = getHealthScoreDetails(totals, targets, waterLiters);
  return details.score;
}

/**
 * Detailed Health Score Breakdown & Tier Rating
 */
export function getHealthScoreDetails(
  totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  targets = { dailyCalories: 2000, proteinGrams: 80, waterGlasses: 8, waterLiters: 2.0, activityMinutes: 60 },
  waterLiters = 1.5,
  activityMinutes = 30,
  mealsCount = 3
) {
  if (!targets) {
    targets = { dailyCalories: 2000, proteinGrams: 80, waterGlasses: 8, waterLiters: 2.0, activityMinutes: 60 };
  }

  // 1. Calorie Accuracy Score (0 - 25 points)
  // Closer to target is better, penalize under/over eating
  const calTarget = targets.dailyCalories || 2000;
  const currentCal = totals.calories || 0;
  let calRatio = currentCal / calTarget;
  let calScore = 0;
  if (calRatio <= 1.0) {
    calScore = Math.round(calRatio * 25);
  } else {
    // Slight penalty if over target
    calScore = Math.max(10, Math.round(25 - (calRatio - 1.0) * 35));
  }

  // 2. Protein Target Score (0 - 25 points)
  const proteinTarget = targets.proteinGrams || 80;
  const currentProtein = totals.protein || 0;
  const proteinRatio = Math.min(currentProtein / proteinTarget, 1.2);
  let proteinScore = Math.min(25, Math.round(proteinRatio * 25));

  // 3. Hydration Score (0 - 20 points)
  const waterTarget = targets.waterLiters || 2.0;
  const currentWater = typeof waterLiters === 'number' ? waterLiters : 1.5;
  const waterRatio = Math.min(currentWater / waterTarget, 1.0);
  const waterScore = Math.round(waterRatio * 20);

  // 4. Activity & Exercise Score (0 - 15 points)
  const activityTarget = targets.activityMinutes || 60;
  const currentActivity = activityMinutes || 0;
  const activityRatio = Math.min(currentActivity / activityTarget, 1.0);
  const activityScore = Math.round(activityRatio * 15);

  // 5. Meal Consistency & Quality (0 - 15 points)
  const loggedMealsCount = mealsCount || 0;
  const consistencyScore = Math.min(15, loggedMealsCount >= 3 ? 15 : loggedMealsCount * 5);

  // Sum total score (0 - 100)
  const rawScore = calScore + proteinScore + waterScore + activityScore + consistencyScore;
  const score = Math.min(Math.max(rawScore, 10), 100);

  // Determine dynamic rating tier
  let rating = 'Needs Improvement';
  let badgeColor = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60';
  let ringColor = 'stroke-rose-500';
  let ringHex = '#F43F5E';
  let ratingDescription = 'Your nutritional intake needs attention today. Check out our AI recommendations!';

  if (score >= 90) {
    rating = 'Excellent';
    badgeColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60';
    ringColor = 'stroke-[#087F5B]';
    ringHex = '#087F5B';
    ratingDescription = 'Outstanding! You are hitting key macro, hydration, and activity milestones!';
  } else if (score >= 75) {
    rating = 'Good';
    badgeColor = 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/60';
    ringColor = 'stroke-teal-500';
    ringHex = '#14B8A6';
    ratingDescription = 'Strong progress! Just a few adjustments away from peak optimal nutrition.';
  } else if (score >= 50) {
    rating = 'Fair';
    badgeColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60';
    ringColor = 'stroke-amber-500';
    ringHex = '#F59E0B';
    ratingDescription = 'Solid foundation. Prioritize hydration and hitting your daily protein target.';
  }

  // Dynamic next step recommendation based on lowest component
  let actionableTip = 'Log your remaining meals to complete today’s nutrition score!';
  if (proteinScore < 18) {
    actionableTip = `Add ${Math.max(0, proteinTarget - currentProtein)}g more protein to reach the next tier!`;
  } else if (waterScore < 15) {
    actionableTip = `Drink ${Math.max(1, Math.round((waterTarget - currentWater) / 0.25))} more glasses of water to boost score by +5 pts.`;
  } else if (activityScore < 10) {
    actionableTip = `A quick 15-min walk will elevate your daily score!`;
  } else if (score >= 90) {
    actionableTip = 'You are crushing today’s targets! Share your food snap with friends 🔥';
  }

  // Categories breakdown
  const breakdown = [
    {
      id: 'calories',
      name: 'Calorie Accuracy',
      current: currentCal,
      target: calTarget,
      unit: 'kcal',
      score: calScore,
      max: 25,
      percentage: Math.min(100, Math.round((currentCal / calTarget) * 100)),
      status: calRatio >= 0.8 && calRatio <= 1.05 ? 'Optimal' : calRatio < 0.8 ? 'Under Target' : 'Over Target',
      color: 'bg-amber-500'
    },
    {
      id: 'protein',
      name: 'Protein Goal',
      current: currentProtein,
      target: proteinTarget,
      unit: 'g',
      score: proteinScore,
      max: 25,
      percentage: Math.min(100, Math.round((currentProtein / proteinTarget) * 100)),
      status: currentProtein >= proteinTarget ? 'Reached' : `${Math.max(0, proteinTarget - currentProtein)}g left`,
      color: 'bg-[#087F5B]'
    },
    {
      id: 'hydration',
      name: 'Hydration',
      current: Number(currentWater.toFixed(1)),
      target: waterTarget,
      unit: 'L',
      score: waterScore,
      max: 20,
      percentage: Math.min(100, Math.round((currentWater / waterTarget) * 100)),
      status: currentWater >= waterTarget ? 'Well Hydrated' : 'Needs Hydration',
      color: 'bg-sky-500'
    },
    {
      id: 'activity',
      name: 'Activity & Workout',
      current: currentActivity,
      target: activityTarget,
      unit: 'min',
      score: activityScore,
      max: 15,
      percentage: Math.min(100, Math.round((currentActivity / activityTarget) * 100)),
      status: currentActivity >= activityTarget ? 'Target Crushed' : 'In Progress',
      color: 'bg-purple-500'
    },
    {
      id: 'consistency',
      name: 'Meal Logging',
      current: loggedMealsCount,
      target: 3,
      unit: 'meals',
      score: consistencyScore,
      max: 15,
      percentage: Math.min(100, Math.round((loggedMealsCount / 3) * 100)),
      status: loggedMealsCount >= 3 ? 'Complete' : 'Keep Logging',
      color: 'bg-indigo-500'
    }
  ];

  return {
    score,
    rating,
    badgeColor,
    ringColor,
    ringHex,
    ratingDescription,
    actionableTip,
    breakdown,
    scores: {
      calorieScore: calScore,
      proteinScore,
      waterScore,
      activityScore,
      consistencyScore
    }
  };
}

/**
 * Calculate BMR & Recommended Macros based on user profile input
 */
export function calculateTargetMacros(weightKg, heightCm, age, goal, activityLevel) {
  // Mifflin-St Jeor Equation for BMR
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  
  let multiplier = 1.375;
  if (activityLevel.includes("Active")) multiplier = 1.55;
  if (activityLevel.includes("Very")) multiplier = 1.725;
  if (activityLevel.includes("Sedentary")) multiplier = 1.2;

  let tdee = bmr * multiplier;

  if (goal.includes("Lose")) tdee -= 400;
  if (goal.includes("Gain")) tdee += 350;

  const dailyCalories = Math.round(tdee);
  const proteinGrams = Math.round((dailyCalories * 0.30) / 4);
  const carbsGrams = Math.round((dailyCalories * 0.45) / 4);
  const fatGrams = Math.round((dailyCalories * 0.25) / 9);

  return {
    dailyCalories,
    proteinGrams,
    carbsGrams,
    fatGrams,
    waterLiters: 2.5
  };
}
