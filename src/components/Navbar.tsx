'use client';

import React from 'react';
import { 
  ShieldCheck, 
  PlusCircle, 
  Activity, 
  Users, 
  Layers, 
  RefreshCw, 
  Sun, 
  Moon,
  Server
} from 'lucide-react';
import { ActuatorHealth } from '@/types/leave';

interface NavbarProps {
  activeTab: 'overview' | 'employees' | 'actuator';
  onTabChange: (tab: 'overview' | 'employees' | 'actuator') => void;
  onOpenCreateModal: () => void;
  isLiveMode: boolean;
  onToggleLiveMode: () => void;
  healthData?: ActuatorHealth;
  isBackendLive: boolean;
  latencyMs?: number;
  onRefreshHealth: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenCreateModal,
  isLiveMode,
  onToggleLiveMode,
  isBackendLive,
  latencyMs,
  onRefreshHealth,
  theme,
  onToggleTheme,
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-card)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow-cyan)',
            color: '#fff',
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                fontWeight: 800, 
                fontSize: '1.25rem', 
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #ffffff 40%, #a5b4fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                CYBER LEAVE
              </span>
              <span style={{
                fontSize: '0.7rem',
                padding: '0.15rem 0.45rem',
                borderRadius: 4,
                background: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600
              }}>
                v1.0.0
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              HR Presence & Leave Management Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '0.3rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}>
          <button 
            id="nav-tab-overview"
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => onTabChange('overview')}
          >
            <Layers size={15} />
            Overview & Requests
          </button>
          <button 
            id="nav-tab-employees"
            className={`btn btn-sm ${activeTab === 'employees' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => onTabChange('employees')}
          >
            <Users size={15} />
            Employee Directory
          </button>
          <button 
            id="nav-tab-actuator"
            className={`btn btn-sm ${activeTab === 'actuator' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => onTabChange('actuator')}
          >
            <Activity size={15} />
            Actuator & Health
          </button>
        </nav>

        {/* Actions & Connection Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Backend Connection Status Badge */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8rem',
            }}
            title="Spring Boot Actuator Health Status"
          >
            <span className={`pulse-dot ${isBackendLive ? 'online' : 'demo'}`} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ 
                fontWeight: 600, 
                color: isBackendLive ? 'var(--accent-emerald)' : 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <Server size={12} />
                {isBackendLive ? 'Backend Live' : 'Mock Demo'}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                {isBackendLive && latencyMs ? `${latencyMs}ms latency` : 'localhost:8080'}
              </span>
            </div>

            <button 
              id="refresh-health-btn"
              onClick={onRefreshHealth}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Re-check backend health"
            >
              <RefreshCw size={13} />
            </button>
          </div>

          {/* Toggle Live/Mock Switch */}
          <button
            id="toggle-mode-btn"
            className="btn btn-sm btn-outline"
            onClick={onToggleLiveMode}
            title={isLiveMode ? "Switch to Local Mock Store" : "Switch to Live REST API (localhost:8080)"}
          >
            {isLiveMode ? 'Force Mock Mode' : 'Use Live API'}
          </button>

          {/* Theme Switcher */}
          <button
            id="toggle-theme-btn"
            className="btn btn-sm btn-ghost"
            onClick={onToggleTheme}
            aria-label="Toggle dark/light theme"
            style={{ padding: '0.45rem' }}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* New Request CTA */}
          <button 
            id="btn-open-create-leave"
            className="btn btn-cyber" 
            onClick={onOpenCreateModal}
          >
            <PlusCircle size={16} />
            New Leave Request
          </button>
        </div>
      </div>
    </header>
  );
};
