import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { TrendingDown, DollarSign, Cigarette } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';

const Dashboard = () => {
    const { user, logs } = useUser();
    const [cigsAvoided, setCigsAvoided] = useState(0);
    const [realTimeSavings, setRealTimeSavings] = useState(0); // Added state for real-time savings

    const todayLogs = (logs || []).filter(log => {
        if (!log.timestamp) return false;
        const date = new Date(log.timestamp);
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    });

    // Logic Update based on User Data:
    // Nicotine Equivalence Calculation:
    // - Average cigarette contains 12mg nicotine, but only 2mg is absorbed (rest goes up in smoke)
    // - Vaping has 50% absorption rate
    // - User gets approximately 150 puffs per ml of e-liquid
    // - User's vape has X mg/ml nicotine strength

    const PUFFS_PER_ML = 150; // User gets ~150 puffs per ml
    const ABSORBED_NICOTINE_PER_CIGARETTE = 2; // mg absorbed from cigarette
    const VAPE_ABSORPTION_RATE = 0.5; // 50% absorption when vaping

    // Get user's vape nicotine strength
    const vapeNicotine = Number(user?.currentVape?.nicotine) || 20; // mg/ml, default to 20mg/ml

    // Calculate nicotine absorbed per puff
    // Each puff = (1/150)ml of e-liquid
    // Nicotine content per puff = (vapeNicotine mg/ml) × (1/150 ml)
    // Absorbed nicotine per puff = nicotine content × 50% absorption
    const nicotineContentPerPuff = vapeNicotine / PUFFS_PER_ML;
    const absorbedNicotinePerPuff = nicotineContentPerPuff * VAPE_ABSORPTION_RATE;

    // Calculate how many puffs equal one cigarette
    const PUFFS_PER_CIGARETTE = Math.round(ABSORBED_NICOTINE_PER_CIGARETTE / absorbedNicotinePerPuff);

    const oldDailyNicotinePuffs = (user?.cigarettesPerDay || 10) * PUFFS_PER_CIGARETTE;
    const percentage = Math.round((todayLogs.length / oldDailyNicotinePuffs) * 100);
    const vapedEquivalent = (todayLogs.length / PUFFS_PER_CIGARETTE).toFixed(1);

    // Money Saved Logic (Dynamic)
    // Smoking Cost: Accumulates over time (Days * Daily Cost)
    // Vaping Cost: Based on ACTUAL puffs and user's vape details
    // Using same PUFFS_PER_ML (150) from nicotine calculation above

    const cigsPerDay = Number(user?.cigarettesPerDay) || 0;
    const cigsPerPack = Number(user?.cigarettesPerPack) || 20;
    const packCost = Number(user?.packCost) || 0;

    // Vape details
    const vapeSize = Number(user?.currentVape?.size) || 2; // ml
    const vapeCost = Number(user?.currentVape?.cost) || 15; // cost per device/bottle

    // Calculate cost per puff based on user's actual vape
    const totalPuffsPerDevice = vapeSize * PUFFS_PER_ML;
    const costPerPuff = vapeCost / totalPuffsPerDevice;

    const dailySmokingCost = (cigsPerDay / cigsPerPack) * packCost;

    // Real-time Counters
    useEffect(() => {
        if (!user?.onboardedAt) return;

        const updateStats = () => {
            const now = new Date();
            const onboarded = new Date(user.onboardedAt);

            if (isNaN(onboarded.getTime())) return;

            const msSince = now - onboarded;
            const daysSince = Math.max(0, msSince / (1000 * 60 * 60 * 24));

            // Cigs Avoided
            const avoided = (daysSince * cigsPerDay).toFixed(4);
            setCigsAvoided(avoided);

            // Money Saved (Dynamic)
            const projectedSmokingCost = daysSince * dailySmokingCost;
            const actualVapingCost = (logs || []).length * costPerPuff;
            const netSavings = projectedSmokingCost - actualVapingCost;

            setRealTimeSavings(netSavings.toFixed(4));
        };

        updateStats();
        const interval = setInterval(updateStats, 100); // Faster update for smoother decimals
        return () => clearInterval(interval);
    }, [user, logs, dailySmokingCost, cigsPerDay, costPerPuff]);

    // Prepare Chart Data (Last 7 Days)
    const chartData = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dayLogs = (logs || []).filter(log => isSameDay(new Date(log.timestamp), date));
        const cigsEquivalent = dayLogs.length / PUFFS_PER_CIGARETTE;
        const pct = Math.round((cigsEquivalent / user.cigarettesPerDay) * 100);

        return {
            name: format(date, 'EEE'), // Mon, Tue, etc.
            vaped: cigsEquivalent,
            limit: user.cigarettesPerDay,
            percentage: pct
        };
    });

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', borderRadius: '8px', padding: '8px' }}>
                    <p style={{ fontWeight: '600', marginBottom: '4px' }}>{label}</p>
                    <p style={{ color: data.percentage > 100 ? 'var(--danger)' : 'var(--success)' }}>
                        {data.percentage}% of old habit
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {data.vaped.toFixed(1)} cigs equivalent
                    </p>
                </div>
            );
        }
        return null;
    };

    const getProgressColor = (pct) => {
        if (pct < 50) return 'var(--success)';
        if (pct < 100) return '#eab308'; // Yellow
        return 'var(--danger)';
    };

    return (
        <div className="container">

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Daily Nicotine</span>
                    <span style={{ color: getProgressColor(percentage), fontWeight: '600' }}>{percentage}% of old habit</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${Math.min(100, percentage)}%`,
                        background: getProgressColor(percentage),
                        transition: 'width 0.5s ease, background-color 0.5s ease',
                        boxShadow: `0 0 10px ${getProgressColor(percentage)}`
                    }} />
                </div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {todayLogs.length} puffs vs {user?.cigarettesPerDay || 0} cigarettes
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                    <DollarSign size={24} color={realTimeSavings < 0 ? 'var(--danger)' : 'var(--success)'} style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: realTimeSavings < 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
                        {realTimeSavings < 0 ? '-$' + Math.abs(realTimeSavings).toFixed(4) : '$' + realTimeSavings}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Net Money Saved</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: '2px' }}>(minus actual vaping costs)</div>
                </div>
                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                    <Cigarette size={24} color="var(--text-secondary)" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'monospace' }}>{cigsAvoided}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cigs Not Smoked</div>
                </div>
                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center', gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Today's Vaping Equivalent</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: getProgressColor(percentage) }}>
                        ~{vapedEquivalent} Cigarettes
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Based on {vapeNicotine}mg/ml ({PUFFS_PER_CIGARETTE} puffs ≈ 1 cig)
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', height: '300px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Weekly Trends</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-tertiary)', opacity: 0.4 }} />
                        <ReferenceLine y={user.cigarettesPerDay} stroke="var(--danger)" strokeDasharray="3 3" />
                        <Bar dataKey="vaped" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.vaped > entry.limit ? 'var(--danger)' : 'var(--success)'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
