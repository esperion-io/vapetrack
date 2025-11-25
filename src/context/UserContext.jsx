import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
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
      xp: 0
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

  useEffect(() => {
    localStorage.setItem('vapetrack_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('vapetrack_logs', JSON.stringify(logs));
    checkBadges(logs);
    checkDailyXP(logs); // Check if we need to award XP
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
    // XP is now calculated at end of day, not per puff
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

  const clearData = () => {
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
      xp: 0
    });
    setLogs([]);
    setBadges([]);
    setJuicePurchases([]);
    setPurchasedRewards([]);
    setEquippedRewards({ icon: null, border: null, effect: null });
    setLastXPCalculation(null);
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
      onboardUser,
      updateUser,
      addLog,
      updateJuiceLevel,
      addJuicePurchase,
      purchaseReward,
      equipReward,
      unequipReward,
      clearData
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
