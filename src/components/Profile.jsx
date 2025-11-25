import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { User, LogOut } from 'lucide-react';

// Import rewards data to display icons
const REWARDS = [
    { id: 'icon_star', icon: '⭐' },
    { id: 'icon_fire', icon: '🔥' },
    { id: 'icon_cloud', icon: '☁️' },
    { id: 'icon_rainbow', icon: '🌈' },
    { id: 'icon_crown', icon: '👑' }
];

const Profile = () => {
    const { user, updateUser, clearData, equippedRewards } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [cigsPerDay, setCigsPerDay] = useState(user.cigarettesPerDay || '');
    const [cigsPerPack, setCigsPerPack] = useState(user.cigarettesPerPack || '');
    const [packCost, setPackCost] = useState(user.packCost || '');

    // Local state for vape details
    const [vapeName, setVapeName] = useState(user.currentVape?.name || '');
    const [vapeFlavor, setVapeFlavor] = useState(user.currentVape?.flavor || '');
    const [vapeSize, setVapeSize] = useState(user.currentVape?.size || '');
    const [vapeNicotine, setVapeNicotine] = useState(user.currentVape?.nicotine || '');
    const [vapeCost, setVapeCost] = useState(user.currentVape?.cost || '');

    const handleSave = () => {
        updateUser({
            name,
            email,
            cigarettesPerDay: parseInt(cigsPerDay),
            cigarettesPerPack: parseInt(cigsPerPack),
            packCost: parseFloat(packCost),
            currentVape: {
                ...user.currentVape,
                name: vapeName,
                flavor: vapeFlavor,
                size: parseFloat(vapeSize),
                nicotine: parseFloat(vapeNicotine),
                cost: parseFloat(vapeCost)
            }
        });
        setIsEditing(false);
    };

    const toggleEdit = () => {
        if (isEditing) {
            handleSave();
        } else {
            // Sync local state with current user data before editing
            setName(user.name || '');
            setEmail(user.email || '');
            setCigsPerDay(user.cigarettesPerDay || '');
            setCigsPerPack(user.cigarettesPerPack || '');
            setPackCost(user.packCost || '');
            setVapeName(user.currentVape?.name || '');
            setVapeFlavor(user.currentVape?.flavor || '');
            setVapeSize(user.currentVape?.size || '');
            setVapeNicotine(user.currentVape?.nicotine || '');
            setVapeCost(user.currentVape?.cost || '');
            setIsEditing(true);
        }
    };

    return (
        <div className="container">

            <div className="card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'var(--bg-tertiary)',
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    border: equippedRewards.border === 'border_gold'
                        ? '3px solid gold'
                        : equippedRewards.border === 'border_rainbow'
                            ? '3px solid transparent'
                            : 'none',
                    backgroundImage: equippedRewards.border === 'border_rainbow'
                        ? 'linear-gradient(var(--bg-tertiary), var(--bg-tertiary)), linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)'
                        : 'none',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    boxShadow: equippedRewards.border === 'border_gold'
                        ? '0 0 20px rgba(255, 215, 0, 0.5)'
                        : equippedRewards.border === 'border_rainbow'
                            ? '0 0 20px rgba(255, 255, 255, 0.3)'
                            : 'none'
                }}>
                    {equippedRewards.icon ? (
                        REWARDS.find(r => r.id === equippedRewards.icon)?.icon || <User size={40} color="var(--text-secondary)" />
                    ) : (
                        <User size={40} color="var(--text-secondary)" />
                    )}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{user.name}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{user.email || 'No email linked'}</p>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontWeight: '600' }}>Settings</h4>
                    {!isEditing && (
                        <button
                            onClick={toggleEdit}
                            style={{ color: 'var(--accent)', background: 'none', fontWeight: '600' }}
                        >
                            Edit
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditing}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: isEditing ? 'var(--bg-primary)' : 'transparent',
                                border: isEditing ? '1px solid var(--bg-tertiary)' : 'none',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--text-primary)'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!isEditing}
                            placeholder="Enter email to sync (Mock)"
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: isEditing ? 'var(--bg-primary)' : 'transparent',
                                border: isEditing ? '1px solid var(--bg-tertiary)' : 'none',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--text-primary)'
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontWeight: '600' }}>Vape</h4>
                    {!isEditing && user.currentVape?.name && (
                        <span style={{
                            fontSize: '0.9rem',
                            color: 'var(--primary)',
                            fontWeight: '600',
                            background: 'rgba(46, 140, 255, 0.1)',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-sm)'
                        }}>
                            {user.currentVape.name}
                        </span>
                    )}
                </div>

                {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Vape Type</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                {['Pen', 'Pod', 'Tank'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setVapeName(type)}
                                        style={{
                                            padding: '12px',
                                            borderRadius: 'var(--radius-sm)',
                                            background: vapeName === type ? 'var(--primary)' : 'var(--bg-tertiary)',
                                            color: vapeName === type ? '#fff' : 'var(--text-secondary)',
                                            border: 'none',
                                            fontWeight: '600',
                                            transition: 'all 0.2s',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Size (ml)</label>
                                <input
                                    type="number"
                                    value={vapeSize}
                                    onChange={(e) => setVapeSize(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'var(--bg-primary)',
                                        border: '1px solid var(--bg-tertiary)',
                                        borderRadius: 'var(--radius-sm)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Nicotine (mg)</label>
                                <input
                                    type="number"
                                    value={vapeNicotine}
                                    onChange={(e) => setVapeNicotine(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'var(--bg-primary)',
                                        border: '1px solid var(--bg-tertiary)',
                                        borderRadius: 'var(--radius-sm)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Cost ($)</label>
                            <input
                                type="number"
                                value={vapeCost}
                                onChange={(e) => setVapeCost(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <div>

                        {user.currentVape?.size && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '1rem' }}>
                                <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Size</div>
                                    <div style={{ fontWeight: '600' }}>{user.currentVape.size}ml</div>
                                </div>
                                <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Nicotine</div>
                                    <div style={{ fontWeight: '600' }}>{user.currentVape.nicotine}mg</div>
                                </div>
                                <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cost</div>
                                    <div style={{ fontWeight: '600' }}>{user.currentVape.cost}</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Cigarette</h4>

                {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Per Day</label>
                                <input
                                    type="number"
                                    value={cigsPerDay}
                                    onChange={(e) => setCigsPerDay(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'var(--bg-primary)',
                                        border: '1px solid var(--bg-tertiary)',
                                        borderRadius: 'var(--radius-sm)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Per Pack</label>
                                <input
                                    type="number"
                                    value={cigsPerPack}
                                    onChange={(e) => setCigsPerPack(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'var(--bg-primary)',
                                        border: '1px solid var(--bg-tertiary)',
                                        borderRadius: 'var(--radius-sm)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Pack Cost ($)</label>
                            <input
                                type="number"
                                value={packCost}
                                onChange={(e) => setPackCost(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '1rem' }}>
                            <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Per Day</div>
                                <div style={{ fontWeight: '600' }}>{user.cigarettesPerDay} cigs</div>
                            </div>
                            <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Per Pack</div>
                                <div style={{ fontWeight: '600' }}>{user.cigarettesPerPack} cigs</div>
                            </div>
                            <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pack Cost</div>
                                <div style={{ fontWeight: '600' }}>{user.packCost}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isEditing && (
                <button
                    onClick={handleSave}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: 'linear-gradient(135deg, var(--primary), #0066CC)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        marginBottom: '1rem',
                        boxShadow: '0 4px 20px var(--primary-glow)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    Save Changes
                </button>
            )}

            <button
                onClick={clearData}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: 'var(--danger)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: '600'
                }}
            >
                <LogOut size={20} /> Sign Out / Reset
            </button>
        </div>
    );
};

export default Profile;
