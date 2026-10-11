import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

const safeJsonParse = (key, fallback = null) => {
  const item = localStorage.getItem(key);
  if (!item) return fallback;
  try {
    return JSON.parse(item);
  } catch (e) {
    return fallback;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [onboardingCompleted, setOnboardingCompleted] = useState(
    () => localStorage.getItem('onboardingCompleted') === 'true'
  );
  const [profile, setProfile] = useState(() => safeJsonParse('profile', null));
  const [routine, setRoutine] = useState(() => safeJsonParse('routine', null));
  const [mealTimes, setMealTimes] = useState(() => safeJsonParse('mealTimes', null));
  const [activityLevel, setActivityLevel] = useState(() => safeJsonParse('activityLevel', null));
  const [loading, setLoading] = useState(false);

  // Sync state if localStorage changes or on mount
  useEffect(() => {
    const logged = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(logged);
    if (!logged) {
      setUser(null);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      setIsLoggedIn(true);
      const isCompleted = localStorage.getItem('onboardingCompleted') === 'true';
      setOnboardingCompleted(isCompleted);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, goal = 'Build Muscle', extraProfile = {}) => {
    setLoading(true);
    try {
      const data = await authService.register(name, email, password, goal, extraProfile);
      // Notice: We DO NOT set user as logged in yet.
      // Flow requires user to log in next.
      return data;
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = (onboardingData) => {
    const {
      profile: newProfile,
      routine: newRoutine,
      mealTimes: newMealTimes,
      activityLevel: newActivityLevel
    } = onboardingData;

    if (newProfile) {
      setProfile(newProfile);
      localStorage.setItem('profile', JSON.stringify(newProfile));
    }
    if (newRoutine) {
      setRoutine(newRoutine);
      localStorage.setItem('routine', JSON.stringify(newRoutine));
    }
    if (newMealTimes) {
      setMealTimes(newMealTimes);
      localStorage.setItem('mealTimes', JSON.stringify(newMealTimes));
    }
    if (newActivityLevel) {
      setActivityLevel(newActivityLevel);
      localStorage.setItem('activityLevel', JSON.stringify(newActivityLevel));
    }

    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('isLoggedIn', 'true');
    setOnboardingCompleted(true);
    setIsLoggedIn(true);

    // Also update current user profile if present
    setUser((prev) => {
      const updated = {
        ...(prev || {}),
        role: newProfile?.role || prev?.role || 'Student',
        goal: newProfile?.goal || prev?.goal || 'Build Muscle',
        gender: newProfile?.gender || prev?.gender || 'Male',
        activityLevel: newActivityLevel?.level || prev?.activityLevel || 'Moderate'
      };
      localStorage.setItem('user', JSON.stringify(updated));
      localStorage.setItem('snapfit_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('snapfit_user', JSON.stringify(updated));
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        onboardingCompleted,
        profile,
        routine,
        mealTimes,
        activityLevel,
        loading,
        login,
        register,
        completeOnboarding,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
