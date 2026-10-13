'use client';

import React, { useState } from 'react';
import { 
  LeaveRequest, 
  LeaveStatus, 
  LeaveType 
} from '@/types/leave';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  AlertCircle,
  Ban
} from 'lucide-react';

interface LeaveListProps {
  leaves: LeaveRequest[];
  currentStatusFilter?: LeaveStatus;
  onStatusFilterChange: (status?: LeaveStatus) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onCancel: (id: number) => void;
  onDelete: (id: number) => void;
  onViewDetails: (leave: LeaveRequest) => void;
  isLoading: boolean;
}

export const LeaveList: React.FC<LeaveListProps> = ({
  leaves,
  currentStatusFilter,
  onStatusFilterChange,
  onApprove,
  onReject,
  onCancel,
  onDelete,
  onViewDetails,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<LeaveType | 'ALL'>('ALL');

  // Filter leaves
  const filteredLeaves = leaves.filter((leave) => {
    // Search match
    const matchesSearch = 
      leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (leave.reason && leave.reason.toLowerCase().includes(searchTerm.toLowerCase()));

    // Type match
    const matchesType = selectedType === 'ALL' || leave.leaveType === selectedType;

    return matchesSearch && matchesType;
  });

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge badge-pending">Pending</span>;
      case 'APPROVED':
        return <span className="badge badge-approved">Approved</span>;
      case 'REJECTED':
        return <span className="badge badge-rejected">Rejected</span>;
      case 'CANCELLED':
        return <span className="badge badge-cancelled">Cancelled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const calculateDays = (start: string, end: string) => {
    try {
      const s = new Date(start);
      const e = new Date(end);
      const diff = Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      return isNaN(diff) ? 1 : diff;
    } catch {
      return 1;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Controls Bar: Search & Status Filters */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Search Input */}
        <div style={{
          position: 'relative',
          flex: '1 1 280px',
          maxWidth: 400,
        }}>
          <Search 
            size={16} 
            color="var(--text-muted)" 
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input
            id="search-leaves-input"
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search by name, EMP ID, reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter Tabs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.35rem',
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}>
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'] as const).map((st) => {
            const isSelected = st === 'ALL' ? !currentStatusFilter : currentStatusFilter === st;
            return (
              <button
                key={st}
                id={`filter-status-${st.toLowerCase()}`}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => onStatusFilterChange(st === 'ALL' ? undefined : (st as LeaveStatus))}
              >
                {st}
              </button>
            );
          })}
        </div>

        {/* Leave Type Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={15} color="var(--text-muted)" />
          <select
            id="filter-type-select"
            className="form-select"
            style={{ width: 'auto', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as LeaveType | 'ALL')}
          >
            <option value="ALL">All Categories</option>
            <option value="ANNUAL">Annual Leave</option>
            <option value="SICK">Sick Leave</option>
            <option value="REMOTE_WORK">Remote Work</option>
            <option value="MATERNITY">Maternity</option>
            <option value="PATERNITY">Paternity</option>
            <option value="UNPAID">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Leave Requests Table */}
      {isLoading ? (
        <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginBottom: '0.5rem' }}>
            <Calendar size={28} color="var(--accent-cyan)" />
          </div>
          <p>Loading leave requests...</p>
        </div>
      ) : filteredLeaves.length === 0 ? (
        <div style={{
          padding: '4rem 1.5rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.15)',
        }}>
          <AlertCircle size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            No leave requests found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {searchTerm || currentStatusFilter || selectedType !== 'ALL'
              ? 'Try modifying your search query or status filter.'
              : 'Submit a new leave request using the button above to get started.'}
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.9rem',
          }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid var(--border-subtle)',
                background: 'rgba(0, 0, 0, 0.25)',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                <th style={{ padding: '0.9rem 1rem' }}>Employee</th>
                <th style={{ padding: '0.9rem 1rem' }}>Leave Type</th>
                <th style={{ padding: '0.9rem 1rem' }}>Duration & Dates</th>
                <th style={{ padding: '0.9rem 1rem' }}>Reason / Notes</th>
                <th style={{ padding: '0.9rem 1rem' }}>Status</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => {
                const days = calculateDays(leave.startDate, leave.endDate);
                return (
                  <tr
                    key={leave.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Employee info */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(6, 182, 212, 0.25))',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-cyan)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                        }}>
                          {leave.employeeName.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-bright)' }}>
                            {leave.employeeName}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            fontFamily: 'var(--font-mono)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}>
                            <User size={11} />
                            {leave.employeeId} · #{leave.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Leave Type */}
                    <td style={{ padding: '1rem' }}>
                      <span className="badge badge-type">
                        {leave.leaveType.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Duration & Dates */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
                        <Calendar size={13} color="var(--accent-indigo)" />
                        <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                          {leave.startDate} → {leave.endDate}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
                        {days} {days === 1 ? 'day' : 'days'}
                      </div>
                    </td>

                    {/* Reason */}
                    <td style={{ padding: '1rem', maxWidth: 220 }}>
                      <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: leave.reason ? 'var(--text-secondary)' : 'var(--text-muted)',
                        fontStyle: leave.reason ? 'normal' : 'italic',
                        fontSize: '0.85rem',
                      }}>
                        {leave.reason || 'No description provided'}
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '1rem' }}>
                      {getStatusBadge(leave.status)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        {/* Quick Approve / Reject for Pending */}
                        {leave.status === 'PENDING' && (
                          <>
                            <button
                              id={`approve-leave-${leave.id}`}
                              className="btn btn-sm btn-success"
                              onClick={() => onApprove(leave.id)}
                              title="Approve Request"
                              style={{ padding: '0.35rem 0.6rem' }}
                            >
                              <CheckCircle size={14} />
                              Approve
                            </button>
                            <button
                              id={`reject-leave-${leave.id}`}
                              className="btn btn-sm btn-danger"
                              onClick={() => onReject(leave.id)}
                              title="Reject Request"
                              style={{ padding: '0.35rem 0.6rem' }}
                            >
                              <XCircle size={14} />
                              Reject
                            </button>
                          </>
                        )}

                        {/* Cancel option for approved or pending */}
                        {(leave.status === 'APPROVED' || leave.status === 'PENDING') && (
                          <button
                            id={`cancel-leave-${leave.id}`}
                            className="btn btn-sm btn-outline"
                            onClick={() => onCancel(leave.id)}
                            title="Cancel Leave Request"
                            style={{ padding: '0.35rem 0.55rem' }}
                          >
                            <Ban size={14} />
                          </button>
                        )}

                        {/* View Details modal */}
                        <button
                          id={`view-leave-${leave.id}`}
                          className="btn btn-sm btn-outline"
                          onClick={() => onViewDetails(leave)}
                          title="View Request Details"
                          style={{ padding: '0.35rem 0.55rem' }}
                        >
                          <Eye size={14} />
                        </button>

                        {/* Delete permanently */}
                        <button
                          id={`delete-leave-${leave.id}`}
                          className="btn btn-sm btn-ghost"
                          onClick={() => {
                            if (window.confirm(`Permanently delete leave request #${leave.id}?`)) {
                              onDelete(leave.id);
                            }
                          }}
                          title="Delete Request"
                          style={{ padding: '0.35rem 0.55rem', color: 'var(--accent-rose)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
