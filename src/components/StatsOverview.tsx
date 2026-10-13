'use client';

import React from 'react';
import { LeaveRequest, LeaveType } from '@/types/leave';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  CalendarDays,
  Briefcase
} from 'lucide-react';

interface StatsOverviewProps {
  leaves: LeaveRequest[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ leaves }) => {
  const total = leaves.length;
  const pending = leaves.filter(l => l.status === 'PENDING').length;
  const approved = leaves.filter(l => l.status === 'APPROVED').length;
  const rejected = leaves.filter(l => l.status === 'REJECTED').length;
  const cancelled = leaves.filter(l => l.status === 'CANCELLED').length;

  // Calculate total days requested across approved/pending
  const totalDays = leaves.reduce((acc, l) => {
    try {
      const s = new Date(l.startDate);
      const e = new Date(l.endDate);
      const days = Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      return acc + (isNaN(days) ? 0 : days);
    } catch {
      return acc;
    }
  }, 0);

  const avgDays = total > 0 ? (totalDays / total).toFixed(1) : '0';

  // Leave Type counts
  const typeMap: Record<LeaveType, number> = {
    ANNUAL: leaves.filter(l => l.leaveType === 'ANNUAL').length,
    SICK: leaves.filter(l => l.leaveType === 'SICK').length,
    REMOTE_WORK: leaves.filter(l => l.leaveType === 'REMOTE_WORK').length,
    MATERNITY: leaves.filter(l => l.leaveType === 'MATERNITY').length,
    PATERNITY: leaves.filter(l => l.leaveType === 'PATERNITY').length,
    UNPAID: leaves.filter(l => l.leaveType === 'UNPAID').length,
  };

  const typeColors: Record<LeaveType, string> = {
    ANNUAL: '#6366f1',
    SICK: '#ec4899',
    REMOTE_WORK: '#06b6d4',
    MATERNITY: '#8b5cf6',
    PATERNITY: '#3b82f6',
    UNPAID: '#f97316',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
      {/* 4 Top KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
      }}>
        {/* Total Requests */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: 'var(--accent-indigo)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <FileText size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Requests
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-bright)' }}>
              {total}
            </div>
          </div>
        </div>

        {/* Pending Action */}
        <div className="glass-panel" style={{ 
          padding: '1.25rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          border: pending > 0 ? '1px solid rgba(245, 158, 11, 0.4)' : undefined,
          boxShadow: pending > 0 ? '0 0 20px -5px rgba(245, 158, 11, 0.2)' : undefined,
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: 'var(--accent-amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pending Approvals
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--status-pending-text)' }}>
              {pending}
            </div>
          </div>
        </div>

        {/* Approved */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: 'var(--accent-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Approved Leaves
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--status-approved-text)' }}>
              {approved}
            </div>
          </div>
        </div>

        {/* Rejected & Avg duration */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: 'var(--accent-rose)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <XCircle size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Rejected: <strong style={{ color: 'var(--accent-rose)' }}>{rejected}</strong>
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Cancelled: <strong>{cancelled}</strong>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', color: 'var(--accent-cyan)' }}>
              <CalendarDays size={14} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                Avg {avgDays} days / request
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Category Distribution Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={17} color="var(--accent-cyan)" />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-bright)' }}>
              Leave Distribution by Category
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {totalDays} total cumulative days requested
          </span>
        </div>

        {/* Multi-segment progress bar */}
        <div style={{
          height: 10,
          borderRadius: 9999,
          background: 'rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          marginBottom: '0.85rem'
        }}>
          {(Object.keys(typeMap) as LeaveType[]).map((type) => {
            const count = typeMap[type];
            if (count === 0 || total === 0) return null;
            const pct = (count / total) * 100;
            return (
              <div 
                key={type}
                style={{
                  width: `${pct}%`,
                  backgroundColor: typeColors[type],
                  height: '100%',
                  transition: 'width 0.4s ease',
                }}
                title={`${type}: ${count} (${Math.round(pct)}%)`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem'
        }}>
          {(Object.keys(typeMap) as LeaveType[]).map((type) => {
            const count = typeMap[type];
            return (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: typeColors[type]
                }} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  {type.replace('_', ' ')}:
                </span>
                <strong style={{ color: 'var(--text-bright)', fontFamily: 'var(--font-mono)' }}>
                  {count}
                </strong>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
