'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LeaveRequest, LeaveStatus } from '@/types/leave';
import { api } from '@/lib/api';
import { 
  User, 
  Search, 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Briefcase, 
  Sparkles,
  Layers
} from 'lucide-react';

interface EmployeeLookupProps {
  isLiveMode: boolean;
  onOpenCreateForEmployee: (empId: string, empName: string) => void;
  onViewDetails: (leave: LeaveRequest) => void;
}

export const EmployeeLookup: React.FC<EmployeeLookupProps> = ({
  isLiveMode,
  onOpenCreateForEmployee,
  onViewDetails,
}) => {
  const [employeeId, setEmployeeId] = useState('EMP-001');
  const [employeeLeaves, setEmployeeLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployeeData = useCallback(async (id: string) => {
    if (!id.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const data = await api.getLeavesByEmployee(id.trim(), isLiveMode);
      setEmployeeLeaves(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch employee history';
      setError(msg);
      setEmployeeLeaves([]);
    } finally {
      setLoading(false);
    }
  }, [isLiveMode]);

  useEffect(() => {
    fetchEmployeeData(employeeId);
  }, [employeeId, fetchEmployeeData]);

  // Aggregate stats
  const totalRequests = employeeLeaves.length;
  const approvedCount = employeeLeaves.filter(l => l.status === 'APPROVED').length;
  const pendingCount = employeeLeaves.filter(l => l.status === 'PENDING').length;
  const employeeName = employeeLeaves.length > 0 ? employeeLeaves[0].employeeName : 'Employee Profile';

  // Calculate annual days used
  const annualDaysUsed = employeeLeaves
    .filter(l => l.leaveType === 'ANNUAL' && l.status === 'APPROVED')
    .reduce((sum, l) => {
      try {
        const s = new Date(l.startDate);
        const e = new Date(l.endDate);
        return sum + Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      } catch {
        return sum;
      }
    }, 0);

  const annualAllowance = 25; // Standard 25 days/year
  const remainingAnnual = Math.max(0, annualAllowance - annualDaysUsed);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Search Header */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-bright)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} color="var(--accent-cyan)" />
              Employee Leave Records
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Query historical records via <code>GET /api/v1/leaves/employee/{'{employeeId}'}</code>
            </p>
          </div>

          {/* Quick Select Chips */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick Select:</span>
            {['EMP-001', 'EMP-002', 'EMP-003', 'EMP-004', 'EMP-005'].map((id) => (
              <button
                key={id}
                className={`btn btn-sm ${employeeId === id ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                onClick={() => setEmployeeId(id)}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', maxWidth: 460 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search 
              size={16} 
              color="var(--text-muted)" 
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} 
            />
            <input
              id="input-lookup-employee-id"
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Enter Employee ID (e.g. EMP-001)"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>
          <button
            className="btn btn-cyber"
            onClick={() => fetchEmployeeData(employeeId)}
          >
            Search
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
      }}>
        {/* Employee Summary Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1.3rem',
              boxShadow: 'var(--shadow-glow-cyan)',
            }}>
              {employeeName.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-bright)' }}>
                {employeeName}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
                {employeeId}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              className="btn btn-sm btn-primary"
              style={{ flex: 1 }}
              onClick={() => onOpenCreateForEmployee(employeeId, employeeName)}
            >
              <Sparkles size={14} />
              Apply for {employeeId}
            </button>
          </div>
        </div>

        {/* Annual Allowance Gauge */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Annual Vacation Balance
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                {remainingAnnual} / {annualAllowance} Days Left
              </span>
            </div>
            {/* Progress bar */}
            <div style={{
              height: 10,
              borderRadius: 999,
              background: 'rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              marginBottom: '0.5rem',
            }}>
              <div style={{
                width: `${(annualDaysUsed / annualAllowance) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
              }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Used: {annualDaysUsed} days</span>
            <span>Policy Allowance: 25 days/yr</span>
          </div>
        </div>

        {/* Request Stats */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--border-subtle)',
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Filed</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-bright)' }}>{totalRequests}</span>
          </div>
          <div style={{
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--border-subtle)',
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Approved</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--status-approved-text)' }}>{approvedCount}</span>
          </div>
          <div style={{
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--border-subtle)',
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Pending</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--status-pending-text)' }}>{pendingCount}</span>
          </div>
          <div style={{
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--border-subtle)',
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Status</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>Active</span>
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-bright)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} color="var(--accent-indigo)" />
          Application History for {employeeId}
        </h3>

        {loading ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading records for {employeeId}...
          </div>
        ) : error ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-rose)' }}>
            {error}
          </div>
        ) : employeeLeaves.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No leave requests recorded for {employeeId}.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {employeeLeaves.map((l) => (
              <div
                key={l.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onClick={() => onViewDetails(l)}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`badge badge-${l.status.toLowerCase()}`}>
                    {l.status}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-bright)' }}>
                      {l.leaveType.replace('_', ' ')}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {l.startDate} → {l.endDate}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ textAlign: 'right', maxWidth: 260 }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {l.reason || 'No notes'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Submitted {new Date(l.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button className="btn btn-sm btn-outline">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
