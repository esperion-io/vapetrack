import { useUser } from '../context/UserContext';
import { Award, Sparkles, Zap, Crown, Star, Heart, Flame, CloudRain, Rainbow, Smile } from 'lucide-react';

const REWARDS = [
    { id: 'icon_star', name: '⭐ Star Icon', cost: 500, type: 'icon', icon: '⭐', description: 'Shiny star profile icon' },
    { id: 'icon_fire', name: '🔥 Fire Icon', cost: 1000, type: 'icon', icon: '🔥', description: 'Hot fire profile icon' },
    { id: 'icon_cloud', name: '☁️ Cloud Icon', cost: 1500, type: 'icon', icon: '☁️', description: 'Fluffy cloud profile icon' },
    { id: 'icon_rainbow', name: '🌈 Rainbow Icon', cost: 2500, type: 'icon', icon: '🌈', description: 'Colorful rainbow icon' },
    { id: 'icon_bear', name: '🧸 Cute Bear', cost: 3000, type: 'icon', icon: '🧸', description: 'Adorable teddy bear icon' },
    { id: 'icon_rocket', name: '🚀 Rocket', cost: 4000, type: 'icon', icon: '🚀', description: 'To the moon!' },
    { id: 'icon_gangster_bear', name: '😎 Cool Bear', cost: 5000, type: 'icon', icon: '😎', description: 'Gangster teddy bear' },
    { id: 'icon_crown', name: '👑 Crown Icon', cost: 6000, type: 'icon', icon: '👑', description: 'Royal crown icon' },
    { id: 'border_gold', name: '✨ Gold Border', cost: 7500, type: 'border', description: 'Shining gold profile border' },
    { id: 'border_rainbow', name: '🌟 Rainbow Border', cost: 10000, type: 'border', description: 'Animated rainbow border' },
];

const Rewards = () => {
    const { user, logs, xp, purchasedRewards, equippedRewards, purchaseReward, equipReward, unequipReward } = useUser();

    // Calculate Projected XP for Today
    const calculateProjectedXP = () => {
        const now = new Date();
        const todayLogs = logs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate.toDateString() === now.toDateString();
        });

        const PUFFS_PER_ML = 150;
        const ABSORBED_NICOTINE_PER_CIGARETTE = 2;
        const VAPE_ABSORPTION_RATE = 0.5;
        const vapeNicotine = Number(user?.currentVape?.nicotine) || 20;
        const nicotineContentPerPuff = vapeNicotine / PUFFS_PER_ML;
        const absorbedNicotinePerPuff = nicotineContentPerPuff * VAPE_ABSORPTION_RATE;
        const PUFFS_PER_CIGARETTE = Math.round(ABSORBED_NICOTINE_PER_CIGARETTE / absorbedNicotinePerPuff);
        const oldDailyNicotinePuffs = (user?.cigarettesPerDay || 10) * PUFFS_PER_CIGARETTE;

        const percentage = (todayLogs.length / oldDailyNicotinePuffs) * 100;

        if (percentage >= 100) return 0;
        return Math.round((100 - percentage) * 10);
    };

    const projectedXP = calculateProjectedXP();

    const handlePurchase = (reward) => {
        const success = purchaseReward(reward.id, reward.cost);
        if (success) {
            console.log(`Purchased ${reward.name}!`);
        }
    };

    const handleEquip = (reward) => {
        if (equippedRewards[reward.type] === reward.id) {
            unequipReward(reward.type);
        } else {
            equipReward(reward.id, reward.type);
        }
    };

    const groupedRewards = {
        icons: REWARDS.filter(r => r.type === 'icon'),
        borders: REWARDS.filter(r => r.type === 'border'),
    };

    return (
        <div className="container">
            <div className="card" style={{
                marginBottom: '2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                border: '1px solid var(--primary-glow)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--primary)' }}>{xp} XP</h2>
                    <p style={{ fontWeight: '700', opacity: 0.8, letterSpacing: '1px', color: 'var(--text-secondary)' }}>LEVEL {Math.floor(xp / 1000) + 1}</p>

                    <div style={{
                        marginTop: '1.5rem',
                        background: 'var(--bg-primary)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--bg-tertiary)'
                    }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                            Projected XP Today
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: projectedXP > 0 ? 'var(--text-primary)' : '#ef4444' }}>
                            +{projectedXP}
                        </div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                            {projectedXP > 0
                                ? "Keep your puffs low to secure this!"
                                : "Daily limit reached. No XP today."}
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Icons */}
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smile size={20} color="var(--accent)" /> Profile Icons
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '2rem' }}>
                {groupedRewards.icons.map(reward => {
                    const isPurchased = purchasedRewards.includes(reward.id);
                    const canAfford = xp >= reward.cost;

                    return (
                        <div key={reward.id} className="card" style={{
                            padding: '1rem',
                            opacity: isPurchased ? 0.6 : 1,
                            background: isPurchased ? 'rgba(45, 212, 191, 0.1)' : 'var(--bg-secondary)',
                            position: 'relative'
                        }}>
                            <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>
                                {reward.icon}
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem' }}>{reward.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                {reward.description}
                            </div>
                            {isPurchased ? (
                                <button
                                    onClick={() => handleEquip(reward)}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        background: equippedRewards.icon === reward.id ? 'var(--success)' : 'var(--bg-tertiary)',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        textAlign: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {equippedRewards.icon === reward.id ? 'Equipped ✓' : 'Equip'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => handlePurchase(reward)}
                                    disabled={!canAfford}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        background: canAfford ? 'var(--primary)' : 'var(--bg-tertiary)',
                                        color: canAfford ? '#fff' : 'var(--text-secondary)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        fontSize: '0.85rem',
                                        cursor: canAfford ? 'pointer' : 'not-allowed',
                                        opacity: canAfford ? 1 : 0.5
                                    }}
                                >
                                    {reward.cost} XP
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Profile Borders */}
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--accent)" /> Profile Borders
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
                {groupedRewards.borders.map(reward => {
                    const isPurchased = purchasedRewards.includes(reward.id);
                    const canAfford = xp >= reward.cost;

                    return (
                        <div key={reward.id} className="card" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem',
                            background: isPurchased ? 'rgba(45, 212, 191, 0.1)' : 'var(--bg-secondary)',
                            opacity: isPurchased ? 0.6 : 1
                        }}>
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{reward.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{reward.description}</div>
                            </div>
                            {isPurchased ? (
                                <button
                                    onClick={() => handleEquip(reward)}
                                    style={{
                                        padding: '8px 16px',
                                        background: equippedRewards.border === reward.id ? 'var(--success)' : 'var(--bg-tertiary)',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {equippedRewards.border === reward.id ? 'Equipped ✓' : 'Equip'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => handlePurchase(reward)}
                                    disabled={!canAfford}
                                    style={{
                                        padding: '8px 16px',
                                        background: canAfford ? 'var(--primary)' : 'var(--bg-tertiary)',
                                        color: canAfford ? '#fff' : 'var(--text-secondary)',
                                        border: 'none',
                                        borderRadius: '20px',
                                        fontWeight: '600',
                                        fontSize: '0.9rem',
                                        cursor: canAfford ? 'pointer' : 'not-allowed',
                                        opacity: canAfford ? 1 : 0.5
                                    }}
                                >
                                    {reward.cost} XP
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Rewards;
