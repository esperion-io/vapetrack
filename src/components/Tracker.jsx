import { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { Wind, Clock, Droplet } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Tracker = () => {
    const { addLog, logs, user, updateJuiceLevel, juicePurchases, addJuicePurchase, equippedRewards } = useUser();
    const [timeSinceLastPuff, setTimeSinceLastPuff] = useState('No logs yet');
    const [mode, setMode] = useState('puff'); // 'puff' or 'juice'
    const [sliderValue, setSliderValue] = useState(user.juiceLevel || 100);
    const [isHolding, setIsHolding] = useState(false);
    const holdIntervalRef = useRef(null);
    const holdTimeoutRef = useRef(null);
    const [showEffect, setShowEffect] = useState(false);

    // Calculate nicotine equivalence (same as Dashboard)
    const PUFFS_PER_ML = 150;
    const ABSORBED_NICOTINE_PER_CIGARETTE = 2;
    const VAPE_ABSORPTION_RATE = 0.5;
    const vapeNicotine = Number(user?.currentVape?.nicotine) || 20;
    const nicotineContentPerPuff = vapeNicotine / PUFFS_PER_ML;
    const absorbedNicotinePerPuff = nicotineContentPerPuff * VAPE_ABSORPTION_RATE;
    const PUFFS_PER_CIGARETTE = Math.round(ABSORBED_NICOTINE_PER_CIGARETTE / absorbedNicotinePerPuff);

    // Old daily nicotine in puffs
    const oldDailyNicotinePuffs = (user?.cigarettesPerDay || 10) * PUFFS_PER_CIGARETTE;

    const todayLogs = logs.filter(log => {
        const date = new Date(log.timestamp);
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    });

    const puffCount = todayLogs.length;
    const progressPercentage = (puffCount / oldDailyNicotinePuffs) * 100;

    // Circular Progress Constants
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    // Cap the visual progress at 100% (one full circle) but show actual percentage in text
    const visualProgress = Math.min(progressPercentage, 100);
    const strokeDashoffset = circumference - (visualProgress / 100) * circumference;

    // Dynamic color based on percentage
    const getProgressColor = (pct) => {
        if (pct > 100) return '#ef4444'; // Red (danger)
        if (pct >= 50) {
            // Orange gradient from 50% to 100%
            // Interpolate between orange (#f59e0b) and red (#ef4444)
            const ratio = (pct - 50) / 50; // 0 to 1
            const r = Math.round(245 + (239 - 245) * ratio);
            const g = Math.round(158 - (158 - 68) * ratio);
            const b = Math.round(11 + (68 - 11) * ratio);
            return `rgb(${r}, ${g}, ${b})`;
        }
        // Green gradient from 0% to 50%
        // Interpolate between green (#10b981) and orange (#f59e0b)
        const ratio = pct / 50; // 0 to 1
        const r = Math.round(16 + (245 - 16) * ratio);
        const g = Math.round(185 - (185 - 158) * ratio);
        const b = Math.round(129 - (129 - 11) * ratio);
        return `rgb(${r}, ${g}, ${b})`;
    };

    const progressColor = getProgressColor(progressPercentage);

    useEffect(() => {
        if (logs.length === 0) return;

        const updateTime = () => {
            const lastLog = logs[logs.length - 1];
            setTimeSinceLastPuff(formatDistanceToNow(new Date(lastLog.timestamp), { addSuffix: true }));
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [logs]);

    // Sync slider with user state when switching back
    useEffect(() => {
        setSliderValue(user.juiceLevel || 100);
    }, [user.juiceLevel]);

    const handleJuiceUpdate = () => {
        updateJuiceLevel(parseInt(sliderValue));
    };

    const estimatedPuffs = () => {
        const diff = (user.juiceLevel || 100) - sliderValue;
        if (diff <= 0) return 0;
        return Math.round(((diff / 100) * (user.bottleSize || 2)) * 300);
    };

    // Hold-to-increment handlers
    const handleMouseDown = () => {
        setIsHolding(true);
        addLog(); // Log first puff immediately

        // Trigger visual effect
        if (equippedRewards.effect) {
            setShowEffect(true);
            setTimeout(() => setShowEffect(false), 1000);
        }

        // Start interval after 300ms delay
        holdTimeoutRef.current = setTimeout(() => {
            holdIntervalRef.current = setInterval(() => {
                addLog();
            }, 200); // Add a puff every 200ms while holding
        }, 300);
    };

    const handleMouseUp = () => {
        setIsHolding(false);

        // Clear timeout if it hasn't fired yet
        if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current);
            holdTimeoutRef.current = null;
        }

        // Clear interval if it's running
        if (holdIntervalRef.current) {
            clearInterval(holdIntervalRef.current);
            holdIntervalRef.current = null;
        }
    };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2rem' }}>

            {/* Header / Mode Switcher */}
            <div style={{ background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-lg)', display: 'flex', marginBottom: '2rem', border: '1px solid var(--bg-tertiary)' }}>
                <button
                    onClick={() => setMode('puff')}
                    style={{
                        padding: '8px 24px',
                        borderRadius: 'var(--radius-md)',
                        background: mode === 'puff' ? 'var(--primary)' : 'transparent',
                        color: mode === 'puff' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        boxShadow: mode === 'puff' ? '0 0 15px var(--primary-glow)' : 'none'
                    }}
                >
                    Tracker
                </button>
                <button
                    onClick={() => setMode('juice')}
                    style={{
                        padding: '8px 24px',
                        borderRadius: 'var(--radius-md)',
                        background: mode === 'juice' ? 'var(--primary)' : 'transparent',
                        color: mode === 'juice' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        boxShadow: mode === 'juice' ? '0 0 15px var(--primary-glow)' : 'none'
                    }}
                >
                    Juice
                </button>
            </div>

            {mode === 'puff' ? (
                <>
                    {/* Circular Progress Ring */}
                    <div style={{ position: 'relative', width: '240px', height: '240px', marginBottom: '3rem' }}>
                        {/* Glow Effect */}
                        <div style={{
                            position: 'absolute',
                            inset: '10px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(46,140,255,0.1) 0%, rgba(0,0,0,0) 70%)',
                            zIndex: 0
                        }} />

                        <svg width="240" height="240" style={{ transform: 'rotate(-90deg)' }}>
                            {/* Track */}
                            <circle
                                cx="120"
                                cy="120"
                                r={radius}
                                fill="transparent"
                                stroke="var(--bg-tertiary)"
                                strokeWidth="12"
                                strokeLinecap="round"
                            />
                            {/* Progress */}
                            <circle
                                cx="120"
                                cy="120"
                                r={radius}
                                fill="transparent"
                                stroke={progressColor}
                                strokeWidth="12"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease' }}
                                filter={`drop-shadow(0 0 8px ${progressColor})`}
                            />
                        </svg>

                        {/* Center Text */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            zIndex: 1
                        }}>
                            <div style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1, color: '#fff' }}>
                                {Math.round(progressPercentage)}%
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                                of old habit
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '4px', fontWeight: '600' }}>
                                {puffCount} puffs today
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', marginBottom: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '1.2rem', textAlign: 'center', background: 'linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Last Puff</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#fff' }}>
                                {timeSinceLastPuff.replace('less than a minute', 'Just now')}
                            </div>
                        </div>
                        <div className="glass-panel" style={{ padding: '1.2rem', textAlign: 'center', background: 'linear-gradient(145deg, var(--bg-secondary), var(--bg-primary))' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Daily Avg</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#fff' }}>
                                82 puffs
                            </div>
                        </div>
                    </div>

                    {/* Floating Action Button without effects */}
                    <button
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleMouseDown}
                        onTouchEnd={handleMouseUp}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), #0066CC)',
                            border: 'none',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: isHolding
                                ? '0 10px 40px var(--primary-glow), inset 0 2px 5px rgba(255,255,255,0.3)'
                                : '0 10px 30px var(--primary-glow), inset 0 2px 5px rgba(255,255,255,0.3)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s',
                            marginTop: 'auto',
                            marginBottom: '1rem',
                            transform: isHolding ? 'scale(0.9)' : 'scale(1)'
                        }}
                    >
                        <Wind size={32} strokeWidth={2.5} />
                    </button>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        {isHolding ? 'Logging...' : 'Tap or Hold to Log'}
                    </div>
                </>
            ) : (
                <div style={{ width: '100%' }}>
                    {/* New Juice Button */}
                    <button
                        onClick={addJuicePurchase}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: 'linear-gradient(135deg, var(--accent), #67e8f9)',
                            color: '#000',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            marginBottom: '2rem',
                            boxShadow: '0 4px 20px rgba(90, 200, 250, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <Droplet size={24} />
                        New Juice Bought
                    </button>

                    {/* Purchase History Table */}
                    {juicePurchases.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--bg-tertiary)' }}>
                                        <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Date</th>
                                        <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Time Since Last</th>
                                        <th style={{ padding: '12px', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Puffs</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {juicePurchases.slice().reverse().map((purchase, index) => {
                                        const purchaseDate = new Date(purchase.timestamp);
                                        const timeSinceLast = index < juicePurchases.length - 1
                                            ? formatDistanceToNow(new Date(juicePurchases[juicePurchases.length - 2 - index].timestamp), { addSuffix: false })
                                            : 'First purchase';

                                        return (
                                            <tr key={purchase.id} style={{ borderBottom: '1px solid var(--bg-tertiary)' }}>
                                                <td style={{ padding: '12px', fontSize: '0.9rem' }}>
                                                    {purchaseDate.toLocaleDateString()}
                                                </td>
                                                <td style={{ padding: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                    {timeSinceLast}
                                                </td>
                                                <td style={{ padding: '12px', fontSize: '0.9rem', textAlign: 'right', fontWeight: '600', color: 'var(--accent)' }}>
                                                    {purchase.puffsSinceLast}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* Average Stats */}
                            <div className="glass-panel" style={{ padding: '1rem', marginTop: '1.5rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Average Puffs Per Juice</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent)' }}>
                                    {Math.round(juicePurchases.reduce((sum, p) => sum + p.puffsSinceLast, 0) / juicePurchases.length)}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                            <Droplet size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                            <p>No juice purchases tracked yet</p>
                            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Tap "New Juice Bought" to start tracking</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Tracker;
