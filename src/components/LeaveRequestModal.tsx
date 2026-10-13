'use client';

import React, { useState } from 'react';
import { CreateLeaveRequestDto, LeaveType } from '@/types/leave';
import { X, Calendar, User, FileText, Send, Sparkles } from 'lucide-react';

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateLeaveRequestDto) => Promise<void>;
}

export const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [employeeId, setEmployeeId] = useState('EMP-003');
  const [employeeName, setEmployeeName] = useState('Charlie Brown');
  const [leaveType, setLeaveType] = useState<LeaveType>('ANNUAL');
  const [startDate, setStartDate] = useState('2026-12-20');
  const [endDate, setEndDate] = useState('2026-12-28');
  const [reason, setReason] = useState('Winter holidays and year-end family celebration');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  // Calculate day difference
  let daysDiff = 0;
  if (startDate && endDate) {
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
      daysDiff = Math.max(0, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!employeeId.trim() || !employeeName.trim()) {
      setError('Please provide employee identifier and full name.');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be before start date.');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        employeeId: employeeId.trim(),
        employeeName: employeeName.trim(),
        leaveType,
        startDate,
        endDate,
        reason: reason.trim() || null,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit leave request';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickPreset = (id: string, name: string) => {
    setEmployeeId(id);
    setEmployeeName(name);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Calendar size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-bright)' }}>
                New Leave Request
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Submit formal presence & leave application
              </p>
            </div>
          </div>
          <button
            id="close-create-modal"
            className="btn btn-ghost"
            onClick={onClose}
            style={{ padding: '0.35rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              color: '#fda4af',
              fontSize: '0.85rem',
            }}>
              {error}
            </div>
          )}

          {/* Quick presets for convenience */}
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Quick Employee Presets:
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-sm btn-outline" 
                onClick={() => handleQuickPreset('EMP-001', 'Alice Smith')}
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
              >
                EMP-001 (Alice)
              </button>
              <button 
                type="button" 
                className="btn btn-sm btn-outline" 
                onClick={() => handleQuickPreset('EMP-002', 'Bob Jones')}
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
              >
                EMP-002 (Bob)
              </button>
              <button 
                type="button" 
                className="btn btn-sm btn-outline" 
                onClick={() => handleQuickPreset('EMP-003', 'Charlie Brown')}
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
              >
                EMP-003 (Charlie)
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
            {/* Employee ID */}
            <div className="form-group">
              <label className="form-label">Employee ID *</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="input-employee-id"
                  type="text"
                  required
                  placeholder="e.g. EMP-003"
                  className="form-input"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
              </div>
            </div>

            {/* Employee Name */}
            <div className="form-group">
              <label className="form-label">Employee Name *</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="input-employee-name"
                  type="text"
                  required
                  placeholder="Full Name"
                  className="form-input"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Leave Type */}
          <div className="form-group">
            <label className="form-label">Leave Category *</label>
            <select
              id="select-leave-type"
              className="form-select"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
            >
              <option value="ANNUAL">Annual Leave (Vacation)</option>
              <option value="SICK">Sick Leave (Medical)</option>
              <option value="REMOTE_WORK">Remote Work (Work from Anywhere)</option>
              <option value="MATERNITY">Maternity Leave</option>
              <option value="PATERNITY">Paternity Leave</option>
              <option value="UNPAID">Unpaid Leave</option>
            </select>
          </div>

          {/* Date Pickers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                id="input-start-date"
                type="date"
                required
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input
                id="input-end-date"
                type="date"
                required
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Duration Preview Badge */}
          <div style={{
            padding: '0.65rem 0.95rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
              <Sparkles size={15} color="var(--accent-indigo)" />
              <span>Calculated Leave Duration:</span>
            </div>
            <span style={{ 
              fontWeight: 700, 
              color: daysDiff > 0 ? 'var(--accent-cyan)' : 'var(--accent-rose)',
              fontFamily: 'var(--font-mono)' 
            }}>
              {daysDiff > 0 ? `${daysDiff} calendar days` : 'Invalid date range'}
            </span>
          </div>

          {/* Reason */}
          <div className="form-group">
            <label className="form-label">Reason or Notes (Optional)</label>
            <textarea
              id="input-reason"
              rows={3}
              placeholder="Provide context or destination notes..."
              className="form-textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Form Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '0.5rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              id="btn-submit-leave"
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Send size={15} />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
