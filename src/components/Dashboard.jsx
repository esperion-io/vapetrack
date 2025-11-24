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
    // 1 Pack (20 cigs) = ~250 puffs (Volume)
    // 1 Disposable (2ml, 20mg/ml) = ~600 puffs (Nicotine Equivalence to 20 cigs)
    // Therefore:
    // - To match Nicotine: 30 puffs = 1 cigarette (600 / 20)
    // - To match Volume: 12.5 puffs = 1 cigarette (250 / 20)

    // We use Nicotine Equivalence for the health/habit tracker as it's the more important metric for tapering.
    const PUFFS_PER_CIGARETTE = 30;

    const oldDailyNicotinePuffs = (user?.cigarettesPerDay || 10) * PUFFS_PER_CIGARETTE;
    const percentage = Math.round((todayLogs.length / oldDailyNicotinePuffs) * 100);
    const vapedEquivalent = (todayLogs.length / PUFFS_PER_CIGARETTE).toFixed(1);

    // Money Saved Logic (Dynamic)
    // Smoking Cost: Accumulates over time (Days * Daily Cost)
    // Vaping Cost: Based on ACTUAL puffs (Total Puffs * Cost Per Puff)
    // Cost Per Puff Assumption: $15/week for 20 cigs/day equivalent (600 puffs/day)
    // $15 / 7 days / 600 puffs = $0.0035714 per puff
    const COST_PER_PUFF = 0.0035714;

    const cigsPerDay = Number(user?.cigarettesPerDay) || 0;
    const cigsPerPack = Number(user?.cigarettesPerPack) || 20;
    const packCost = Number(user?.packCost) || 0;

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
            const actualVapingCost = (logs || []).length * COST_PER_PUFF;
            const netSavings = projectedSmokingCost - actualVapingCost;

            setRealTimeSavings(netSavings.toFixed(4));
        };

        updateStats();
        const interval = setInterval(updateStats, 100); // Faster update for smoother decimals
        return () => clearInterval(interval);
    }, [user, logs, dailySmokingCost, cigsPerDay]);

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
            <h2 style={{ marginBottom: '1.5rem' }}>Your Progress</h2>

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
                    {todayLogs.length} puffs vs ~{oldDailyNicotinePuffs} puffs (equivalent nicotine)
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
                        Based on 20mg/ml disposable (30 puffs ≈ 1 cig)
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
