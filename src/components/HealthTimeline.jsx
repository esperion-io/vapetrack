import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Heart, Wind, Brain, Activity, Clock, Zap, Move, ShieldCheck, Smile } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const MILESTONES = [
    { id: 1, title: 'Heart Rate Normalizes', time: 20 * 60 * 1000, icon: Heart, desc: '20 Minutes' },
    { id: 2, title: 'CO Levels Drop', time: 12 * 60 * 60 * 1000, icon: Wind, desc: '12 Hours' },
    { id: 3, title: 'Nicotine Clears', time: 48 * 60 * 60 * 1000, icon: Activity, desc: '48 Hours' },
    { id: 4, title: 'Taste & Smell Improve', time: 48 * 60 * 60 * 1000, icon: Brain, desc: '48 Hours' },
    { id: 5, title: 'Breathing Improves', time: 72 * 60 * 60 * 1000, icon: Wind, desc: '3 Days' },
    { id: 6, title: 'Circulation Improves', time: 14 * 24 * 60 * 60 * 1000, icon: Move, desc: '2 Weeks' },
    { id: 7, title: 'Withdrawal Gone', time: 30 * 24 * 60 * 60 * 1000, icon: Smile, desc: '1 Month' },
    { id: 8, title: 'Lung Function +10%', time: 90 * 24 * 60 * 60 * 1000, icon: Zap, desc: '3 Months' },
    { id: 9, title: 'Lungs Healed', time: 270 * 24 * 60 * 60 * 1000, icon: ShieldCheck, desc: '9 Months' },
    { id: 10, title: 'Heart Disease Risk Halved', time: 365 * 24 * 60 * 60 * 1000, icon: Heart, desc: '1 Year' },
];

const HealthTimeline = () => {
    const { user, logs } = useUser();
    const [timeSinceLastPuff, setTimeSinceLastPuff] = useState('0s');

    // Calculate time since last puff for milestones
    const getLastPuffTime = () => {
        if (logs.length > 0) {
            return new Date(logs[logs.length - 1].timestamp).getTime();
        }
        // If no logs, fallback to onboarding time or now if not onboarded
        return user.onboardedAt ? new Date(user.onboardedAt).getTime() : new Date().getTime();
    };

    const [timeSinceLastPuffMs, setTimeSinceLastPuffMs] = useState(0);

    useEffect(() => {
        const updateTimer = () => {
            const lastPuffTime = getLastPuffTime();
            const now = new Date().getTime();
            const diff = Math.max(0, now - lastPuffTime);

            setTimeSinceLastPuffMs(diff);

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeSinceLastPuff(`${hours}h ${minutes}m ${seconds}s`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [logs]);

    return (
        <div className="container">
            {/* Time Since Last Puff Header */}
            <div className="card" style={{
                marginBottom: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                border: '1px solid var(--primary-glow)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Clock size={16} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>TIME SINCE LAST PUFF</span>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', fontFamily: 'monospace' }}>
                    {timeSinceLastPuff}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Your body is healing right now!
                </div>
            </div>

            <div style={{ position: 'relative', paddingLeft: '20px' }}>
                {/* Vertical Line */}
                <div style={{
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    bottom: '0',
                    width: '2px',
                    background: 'var(--bg-tertiary)'
                }} />

                {MILESTONES.map((milestone, index) => {
                    const isUnlocked = timeSinceLastPuffMs >= milestone.time;
                    const Icon = milestone.icon;

                    return (
                        <div key={milestone.id} style={{ marginBottom: '2rem', position: 'relative' }}>
                            {/* Dot */}
                            <div style={{
                                position: 'absolute',
                                left: '-25px',
                                top: '0',
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: isUnlocked ? 'var(--success)' : 'var(--bg-tertiary)',
                                border: '2px solid var(--bg-primary)'
                            }} />

                            <div className="card" style={{
                                opacity: isUnlocked ? 1 : 0.5,
                                border: isUnlocked ? '1px solid var(--success)' : '1px solid var(--bg-tertiary)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <div style={{
                                        padding: '8px',
                                        borderRadius: '8px',
                                        background: isUnlocked ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)',
                                        color: isUnlocked ? 'var(--success)' : 'var(--text-secondary)'
                                    }}>
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{milestone.title}</h3>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{milestone.desc}</span>
                                    </div>
                                </div>
                                {isUnlocked && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: '500' }}>
                                        ACHIEVED
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HealthTimeline;
