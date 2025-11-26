import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { User, LogOut, Mail, Lock, ArrowRight, Share2, Twitter, Facebook, Copy } from 'lucide-react';

// Import rewards data to display icons
const REWARDS = [
    { id: 'icon_star', icon: '⭐' },
    { id: 'icon_fire', icon: '🔥' },
    { id: 'icon_cloud', icon: '☁️' },
    { id: 'icon_rainbow', icon: '🌈' },
    { id: 'icon_bear', icon: '🧸' },
    { id: 'icon_rocket', icon: '🚀' },
    { id: 'icon_gangster_bear', icon: '😎' },
    { id: 'icon_crown', icon: '👑' }
];

const AuthForm = () => {
    const { signIn, signUp, clearData } = useUser();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);
        try {
            if (isLogin) {
                await signIn(email, password);
            } else {
                const result = await signUp(email, password, username);
                // Check if email confirmation is required
                if (result.user && !result.session) {
                    setSuccessMessage('Account created! Please check your email (including spam folder) to confirm your account.');
                } else if (result.session) {
                    // User is auto-confirmed and logged in
                    setSuccessMessage('Account created successfully! You are now logged in.');
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem', fontWeight: '800' }}>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        padding: '1rem',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '1rem',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        padding: '1rem',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '1rem',
                        fontSize: '0.9rem'
                    }}>
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {!isLogin && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Username</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required={!isLogin}
                                    style={{
                                        width: '100%',
                                        padding: '12px 12px 12px 40px',
                                        background: 'var(--bg-primary)',
                                        border: '1px solid var(--bg-tertiary)',
                                        borderRadius: 'var(--radius-sm)',
                                        color: 'var(--text-primary)'
                                    }}
                                    placeholder="Username"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-primary)'
                                }}
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-primary)'
                                }}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '1rem',
                            padding: '14px',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            padding: 0
                        }}
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--bg-tertiary)', textAlign: 'center' }}>
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure? This will delete all local data.')) {
                                clearData();
                                window.location.reload();
                            }
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Reset Local Guest Data
                    </button>
                </div>
            </div>
        </div>
    );
};

