import { useUser } from '../context/UserContext';
import { Heart, Wind, Brain, Activity } from 'lucide-react';

const MILESTONES = [
    { id: 1, title: 'Heart Rate Normalizes', time: 20 * 60 * 1000, icon: Heart, desc: '20 Minutes' },
    { id: 2, title: 'CO Levels Drop', time: 12 * 60 * 60 * 1000, icon: Wind, desc: '12 Hours' },
    { id: 3, title: 'Nicotine Clears', time: 48 * 60 * 60 * 1000, icon: Activity, desc: '48 Hours' },
    { id: 4, title: 'Taste & Smell Improve', time: 48 * 60 * 60 * 1000, icon: Brain, desc: '48 Hours' },
    { id: 5, title: 'Breathing Improves', time: 72 * 60 * 60 * 1000, icon: Wind, desc: '3 Days' },
];

const HealthTimeline = () => {
    const { user } = useUser();

    // In a real app, this would be time since LAST CIGARETTE.
    // For this MVP, we use time since ONBOARDING as a proxy for "start of journey".
    const timeSinceStart = new Date() - new Date(user.onboardedAt);

    return (
        <div className="container">

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
                    const isUnlocked = timeSinceStart >= milestone.time;
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
