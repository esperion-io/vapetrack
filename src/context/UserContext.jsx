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

  // XP is now part of user object, but we keep this for backward compatibility if needed
  const xp = user.xp || 0;

  useEffect(() => {
    localStorage.setItem('vapetrack_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('vapetrack_logs', JSON.stringify(logs));
    checkBadges(logs);
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('vapetrack_badges', JSON.stringify(badges));
  }, [badges]);

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

    // XP Logic: 10 XP per puff
    setUser(prev => ({ ...prev, xp: (prev.xp || 0) + 10 }));
  };

  const updateJuiceLevel = (newLevel) => {
    const diff = user.juiceLevel - newLevel;
    if (diff > 0) {
      // Calculate puffs based on 300 puffs per ml
      const mlUsed = (diff / 100) * user.bottleSize;
      const puffsToAdd = Math.round(mlUsed * 300);

      // Add multiple logs
      const newLogs = Array.from({ length: puffsToAdd }).map(() => ({
        timestamp: new Date().toISOString()
      }));

      setLogs(prev => [...prev, ...newLogs]);
      setUser(prev => ({
        ...prev,
        juiceLevel: newLevel,
        xp: (prev.xp || 0) + (puffsToAdd * 10)
      }));
    } else {
      // Just update level (e.g. refilling)
      setUser(prev => ({ ...prev, juiceLevel: newLevel }));
    }
  };

  const checkBadges = (currentLogs) => {
    const newBadges = [...badges];

    if (currentLogs.length >= 1 && !newBadges.includes('first_step')) {
      newBadges.push('first_step');
    }
    if (currentLogs.length >= 100 && !newBadges.includes('century_club')) {
      newBadges.push('century_club');
    }

    if (newBadges.length > badges.length) {
      setBadges(newBadges);
    }
  };

  const clearData = () => {
    localStorage.removeItem('vapetrack_user');
    localStorage.removeItem('vapetrack_logs');
    localStorage.removeItem('vapetrack_badges');
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
  };

  return (
    <UserContext.Provider value={{ user, logs, badges, xp, onboardUser, updateUser, addLog, updateJuiceLevel, clearData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