const Profile = () => {
    const { user, session, updateUser, signOut, equippedRewards, toggleSmokeFree } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [cigsPerDay, setCigsPerDay] = useState(user.cigarettesPerDay || '');
    const [cigsPerPack, setCigsPerPack] = useState(user.cigarettesPerPack || '');
    const [packCost, setPackCost] = useState(user.packCost || '');
    const [smokeFreeTime, setSmokeFreeTime] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    // Local state for vape details
    const [vapeName, setVapeName] = useState(user.currentVape?.name || '');
    const [vapeFlavor, setVapeFlavor] = useState(user.currentVape?.flavor || '');
    const [vapeSize, setVapeSize] = useState(user.currentVape?.size || '');
    const [vapeNicotine, setVapeNicotine] = useState(user.currentVape?.nicotine || '');
    const [vapeCost, setVapeCost] = useState(user.currentVape?.cost || '');

    // Sync email and name when user context updates (e.g., after login)
    useEffect(() => {
        setEmail(user.email || '');
        setName(user.name || '');
    }, [user.email, user.name]);

    // Update smoke-free timer
    useEffect(() => {
        if (!user.isSmokeFree || !user.smokeFreeStartTime) return;

        const updateTimer = () => {
            const start = new Date(user.smokeFreeStartTime);
            const now = new Date();
            const diff = now - start;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (days > 0) {
                setSmokeFreeTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            } else if (hours > 0) {
                setSmokeFreeTime(`${hours}h ${minutes}m ${seconds}s`);
            } else {
                setSmokeFreeTime(`${minutes}m ${seconds}s`);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [user.isSmokeFree, user.smokeFreeStartTime]);

    const shareMessage = `🎉 I've been smoke-free for ${smokeFreeTime}! Join me on my journey with VapeTrack! 💪`;

    const handleShare = (platform) => {
        const url = window.location.href;
        const encodedMessage = encodeURIComponent(shareMessage);
        const encodedUrl = encodeURIComponent(url);

        switch (platform) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(shareMessage).then(() => {
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                });
                break;
        }
    };

    if (!session) {
        return <AuthForm />;
    }

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
            {/* Golden Smoke-Free Button */}
            {!user.isSmokeFree && (
                <button
                    onClick={toggleSmokeFree}
                    style={{
                        width: '100%',
                        padding: '20px',
                        marginBottom: '2rem',
                        background: 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)',
                        backgroundSize: '200% 200%',
                        animation: 'goldenShimmer 3s ease infinite',
                        border: '2px solid #FFD700',
                        borderRadius: 'var(--radius-md)',
                        color: '#000',
                        fontSize: '1.2rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        boxShadow: '0 8px 30px rgba(255, 215, 0, 0.5), inset 0 2px 10px rgba(255, 255, 255, 0.5)',
                        position: 'relative',
                        overflow: 'hidden',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}
                >
                    <span style={{ position: 'relative', zIndex: 1 }}>✨ I Have Stopped Smoking ✨</span>
                </button>
            )}

            <div className="card" style={{
                marginBottom: '2rem',
                textAlign: 'center',
                ...(user.isSmokeFree && {
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    border: '3px solid #FFD700',
                    boxShadow: '0 10px 40px rgba(255, 215, 0, 0.6)',
                })
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: user.isSmokeFree ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'var(--bg-tertiary)',
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    border: equippedRewards.border === 'border_gold' || user.isSmokeFree
                        ? '3px solid gold'
                        : equippedRewards.border === 'border_rainbow'
                            ? '3px solid transparent'
                            : 'none',
                    backgroundImage: equippedRewards.border === 'border_rainbow' && !user.isSmokeFree
                        ? 'linear-gradient(var(--bg-tertiary), var(--bg-tertiary)), linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)'
                        : 'none',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    boxShadow: equippedRewards.border === 'border_gold' || user.isSmokeFree
                        ? '0 0 20px rgba(255, 215, 0, 0.5)'
                        : equippedRewards.border === 'border_rainbow'
                            ? '0 0 20px rgba(255, 255, 255, 0.3)'
                            : 'none'
                }}>
                    {equippedRewards.icon ? (
                        REWARDS.find(r => r.id === equippedRewards.icon)?.icon || <User size={40} color={user.isSmokeFree ? '#000' : 'var(--text-secondary)'} />
                    ) : (
                        <User size={40} color={user.isSmokeFree ? '#000' : 'var(--text-secondary)'} />
                    )}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: user.isSmokeFree ? '#000' : 'inherit' }}>{user.name}</h3>
                <p style={{ color: user.isSmokeFree ? 'rgba(0,0,0,0.7)' : 'var(--text-secondary)' }}>{user.email || 'No email linked'}</p>

                {user.isSmokeFree && (
                    <>
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: 'rgba(255, 255, 255, 0.3)',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: '700',
                            color: '#000',
                            fontSize: '1.1rem'
                        }}>
                            🎉 SMOKE-FREE CHAMPION 🎉
                        </div>

                        {/* XP Display */}
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: 'rgba(0, 0, 0, 0.15)',
                            borderRadius: 'var(--radius-sm)',
                        }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#000', marginBottom: '0.25rem', opacity: 0.8 }}>
                                TOTAL XP
                            </div>
                            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#000' }}>
                                {user.xp} XP
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#000', marginTop: '0.25rem', opacity: 0.7 }}>
                                Level {Math.floor(user.xp / 1000) + 1}
                            </div>
                        </div>

                        {/* Smoke-Free Timer */}
                        <div style={{
                            marginTop: '1rem',
                            padding: '1.5rem',
                            background: 'rgba(0, 0, 0, 0.2)',
                            borderRadius: 'var(--radius-sm)',
                        }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#000', marginBottom: '0.5rem' }}>
                                SMOKE-FREE FOR
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#000', fontFamily: 'monospace' }}>
                                {smokeFreeTime}
                            </div>
                        </div>

                        {/* Social Sharing */}
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: 'var(--radius-sm)',
                        }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#000', marginBottom: '0.75rem' }}>
                                SHARE YOUR SUCCESS
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                <button
                                    onClick={() => handleShare('twitter')}
                                    style={{
                                        padding: '10px 16px',
                                        background: '#1DA1F2',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontWeight: '600',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    <Twitter size={16} />
                                    Twitter
                                </button>
                                <button
                                    onClick={() => handleShare('facebook')}
                                    style={{
                                        padding: '10px 16px',
                                        background: '#1877F2',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontWeight: '600',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    <Facebook size={16} />
                                    Facebook
                                </button>
                                <button
                                    onClick={() => handleShare('copy')}
                                    style={{
                                        padding: '10px 16px',
                                        background: copySuccess ? '#10b981' : 'rgba(0, 0, 0, 0.3)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontWeight: '600',
                                        fontSize: '0.85rem',
                                        transition: 'background 0.3s'
                                    }}
                                >
                                    <Copy size={16} />
                                    {copySuccess ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
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
                            disabled
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--text-primary)',
                                opacity: 0.7
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

            {
                isEditing && (
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
                )
            }

            <button
                onClick={signOut}
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
                <LogOut size={20} /> Sign Out
            </button>
        </div >
    );
};

export default Profile;
