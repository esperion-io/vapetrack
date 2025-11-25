import { useState } from 'react';
import { useUser } from './context/UserContext';
import Onboarding from './components/Onboarding';
import VapeSelector from './components/VapeSelector';
import Tracker from './components/Tracker';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import HealthTimeline from './components/HealthTimeline';
import Rewards from './components/Rewards';
import { LayoutDashboard, Wind, User, Heart, Gift, PlusCircle } from 'lucide-react';

function App() {
  const { user, onboardUser } = useUser();
  const [currentScreen, setCurrentScreen] = useState('tracker'); // 'tracker', 'dashboard', 'health', 'rewards', 'profile'

  const handleOnboardingComplete = (data) => {
    onboardUser(data);
  };

  const handleVapeSelect = (vapeData) => {
    // Destructure vape specific data and user habit data
    const { cigarettesPerDay, cigarettesPerPack, packCost, ...currentVape } = vapeData;

    onboardUser({
      ...user,
      currentVape,
      // Update top-level user stats if provided
      ...(cigarettesPerDay && { cigarettesPerDay }),
      ...(cigarettesPerPack && { cigarettesPerPack }),
      ...(packCost && { packCost })
    });
  };

  if (!user) {
    return (
      <div className="container">
        <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: '800' }}>VapeTrack</h1>
        </header>
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  if (!user.currentVape) {
    return (
      <div className="container">
        <VapeSelector onSelect={handleVapeSelect} />
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'tracker': return <Tracker />;
      case 'dashboard': return <Dashboard />;
      case 'health': return <HealthTimeline />;
      case 'rewards': return <Rewards />;
      case 'profile': return <Profile />;
      default: return <Tracker />;
    }
  };

  return (
    <div className="app-wrapper">
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {renderScreen()}
      </div>

      {/* Bottom Navigation */}
      <nav style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 2rem)',
        maxWidth: '400px',
        background: 'rgba(22, 31, 50, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '32px',
        padding: '0.8rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
        zIndex: 100
      }}>
        <NavButton
          icon={<LayoutDashboard size={20} />}
          active={currentScreen === 'dashboard'}
          onClick={() => setCurrentScreen('dashboard')}
          label="Stats"
        />
        <NavButton
          icon={<Heart size={20} />}
          active={currentScreen === 'health'}
          onClick={() => setCurrentScreen('health')}
          label="Health"
        />
        <NavButton
          icon={<PlusCircle size={32} color="var(--primary)" fill="var(--primary-glow)" />}
          active={currentScreen === 'tracker'}
          onClick={() => setCurrentScreen('tracker')}
          label="Track"
          isMain
        />
        <NavButton
          icon={<Gift size={20} />}
          active={currentScreen === 'rewards'}
          onClick={() => setCurrentScreen('rewards')}
          label="Rewards"
        />
        <NavButton
          icon={<User size={20} />}
          active={currentScreen === 'profile'}
          onClick={() => setCurrentScreen('profile')}
          label="Profile"
        />
      </nav>
    </div>
  );
}

const NavButton = ({ icon, active, onClick, label, isMain }) => (
  <button
    onClick={onClick}
    style={{
      background: 'none',
      border: 'none',
      color: active ? 'var(--primary)' : 'var(--text-secondary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      padding: '4px',
      transform: isMain ? 'translateY(-4px)' : 'none'
    }}
  >
    {icon}
    <span style={{ fontSize: '0.7rem', fontWeight: active ? '600' : '400' }}>{label}</span>
  </button>
);

export default App;
