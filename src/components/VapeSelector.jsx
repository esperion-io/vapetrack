import { useState } from 'react';
import { Search, Camera, Check } from 'lucide-react';

const MOCK_VAPES = [
    { id: 1, name: 'Elf Bar BC5000', flavor: 'Watermelon Ice', puffs: 5000 },
    { id: 2, name: 'Geek Bar Pulse', flavor: 'Juicy Peach', puffs: 15000 },
    { id: 3, name: 'Lost Mary OS5000', flavor: 'Blue Razz Ice', puffs: 5000 },
    { id: 4, name: 'Juul', flavor: 'Virginia Tobacco', puffs: 200 },
    { id: 5, name: 'Vaporesso XROS', flavor: 'Refillable', puffs: null },
];

const VapeSelector = ({ onSelect }) => {
    const [search, setSearch] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    const filteredVapes = MOCK_VAPES.filter(v =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.flavor.toLowerCase().includes(search.toLowerCase())
    );

    const handleScan = () => {
        setIsScanning(true);
        // Mock scanning delay
        setTimeout(() => {
            setIsScanning(false);
            setSearch('Elf Bar'); // Mock result
        }, 2000);
    };

    return (
        <div className="card">
            <h2 style={{ marginBottom: '1.5rem' }}>What are you vaping?</h2>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Search brand or flavor..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 12px 12px 40px',
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--bg-tertiary)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>
                <button
                    onClick={handleScan}
                    style={{
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        width: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Camera size={20} />
                </button>
            </div>

            {isScanning ? (
                <div style={{ textAlign: 'center', padding: '2rem', border: '2px dashed var(--accent)', borderRadius: 'var(--radius-md)' }}>
                    <p className="text-gradient" style={{ fontWeight: '600' }}>Scanning...</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredVapes.map(vape => (
                        <button
                            key={vape.id}
                            onClick={() => onSelect(vape)}
                            style={{
                                background: 'var(--bg-primary)',
                                padding: '16px',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'left',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                border: '1px solid transparent',
                                transition: 'border-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                        >
                            <div>
                                <div style={{ fontWeight: '600' }}>{vape.name}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{vape.flavor}</div>
                            </div>
                            {vape.puffs && (
                                <span style={{ fontSize: '0.8rem', background: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '12px' }}>
                                    {vape.puffs} puffs
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VapeSelector;
