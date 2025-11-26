import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vapetrack_user');
    return saved ? JSON.parse(saved) : {
      name: 'Guest User',
      email: '',
      onboardedAt: null,
      cigarettesPerDay: 10,
      cigarettesPerPack: 20,
      packCost: 15,
      currentVape: null,
      vapeDetails: {
        size: 0,
        nicotine: 0,
        type: 'Pod',
        cost: 0
      },
      juiceLevel: 100,
      bottleSize: 2,
      xp: 0,
      isSmokeFree: false,
      smokeFreeStartTime: null
    };
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('vapetrack_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [badges, setBadges] = useState(() => {
    const saved = localStorage.getItem('vapetrack_badges');
    return saved ? JSON.parse(saved) : [];
  });

  const [juicePurchases, setJuicePurchases] = useState(() => {
    const saved = localStorage.getItem('vapetrack_juice_purchases');
    return saved ? JSON.parse(saved) : [];
  });

  const [purchasedRewards, setPurchasedRewards] = useState(() => {
    const saved = localStorage.getItem('vapetrack_purchased_rewards');
    return saved ? JSON.parse(saved) : [];
  });

  const [equippedRewards, setEquippedRewards] = useState(() => {
    const saved = localStorage.getItem('vapetrack_equipped_rewards');
    return saved ? JSON.parse(saved) : {
      icon: null,
      border: null,
      effect: null
    };
  });

  const [lastXPCalculation, setLastXPCalculation] = useState(() => {
    const saved = localStorage.getItem('vapetrack_last_xp_calc');
    return saved ? saved : null;
  });

  // XP is now part of user object, but we keep this for backward compatibility if needed
  const xp = user.xp || 0;

  // Supabase Auth & Sync
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadUserData(session.user.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadUserData(session.user.id);
      } else {
        // Optional: Clear data on sign out or keep local?
        // For now, we keep local data to avoid jarring resets, 
        // or we could trigger clearData() if we want strict separation.
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId) => {
    try {
      // Get the current session to access user email
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const userEmail = currentSession?.user?.email || '';

      // 1. Fetch Profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile && profile.data) {
        // Profile exists, load it and merge with email from auth
        setUser(prev => ({
          ...prev,
          ...profile.data,
          email: userEmail,
          name: profile.data.name || profile.username || prev.name
        }));
        // If profile has other jsonb fields, load them
        if (profile.settings) {
          // Load settings if any
        }
      } else if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it from current user state + auth email
        const newProfile = {
          ...user,
          email: userEmail
        };
        setUser(prev => ({ ...prev, email: userEmail }));
        await syncUserToSupabase(newProfile, userId);
      }

      // 2. Fetch Logs
      const { data: remoteLogs, error: logsError } = await supabase
        .from('logs')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: true });

      if (remoteLogs && remoteLogs.length > 0) {
        setLogs(remoteLogs);
      }

      // 3. Fetch Rewards/Purchases (assuming stored in profile.data or separate table)
      // For MVP, we'll assume they are part of the profile 'data' JSONB column or similar
      // If we want to be robust, we should have tables. 
      // For now, let's stick to syncing the main user object which contains XP.

    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const syncUserToSupabase = async (userData, userId = session?.user?.id) => {
    if (!userId) return;
    try {
      const updates = {
        id: userId,
        username: userData.name,
        email: userData.email,
        data: userData, // Store full user object as JSONB
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
    } catch (error) {
      console.error('Error syncing user:', error);
    }
  };

  const syncLogToSupabase = async (log, enrichedData = {}) => {
    if (!session?.user?.id) return;
    try {
      // Get device type
      const getDeviceType = () => {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
          return 'tablet';
        }
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
          return 'mobile';
        }
        return 'desktop';
      };

      // Calculate time since last puff
      const timeSinceLastPuff = logs.length > 0
        ? new Date(log.timestamp) - new Date(logs[logs.length - 1].timestamp)
        : null;

      // Get current day and hour
      const logDate = new Date(log.timestamp);
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      // Count today's puffs
      const today = new Date();
      const todayPuffs = logs.filter(l => {
        const d = new Date(l.timestamp);
        return d.toDateString() === today.toDateString();
      }).length + 1; // +1 for current puff

      const enrichedLog = {
        user_id: session.user.id,
        timestamp: log.timestamp,
        type: enrichedData.type || 'puff',

        // Vape context
        vape_name: user.currentVape?.name || null,
        vape_nicotine: user.currentVape?.nicotine || null,
        juice_level_before: enrichedData.juice_level_before || user.juiceLevel,
        juice_level_after: enrichedData.juice_level_after || user.juiceLevel,

        // Session context
        day_of_week: daysOfWeek[logDate.getDay()],
        hour_of_day: logDate.getHours(),
        time_since_last_puff_ms: timeSinceLastPuff,

        // User state
        user_xp: user.xp || 0,
        daily_puff_count: todayPuffs,
        streak_days: enrichedData.streak_days || 0,

        // Device info
        user_agent: navigator.userAgent,
        device_type: getDeviceType(),

        // Additional metadata
        metadata: enrichedData.metadata || {}
      };

      const { error } = await supabase.from('logs').insert([enrichedLog]);
      if (error) throw error;
    } catch (error) {
      console.error('Error syncing log:', error);
    }
  };

  // Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem('vapetrack_user', JSON.stringify(user));
    if (session) syncUserToSupabase(user);
  }, [user, session]);

  useEffect(() => {
    localStorage.setItem('vapetrack_logs', JSON.stringify(logs));
    checkBadges(logs);
    checkDailyXP(logs);
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('vapetrack_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('vapetrack_juice_purchases', JSON.stringify(juicePurchases));
  }, [juicePurchases]);

  useEffect(() => {
    localStorage.setItem('vapetrack_purchased_rewards', JSON.stringify(purchasedRewards));
  }, [purchasedRewards]);

  useEffect(() => {
    localStorage.setItem('vapetrack_equipped_rewards', JSON.stringify(equippedRewards));
  }, [equippedRewards]);

  useEffect(() => {
    if (lastXPCalculation) {
      localStorage.setItem('vapetrack_last_xp_calc', lastXPCalculation);
    }
  }, [lastXPCalculation]);

  const checkDailyXP = (currentLogs) => {
    const now = new Date();
    const today = now.toDateString();

    // Only calculate once per day
    if (lastXPCalculation === today) return;

    // Get yesterday's logs
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayLogs = currentLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate.toDateString() === yesterday.toDateString();
    });

    if (yesterdayLogs.length === 0) return;

    // Calculate nicotine equivalence
    const PUFFS_PER_ML = 150;
    const ABSORBED_NICOTINE_PER_CIGARETTE = 2;
    const VAPE_ABSORPTION_RATE = 0.5;
    const vapeNicotine = Number(user?.currentVape?.nicotine) || 20;
    const nicotineContentPerPuff = vapeNicotine / PUFFS_PER_ML;
    const absorbedNicotinePerPuff = nicotineContentPerPuff * VAPE_ABSORPTION_RATE;
    const PUFFS_PER_CIGARETTE = Math.round(ABSORBED_NICOTINE_PER_CIGARETTE / absorbedNicotinePerPuff);
    const oldDailyNicotinePuffs = (user?.cigarettesPerDay || 10) * PUFFS_PER_CIGARETTE;

    const percentage = (yesterdayLogs.length / oldDailyNicotinePuffs) * 100;

    // Award XP if under 100%
    if (percentage < 100) {
      const reduction = 100 - percentage; // e.g., 30% reduction
      const xpEarned = Math.round(reduction * 10); // 10 XP per % below old habit
      setUser(prev => ({ ...prev, xp: (prev.xp || 0) + xpEarned }));
      setLastXPCalculation(today);
    } else {
      setLastXPCalculation(today);
    }
  };

  const onboardUser = (data) => {
    setUser(prev => ({
      ...prev,
      ...data,
      onboardedAt: new Date().toISOString(),
    }));
  };

  const updateUser = (newData) => {
    setUser(prev => ({ ...prev, ...newData }));
  };

  const addLog = () => {
    const newLog = { timestamp: new Date().toISOString() };
    setLogs(prev => [...prev, newLog]);
    if (session) syncLogToSupabase(newLog);

    // Revert smoke-free status if user logs a vape
    if (user.isSmokeFree) {
      setUser(prev => ({ ...prev, isSmokeFree: false, smokeFreeStartTime: null }));
    }
  };

  const toggleSmokeFree = () => {
    setUser(prev => ({
      ...prev,
      isSmokeFree: !prev.isSmokeFree,
      smokeFreeStartTime: !prev.isSmokeFree ? new Date().toISOString() : null
    }));
  };


  const updateJuiceLevel = (newLevel) => {
    const diff = user.juiceLevel - newLevel;
    if (diff > 0) {
      // Calculate puffs based on 300 puffs per ml
      const mlUsed = (diff / 100) * user.bottleSize;
      const puffsToAdd = Math.round(mlUsed * 300);

      // Add logs for estimated puffs
      const newLogs = Array.from({ length: puffsToAdd }, () => ({
        timestamp: new Date().toISOString()
      }));
      setLogs(prev => [...prev, ...newLogs]);

      // Sync new logs to Supabase
      if (session) {
        newLogs.forEach(log => syncLogToSupabase(log));
      }

      // Update XP
      setUser(prev => ({ ...prev, xp: (prev.xp || 0) + (puffsToAdd * 10) }));
    }

    // Update juice level
    setUser(prev => ({ ...prev, juiceLevel: newLevel }));
  };

  const addJuicePurchase = () => {
    const newPurchase = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      puffsSinceLast: 0 // Will be calculated
    };

    // Calculate puffs since last purchase
    if (juicePurchases.length > 0) {
      const lastPurchase = juicePurchases[juicePurchases.length - 1];
      const lastPurchaseDate = new Date(lastPurchase.timestamp);
      const puffsSince = logs.filter(log => new Date(log.timestamp) > lastPurchaseDate).length;
      newPurchase.puffsSinceLast = puffsSince;
    } else {
      // First purchase - count all puffs
      newPurchase.puffsSinceLast = logs.length;
    }

    setJuicePurchases(prev => [...prev, newPurchase]);

    // Log juice purchase to Supabase
    if (session) {
      syncLogToSupabase(
        { timestamp: newPurchase.timestamp },
        {
          type: 'juice_purchase',
          metadata: {
            puffs_since_last: newPurchase.puffsSinceLast,
            bottle_size: user.bottleSize,
            vape_cost: user.currentVape?.cost
          }
        }
      );
    }
  };

  const checkBadges = (currentLogs) => {
    const newBadges = [];
    if (currentLogs.length >= 1 && !badges.includes('first_step')) newBadges.push('first_step');
    if (currentLogs.length >= 100 && !badges.includes('century_club')) newBadges.push('century_club');
    if (newBadges.length > 0) {
      setBadges(prev => [...prev, ...newBadges]);
    }
  };

  const purchaseReward = (rewardId, cost) => {
    if (user.xp >= cost && !purchasedRewards.includes(rewardId)) {
      setUser(prev => ({ ...prev, xp: prev.xp - cost }));
      setPurchasedRewards(prev => [...prev, rewardId]);
      return true;
    }
    return false;
  };

  const equipReward = (rewardId, category) => {
    if (purchasedRewards.includes(rewardId)) {
      setEquippedRewards(prev => ({
        ...prev,
        [category]: rewardId
      }));
      return true;
    }
    return false;
  };

  const unequipReward = (category) => {
    setEquippedRewards(prev => ({
      ...prev,
      [category]: null
    }));
  };

  const clearData = async () => {
    if (session) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('vapetrack_user');
    localStorage.removeItem('vapetrack_logs');
    localStorage.removeItem('vapetrack_badges');
    localStorage.removeItem('vapetrack_juice_purchases');
    localStorage.removeItem('vapetrack_purchased_rewards');
    localStorage.removeItem('vapetrack_equipped_rewards');
    localStorage.removeItem('vapetrack_last_xp_calc');
    setUser({
      name: 'Guest User',
      email: '',
      onboardedAt: null,
      cigarettesPerDay: 10,
      cigarettesPerPack: 20,
      packCost: 15,
      currentVape: null,
      juiceLevel: 100,
      bottleSize: 2,
      xp: 0,
      isSmokeFree: false,
      smokeFreeStartTime: null
    });
    setLogs([]);
    setBadges([]);
    setJuicePurchases([]);
    setPurchasedRewards([]);
    setEquippedRewards({ icon: null, border: null, effect: null });
    setLastXPCalculation(null);
  };

  // Auth functions
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password, username) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: window.location.origin
        }
      });

      if (error) throw error;

      // Update local user state with username and email immediately
      if (data.user) {
        setUser(prev => ({
          ...prev,
          name: username,
          email: email
        }));

        // Create initial profile
        const profileData = { ...user, name: username, email: email };
        await syncUserToSupabase(profileData, data.user.id);
      }

      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    clearData();
  };

  return (
    <UserContext.Provider value={{
      user,
      logs,
      badges,
      xp,
      juicePurchases,
      purchasedRewards,
      equippedRewards,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      onboardUser,
      updateUser,
      addLog,
      updateJuiceLevel,
      addJuicePurchase,
      purchaseReward,
      equipReward,
      unequipReward,
      toggleSmokeFree,
      clearData
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
