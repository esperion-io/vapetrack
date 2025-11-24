import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Wind, Clock, Droplet } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Tracker = () => {
    const { addLog, logs, user, updateJuiceLevel } = useUser();
    const [timeSinceLastPuff, setTimeSinceLastPuff] = useState('No logs yet');
    const [mode, setMode] = useState('puff'); // 'puff' or 'juice'
    const [sliderValue, setSliderValue] = useState(user.juiceLevel || 100);

    const todayLogs = logs.filter(log => {
        const date = new Date(log.timestamp);
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    });

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
        // Optional: Show success feedback
    };

    const estimatedPuffs = () => {
        const diff = (user.juiceLevel || 100) - sliderValue;
        if (diff <= 0) return 0;
        return Math.round(((diff / 100) * (user.bottleSize || 2)) * 300);
    };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>

            <div style={{ background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-md)', display: 'flex', marginBottom: '2rem' }}>
                <button
                    onClick={() => setMode('puff')}
                    style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-sm)',
                        background: mode === 'puff' ? 'var(--bg-tertiary)' : 'transparent',
                        color: mode === 'puff' ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                    }}
                >
                    Puff Counter
                </button>
                <button
                    onClick={() => setMode('juice')}
                    style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-sm)',
                        background: mode === 'juice' ? 'var(--bg-tertiary)' : 'transparent',
                        color: mode === 'juice' ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                    }}
                >
                    Juice Level
                </button>
            </div>

            {mode === 'puff' ? (
                <>
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Puffs Today</div>
                        <div style={{ fontSize: '4rem', fontWeight: '700', lineHeight: 1, textShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}>
                            {todayLogs.length}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                        <button
                            onClick={addLog}
                            style={{
                                width: '200px',
                                height: '200px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle at 30% 30%, var(--primary), var(--accent))',
                                border: 'none',
                                color: 'white',
                                fontSize: '2rem',
                                fontWeight: '800',
                                boxShadow: '0 0 50px var(--primary-glow), inset 0 0 20px rgba(255,255,255,0.3)',
                                cursor: 'pointer',
                                transition: 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textTransform: 'uppercase',
                                letterSpacing: '2px'
                            }}
                            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <Wind size={48} style={{ marginBottom: '0.5rem' }} />
                            VAPE
                        </button>
                    </div>

                    <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Time Since Last Puff</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '600', fontFamily: 'monospace', marginTop: '0.5rem' }}>
                            {timeSinceLastPuff}
                        </div>
                    </div>
                </>
            ) : (
                <div style={{ width: '100%', maxWidth: '300px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <Droplet size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
                        <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>{sliderValue}%</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Juice Remaining</p>
                    </div>

                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderValue}
                        onChange={(e) => setSliderValue(e.target.value)}
                        style={{ width: '100%', marginBottom: '2rem', accentColor: 'var(--accent)' }}
                    />

                    <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Logging approximately</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>{estimatedPuffs()} puffs</p>
                    </div>

                    <button
                        onClick={handleJuiceUpdate}
                        disabled={estimatedPuffs() === 0}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: estimatedPuffs() > 0 ? 'var(--primary)' : 'var(--bg-tertiary)',
                            color: 'white',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: '600',
                            opacity: estimatedPuffs() > 0 ? 1 : 0.5
                        }}
                    >
                        Update Level
                    </button>
                </div>
            )}
        </div>
    );
};

export default Tracker;
