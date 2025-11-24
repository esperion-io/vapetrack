import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { User, LogOut } from 'lucide-react';

const Profile = () => {
    const { user, updateUser, clearData } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [cigsPerDay, setCigsPerDay] = useState(user.cigarettesPerDay || '');

    // Local state for vape details to avoid jittery updates or context issues during typing
    const [vapeName, setVapeName] = useState(user.currentVape?.name || '');
    const [vapeFlavor, setVapeFlavor] = useState(user.currentVape?.flavor || '');

    const handleSave = () => {
        updateUser({
            name,
            email,
            cigarettesPerDay: parseInt(cigsPerDay),
            currentVape: {
                ...user.currentVape,
                name: vapeName,
                flavor: vapeFlavor
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
            setVapeName(user.currentVape?.name || '');
            setVapeFlavor(user.currentVape?.flavor || '');
            setIsEditing(true);
        }
    };

    return (
        <div className="container">
            <h2 style={{ marginBottom: '1.5rem' }}>Profile</h2>

            <div className="card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'var(--bg-tertiary)',
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <User size={40} color="var(--text-secondary)" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{user.name}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{user.email || 'No email linked'}</p>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontWeight: '600' }}>Settings</h4>
                    <button
                        onClick={toggleEdit}
                        style={{ color: 'var(--accent)', background: 'none', fontWeight: '600' }}
                    >
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
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
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Cigarettes / Day (History)</label>
                        <input
                            type="number"
                            value={cigsPerDay}
                            onChange={(e) => setCigsPerDay(e.target.value)}
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
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Current Setup</h4>

                {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Device Name</label>
                            <input
                                type="text"
                                value={vapeName}
                                onChange={(e) => setVapeName(e.target.value)}
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
                            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Flavor</label>
                            <input
                                type="text"
                                value={vapeFlavor}
                                onChange={(e) => setVapeFlavor(e.target.value)}
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
                        <button
                            onClick={() => updateUser({ currentVape: null })}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'var(--bg-tertiary)',
                                color: 'var(--text-primary)',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: '600',
                                marginTop: '0.5rem'
                            }}
                        >
                            Switch Device (Re-scan)
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: '600' }}>{user.currentVape?.name}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{user.currentVape?.flavor}</div>
                        </div>
                    </div>
                )}
            </div>

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
