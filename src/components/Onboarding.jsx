import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Cigarette, ArrowRight } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [cigarettesPerDay, setCigarettesPerDay] = useState('');
    const [packCost, setPackCost] = useState('');

    const handleNext = () => {
        if (step === 1 && cigarettesPerDay) {
            setStep(2);
        } else if (step === 2 && packCost) {
            onComplete({
                cigarettesPerDay: parseInt(cigarettesPerDay),
                packCost: parseFloat(packCost),
                cigarettesPerPack: 20, // Default assumption
            });
        }
    };

    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                    background: 'var(--bg-tertiary)',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                }}>
                    <Cigarette size={32} color="var(--text-secondary)" />
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    {step === 1 ? "How much did you smoke?" : "How much was a pack?"}
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    {step === 1
                        ? "Let's establish a baseline to compare against."
                        : "We'll calculate how much money you're saving."}
                </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                {step === 1 ? (
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                            Cigarettes per day
                        </label>
                        <input
                            type="number"
                            value={cigarettesPerDay}
                            onChange={(e) => setCigarettesPerDay(e.target.value)}
                            placeholder="e.g. 15"
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--bg-tertiary)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--text-primary)',
                                fontSize: '1.2rem'
                            }}
                            autoFocus
                        />
                    </div>
                ) : (
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                            Cost per pack ($)
                        </label>
                        <input
                            type="number"
                            value={packCost}
                            onChange={(e) => setPackCost(e.target.value)}
                            placeholder="e.g. 12.50"
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--bg-tertiary)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--text-primary)',
                                fontSize: '1.2rem'
                            }}
                            autoFocus
                        />
                    </div>
                )}
            </div>

            <button className="btn-primary" onClick={handleNext} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {step === 1 ? "Next" : "Start Tracking"} <ArrowRight size={20} />
            </button>
        </div>
    );
};

export default Onboarding;
