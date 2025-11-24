import { useUser } from '../context/UserContext';
import { Award, Gift, Lock } from 'lucide-react';

const BADGES_META = {
    'first_step': { title: 'First Step', desc: 'Logged your first puff', icon: '👣' },
    'century_club': { title: 'Century Club', desc: 'Logged 100 puffs', icon: '💯' },
    'saver': { title: 'Saver', desc: 'Saved your first $10', icon: '💰' },
};

const COUPONS = [
    { id: 1, title: 'Free Pita Pit Smoothie', cost: 100, vendor: 'Pita Pit', color: '#16a34a' },
    { id: 2, title: '10% Off Healthy Eats', cost: 250, vendor: 'Green Bar', color: '#ea580c' },
    { id: 3, title: '$5 Voucher', cost: 500, vendor: 'Salad Stop', color: '#2563eb' },
];

const Rewards = () => {
    const { badges, xp } = useUser();

    return (
        <div className="container">
            <div style={{
                background: 'linear-gradient(135deg, var(--accent), #67e8f9)',
                padding: '2rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '2rem',
                color: '#000',
                textAlign: 'center'
            }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>{xp} XP</h2>
                <p style={{ fontWeight: '600', opacity: 0.8 }}>LEVEL {Math.floor(xp / 100) + 1}</p>
            </div>

            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="var(--accent)" /> Badges
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '2rem' }}>
                {Object.entries(BADGES_META).map(([key, meta]) => {
                    const isUnlocked = badges.includes(key);
                    return (
                        <div key={key} className="card" style={{
                            padding: '10px',
                            textAlign: 'center',
                            opacity: isUnlocked ? 1 : 0.5,
                            background: isUnlocked ? 'rgba(45, 212, 191, 0.1)' : 'var(--bg-secondary)'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '4px' }}>{isUnlocked ? meta.icon : <Lock size={24} />}</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: '600', lineHeight: '1.2' }}>{meta.title}</div>
                        </div>
                    );
                })}
            </div>

            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gift size={20} color="var(--accent)" /> Rewards Marketplace
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {COUPONS.map(coupon => {
                    const canAfford = xp >= coupon.cost;
                    return (
                        <div key={coupon.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: '600', color: coupon.color }}>{coupon.vendor}</div>
                                <div>{coupon.title}</div>
                            </div>
                            <button
                                disabled={!canAfford}
                                style={{
                                    background: canAfford ? 'var(--text-primary)' : 'var(--bg-tertiary)',
                                    color: canAfford ? 'var(--bg-primary)' : 'var(--text-secondary)',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontWeight: '600',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {coupon.cost} XP
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Rewards;
