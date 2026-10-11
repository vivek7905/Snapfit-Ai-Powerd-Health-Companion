import React, { createContext, useState, useEffect } from 'react';
import { INITIAL_MEALS } from '../data/mockMeals';
import { MOCK_USER_TARGETS } from '../data/mockNutrition';
import { calculateTotals, calculateHealthScore, getHealthScoreDetails } from '../utils/nutritionCalculator';

export const HealthContext = createContext();

export const HealthProvider = ({ children }) => {
  // Meals state with LocalStorage fallback
  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem('snapfit_meals');
    return saved ? JSON.parse(saved) : INITIAL_MEALS;
  });

  // Water intake in glasses & liters
  const [waterGlasses, setWaterGlasses] = useState(() => {
    const saved = localStorage.getItem('snapfit_water_glasses');
    return saved ? parseInt(saved, 10) : 6;
  });

  const [activityMinutes, setActivityMinutes] = useState(() => {
    const saved = localStorage.getItem('snapfit_activity_minutes');
    return saved ? parseInt(saved, 10) : 30;
  });

  // Fit Points Gamification (650 pts, 5 day streak)
  const [fitPoints, setFitPoints] = useState(() => {
    const saved = localStorage.getItem('snapfit_fit_points');
    return saved ? parseInt(saved, 10) : 650;
  });

  const [streakDays, setStreakDays] = useState(5);
  const [level, setLevel] = useState(3);
  const [isPro, setIsPro] = useState(() => {
    return localStorage.getItem('snapfit_pro') === 'true';
  });

  const [redeemedRewards, setRedeemedRewards] = useState(() => {
    const saved = localStorage.getItem('snapfit_redeemed_rewards');
    return saved ? JSON.parse(saved) : [];
  });

  // Shared Snapchat Food Snaps
  const [sharedSnaps, setSharedSnaps] = useState(() => {
    const saved = localStorage.getItem('snapfit_shared_snaps');
    return saved ? JSON.parse(saved) : [];
  });

  // Targets state
  const [targets, setTargets] = useState(() => {
    const saved = localStorage.getItem('snapfit_targets');
    return saved ? JSON.parse(saved) : MOCK_USER_TARGETS;
  });

  // Toast notifications state
  const [toast, setToast] = useState(null);

  // Notifications drawer items
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your protein intake is below today's target.", type: "warning", read: false, time: "10 mins ago" },
    { id: 2, message: "You're on a 5-day healthy streak! Keep it up!", type: "success", read: false, time: "2 hours ago" },
    { id: 3, message: "Time to drink some water (Target: 8 glasses).", type: "info", read: false, time: "4 hours ago" },
    { id: 4, message: "Your health score improved by 6 points today!", type: "success", read: true, time: "Yesterday" }
  ]);

  useEffect(() => {
    localStorage.setItem('snapfit_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('snapfit_water_glasses', waterGlasses.toString());
  }, [waterGlasses]);

  useEffect(() => {
    localStorage.setItem('snapfit_activity_minutes', activityMinutes.toString());
  }, [activityMinutes]);

  useEffect(() => {
    localStorage.setItem('snapfit_fit_points', fitPoints.toString());
  }, [fitPoints]);

  useEffect(() => {
    localStorage.setItem('snapfit_redeemed_rewards', JSON.stringify(redeemedRewards));
  }, [redeemedRewards]);

  useEffect(() => {
    localStorage.setItem('snapfit_shared_snaps', JSON.stringify(sharedSnaps));
  }, [sharedSnaps]);

  useEffect(() => {
    localStorage.setItem('snapfit_targets', JSON.stringify(targets));
  }, [targets]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const sendFoodSnap = (snapData, recipientNames = []) => {
    const newSnap = {
      id: `snap-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recipients: recipientNames,
      createdAt: new Date().toISOString(),
      ...snapData
    };

    setSharedSnaps((prev) => [newSnap, ...prev]);
    setFitPoints((prev) => prev + 25);
    const recipientText = recipientNames.length > 0 
      ? ` to ${recipientNames.slice(0, 2).join(', ')}${recipientNames.length > 2 ? ` and ${recipientNames.length - 2} others` : ''}`
      : '';
    showToast(`Snap Sent! 🔥${recipientText} (+25 Fit Points earned)`, 'success');
    return newSnap;
  };

  const addMeal = (newMeal) => {
    const mealWithId = {
      id: `m-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " Today",
      date: new Date().toISOString().split('T')[0],
      icon: newMeal.type === 'Breakfast' ? '☀️' : newMeal.type === 'Lunch' ? '☀️' : newMeal.type === 'Dinner' ? '🌙' : '🌅',
      ...newMeal
    };

    setMeals((prev) => [mealWithId, ...prev]);
    setFitPoints((prev) => prev + 50);
    showToast(`Added "${mealWithId.name}" to today's log (+50 Fit Points)`, 'success');
  };

  const deleteMeal = (id) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    showToast('Meal removed from logs', 'info');
  };

  const updateWaterGlasses = (amount) => {
    setWaterGlasses((prev) => Math.max(0, Math.min(16, prev + amount)));
    if (amount > 0) {
      showToast(`+${amount} glass of water logged (Total: ${waterGlasses + amount}/8)`, 'info');
      setFitPoints((prev) => prev + 10);
    }
  };

  const updateActivityMinutes = (amount) => {
    setActivityMinutes((prev) => Math.max(0, prev + amount));
    if (amount > 0) {
      showToast(`+${amount} min workout logged!`, 'success');
      setFitPoints((prev) => prev + 25);
    }
  };

  const redeemReward = (reward) => {
    if (fitPoints < reward.points) {
      showToast(`Not enough Fit Points! You need ${reward.points - fitPoints} more points.`, 'error');
      return false;
    }

    setFitPoints((prev) => prev - reward.points);
    const voucherCode = `SNAP-${reward.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const redeemedItem = {
      ...reward,
      voucherCode,
      redeemedAt: new Date().toLocaleDateString()
    };
    setRedeemedRewards((prev) => [redeemedItem, ...prev]);
    showToast(`🎉 Redeemed "${reward.title}"! Voucher code: ${voucherCode}`, 'success');
    return voucherCode;
  };

  const upgradeToPro = () => {
    setIsPro(true);
    localStorage.setItem('snapfit_pro', 'true');
    showToast('🎉 Welcome to SnapFit Pro! All premium AI features unlocked.', 'success');
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('All notifications cleared', 'info');
  };

  const totals = calculateTotals(meals);
  // Comprehensive health score details
  const healthScoreDetails = getHealthScoreDetails(
    totals,
    targets,
    waterGlasses * 0.25,
    activityMinutes,
    meals.length
  );
  const healthScore = healthScoreDetails.score;

  return (
    <HealthContext.Provider
      value={{
        meals,
        addMeal,
        deleteMeal,
        waterGlasses,
        updateWaterGlasses,
        activityMinutes,
        updateActivityMinutes,
        fitPoints,
        setFitPoints,
        streakDays,
        level,
        targets,
        setTargets,
        totals,
        healthScore,
        healthScoreDetails,
        sharedSnaps,
        sendFoodSnap,
        redeemReward,
        redeemedRewards,
        isPro,
        upgradeToPro,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        toast,
        showToast
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};
