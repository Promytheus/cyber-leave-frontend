'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  Server, 
  Cpu, 
  HardDrive, 
  Radio, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Clock,
  Terminal
} from 'lucide-react';
import { api } from '@/lib/api';
import { ActuatorHealth, ActuatorInfo, ActuatorMetrics, MetricDetail } from '@/types/leave';

interface ActuatorMonitorProps {
  isBackendLive: boolean;
  latencyMs?: number;
  onRefreshHealth: () => void;
}

export const ActuatorMonitor: React.FC<ActuatorMonitorProps> = ({
  isBackendLive,
  latencyMs,
  onRefreshHealth,
}) => {
  const [health, setHealth] = useState<ActuatorHealth | null>(null);
  const [info, setInfo] = useState<ActuatorInfo | null>(null);
  const [metrics, setMetrics] = useState<ActuatorMetrics | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('jvm.memory.used');
  const [metricDetail, setMetricDetail] = useState<MetricDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchTelemetry = useCallback(async () => {
    setLoading(true);
    try {
      const [hRes, infoRes, metricsRes] = await Promise.all([
        api.checkHealth(),
        api.getInfo(),
        api.getMetrics(),
      ]);

      if (hRes.data) {
        setHealth(hRes.data);
      } else {
        setHealth({ status: isBackendLive ? 'UP' : 'MOCK_HEALTHY', details: { mode: 'simulated' } });
      }

      setInfo(infoRes);
      setMetrics(metricsRes);

      if (selectedMetric) {
        const detail = await api.getMetricDetail(selectedMetric);
        setMetricDetail(detail);
      }
    } finally {
      setLoading(false);
    }
  }, [isBackendLive, selectedMetric]);

  useEffect(() => {
    fetchTelemetry();
  }, [fetchTelemetry]);

  // Handle selected metric change
  const handleSelectMetric = async (name: string) => {
    setSelectedMetric(name);
    const detail = await api.getMetricDetail(name);
    setMetricDetail(detail);
  };

  // Auto-refresh timer every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchTelemetry();
      onRefreshHealth();
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchTelemetry, onRefreshHealth]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header Card */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Activity size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-bright)' }}>
                  Spring Boot Actuator Telemetry
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Runtime monitoring endpoints at <code>/actuator/health</code>, <code>/actuator/info</code>, <code>/actuator/metrics</code>
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              Auto-poll (10s)
            </label>

            <button
              id="btn-telemetry-refresh"
              className="btn btn-sm btn-outline"
              onClick={() => {
                fetchTelemetry();
                onRefreshHealth();
              }}
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh Telemetry
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Health Status & App Info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem',
      }}>
        {/* Health Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Server size={16} color="var(--accent-cyan)" />
              Service Health Status
            </span>
            <span className={`badge ${isBackendLive ? 'badge-approved' : 'badge-type'}`}>
              {health?.status || (isBackendLive ? 'UP' : 'DEMO_MODE')}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div className={`pulse-dot ${isBackendLive ? 'online' : 'demo'}`} style={{ width: 14, height: 14 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-bright)' }}>
                {isBackendLive ? 'Backend Online (UP)' : 'Simulated Sandbox / Mock'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Target: http://localhost:8080/actuator
              </div>
            </div>
            {latencyMs !== undefined && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  {latencyMs}ms
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ping</div>
              </div>
            )}
          </div>

          {/* Subsystems */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Component Health Checks
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div style={{
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Database</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>UP</span>
              </div>
              <div style={{
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Disk Space</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>UP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Application Info Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Info size={16} color="var(--accent-indigo)" />
              Application Metadata (/actuator/info)
            </span>
            <span className="badge badge-type">v1.0.0</span>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Application:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-bright)' }}>Cyber Leave Management</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Build Version:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>1.0.0-SNAPSHOT</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Java Version:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>OpenJDK 21 / 25</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Framework:</span>
              <span style={{ fontWeight: 600 }}>Spring Boot 3.x</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actuator Metrics Explorer */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Radio size={18} color="var(--accent-violet)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-bright)' }}>
            Available Telemetry Metrics (/actuator/metrics)
          </h3>
        </div>

        {/* Metric selection pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {(metrics?.names || [
            'jvm.memory.used',
            'jvm.memory.max',
            'system.cpu.usage',
            'process.uptime',
            'http.server.requests',
            'jvm.threads.live',
          ]).map((name) => (
            <button
              key={name}
              className={`btn btn-sm ${selectedMetric === name ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
              onClick={() => handleSelectMetric(name)}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Selected Metric Details Display */}
        {metricDetail && (
          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {metricDetail.name}
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {metricDetail.description || 'Spring Boot runtime performance metric'}
                </p>
              </div>

              {metricDetail.measurements && metricDetail.measurements.length > 0 && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {metricDetail.measurements.map((m, idx) => (
                    <div key={idx} style={{
                      padding: '0.5rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                    }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>
                        {m.statistic}
                      </span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-bright)', fontFamily: 'var(--font-mono)' }}>
                        {m.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
