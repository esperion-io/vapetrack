import { useUser } from '../context/UserContext';
import { Award, Sparkles, Zap, Crown, Star, Heart, Flame, CloudRain, Rainbow, Smile } from 'lucide-react';

const REWARDS = [
    { id: 'icon_star', name: '⭐ Star Icon', cost: 100, type: 'icon', icon: '⭐', description: 'Shiny star profile icon' },
    { id: 'icon_fire', name: '🔥 Fire Icon', cost: 150, type: 'icon', icon: '🔥', description: 'Hot fire profile icon' },
    { id: 'icon_cloud', name: '☁️ Cloud Icon', cost: 150, type: 'icon', icon: '☁️', description: 'Fluffy cloud profile icon' },
    { id: 'icon_rainbow', name: '🌈 Rainbow Icon', cost: 200, type: 'icon', icon: '🌈', description: 'Colorful rainbow icon' },
    { id: 'icon_crown', name: '👑 Crown Icon', cost: 300, type: 'icon', icon: '👑', description: 'Royal crown icon' },
    { id: 'border_gold', name: '✨ Gold Border', cost: 250, type: 'border', description: 'Shining gold profile border' },
    { id: 'border_rainbow', name: '🌟 Rainbow Border', cost: 400, type: 'border', description: 'Animated rainbow border' },
];

const Rewards = () => {
    const { xp, purchasedRewards, equippedRewards, purchaseReward, equipReward, unequipReward } = useUser();

    const handlePurchase = (reward) => {
        const success = purchaseReward(reward.id, reward.cost);
        if (success) {
            // Could add a success notification here
            console.log(`Purchased ${reward.name}!`);
        }
    };

    const handleEquip = (reward) => {
        if (equippedRewards[reward.type] === reward.id) {
            // Unequip if already equipped
            unequipReward(reward.type);
        } else {
            // Equip
            equipReward(reward.id, reward.type);
        }
    };

    const groupedRewards = {
        icons: REWARDS.filter(r => r.type === 'icon'),
        borders: REWARDS.filter(r => r.type === 'border'),
    };

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
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.7 }}>
                    Earn XP by staying below your old habit each day
                </p>
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
