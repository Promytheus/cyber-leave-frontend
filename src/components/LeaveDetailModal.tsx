'use client';

import React, { useState } from 'react';
import { LeaveRequest, LeaveStatus } from '@/types/leave';
import { 
  X, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Ban, 
  Code, 
  FileText 
} from 'lucide-react';

interface LeaveDetailModalProps {
  leave: LeaveRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: number, status: LeaveStatus) => Promise<void>;
}

export const LeaveDetailModal: React.FC<LeaveDetailModalProps> = ({
  leave,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  const [showJson, setShowJson] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !leave) return null;

  const handleStatusChange = async (newStatus: LeaveStatus) => {
    try {
      setLoading(true);
      await onUpdateStatus(leave.id, newStatus);
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = (start: string, end: string) => {
    try {
      const s = new Date(start);
      const e = new Date(end);
      return Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    } catch {
      return 1;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-bright)' }}>
                Leave Request Details
              </h2>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--accent-cyan)',
                background: 'rgba(6, 182, 212, 0.1)',
                padding: '0.15rem 0.5rem',
                borderRadius: 4,
              }}>
                #{leave.id}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Created {new Date(leave.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            id="close-detail-modal"
            className="btn btn-ghost"
            onClick={onClose}
            style={{ padding: '0.35rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Employee banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.2rem',
            }}>
              {leave.employeeName.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-bright)' }}>
                {leave.employeeName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <User size={13} />
                <span style={{ fontFamily: 'var(--font-mono)' }}>{leave.employeeId}</span>
              </div>
            </div>
            <div>
              <span className={`badge badge-${leave.status.toLowerCase()}`}>
                {leave.status}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
          }}>
            <div style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid var(--border-subtle)',
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                Leave Type
              </span>
              <span style={{ fontWeight: 600, color: 'var(--text-bright)' }}>
                {leave.leaveType.replace('_', ' ')}
              </span>
            </div>

            <div style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid var(--border-subtle)',
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                Duration
              </span>
              <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
                {calculateDays(leave.startDate, leave.endDate)} Calendar Days
              </span>
            </div>

            <div style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid var(--border-subtle)',
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                Start Date
              </span>
              <span style={{ fontWeight: 600, color: 'var(--text-bright)', fontFamily: 'var(--font-mono)' }}>
                {leave.startDate}
              </span>
            </div>

            <div style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid var(--border-subtle)',
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                End Date
              </span>
              <span style={{ fontWeight: 600, color: 'var(--text-bright)', fontFamily: 'var(--font-mono)' }}>
                {leave.endDate}
              </span>
            </div>
          </div>

          {/* Reason */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontSize: '0.8rem' }}>
              <FileText size={14} />
              <span style={{ fontWeight: 600 }}>Reason / Notes</span>
            </div>
            <p style={{ color: leave.reason ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.9rem' }}>
              {leave.reason || 'No description provided.'}
            </p>
          </div>

          {/* Status Workflow Actions */}
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              Workflow Actions (PATCH /api/v1/leaves/{leave.id}/status)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-sm btn-success"
                disabled={loading || leave.status === 'APPROVED'}
                onClick={() => handleStatusChange('APPROVED')}
              >
                <CheckCircle size={14} />
                Approve Request
              </button>
              <button
                className="btn btn-sm btn-danger"
                disabled={loading || leave.status === 'REJECTED'}
                onClick={() => handleStatusChange('REJECTED')}
              >
                <XCircle size={14} />
                Reject Request
              </button>
              <button
                className="btn btn-sm btn-outline"
                disabled={loading || leave.status === 'CANCELLED'}
                onClick={() => handleStatusChange('CANCELLED')}
              >
                <Ban size={14} />
                Mark Cancelled
              </button>
              <button
                className="btn btn-sm btn-outline"
                disabled={loading || leave.status === 'PENDING'}
                onClick={() => handleStatusChange('PENDING')}
              >
                <Clock size={14} />
                Set to Pending
              </button>
            </div>
          </div>

          {/* Raw JSON inspection toggle */}
          <div>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setShowJson(!showJson)}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0' }}
            >
              <Code size={13} />
              {showJson ? 'Hide Raw API JSON' : 'Inspect Raw API JSON'}
            </button>
            {showJson && (
              <pre style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: '#040711',
                color: '#38bdf8',
                fontSize: '0.75rem',
                overflowX: 'auto',
                fontFamily: 'var(--font-mono)',
              }}>
                {JSON.stringify(leave, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
