import { useState } from 'react';
import { Search, Camera, Check } from 'lucide-react';

const VapeSelector = ({ onSelect }) => {
    const [formData, setFormData] = useState({
        size: '',
        nicotine: '',
        type: 'Pod',
        cost: '',
        cigarettesPerDay: '',
        cigarettesPerPack: '',
        packCost: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.size || !formData.nicotine || !formData.cost || !formData.cigarettesPerDay || !formData.cigarettesPerPack || !formData.packCost) return;

        onSelect({
            ...formData,
            size: parseFloat(formData.size),
            nicotine: parseFloat(formData.nicotine),
            cost: parseFloat(formData.cost),
            name: `${formData.type} System (${formData.nicotine}mg)`, // Fallback name
            flavor: 'Custom Setup', // Fallback flavor
            cigarettesPerDay: parseInt(formData.cigarettesPerDay),
            cigarettesPerPack: parseInt(formData.cigarettesPerPack),
            packCost: parseFloat(formData.packCost)
        });
    };

    const inputStyle = {
        width: '100%',
        padding: '16px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--bg-tertiary)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-primary)',
        fontSize: '1rem',
        marginBottom: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem'
    };

    return (
        <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem' }}>Vape Details</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Enter your device details to track usage and cost accurately.
            </p>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={labelStyle}>Vape Type</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        {['Pen', 'Pod', 'Tank'].map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setFormData({ ...formData, type })}
                                style={{
                                    padding: '12px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: formData.type === type ? 'var(--primary)' : 'var(--bg-tertiary)',
                                    color: formData.type === type ? '#fff' : 'var(--text-secondary)',
                                    border: 'none',
                                    fontWeight: '600',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={labelStyle}>Size (ml)</label>
                        <input
                            type="number"
                            placeholder="e.g. 2"
                            value={formData.size}
                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                            style={inputStyle}
                            required
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Nicotine (mg)</label>
                        <input
                            type="number"
                            placeholder="e.g. 20"
                            value={formData.nicotine}
                            onChange={(e) => setFormData({ ...formData, nicotine: e.target.value })}
                            style={inputStyle}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label style={labelStyle}>Cost Per Each ($)</label>
                    <input
                        type="number"
                        placeholder="e.g. 15.00"
                        value={formData.cost}
                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                        style={inputStyle}
                        required
                    />
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--bg-tertiary)' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Smoking Habits</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        Update your baseline to track savings accurately.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={labelStyle}>Cigs Per Day</label>
                            <input
                                type="number"
                                placeholder="e.g. 15"
                                value={formData.cigarettesPerDay}
                                onChange={(e) => setFormData({ ...formData, cigarettesPerDay: e.target.value })}
                                style={inputStyle}
                                required
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Cigs Per Pack</label>
                            <input
                                type="number"
                                placeholder="e.g. 20"
                                value={formData.cigarettesPerPack}
                                onChange={(e) => setFormData({ ...formData, cigarettesPerPack: e.target.value })}
                                style={inputStyle}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Cost Per Pack ($)</label>
                        <input
                            type="number"
                            placeholder="e.g. 35.00"
                            value={formData.packCost}
                            onChange={(e) => setFormData({ ...formData, packCost: e.target.value })}
                            style={inputStyle}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
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
                        marginTop: '1rem',
                        boxShadow: '0 4px 20px var(--primary-glow)'
                    }}
                >
                    Save Setup
                </button>
            </form>
        </div>
    );
};

export default VapeSelector;
