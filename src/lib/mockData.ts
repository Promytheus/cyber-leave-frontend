import { LeaveRequest } from '@/types/leave';

export const INITIAL_MOCK_LEAVES: LeaveRequest[] = [
  {
    id: 1,
    employeeId: "EMP-001",
    employeeName: "Alice Smith",
    leaveType: "ANNUAL",
    status: "APPROVED",
    startDate: "2026-11-01",
    endDate: "2026-11-05",
    reason: "Annual family vacation to the mountains",
    createdAt: "2026-10-10T09:30:00Z"
  },
  {
    id: 2,
    employeeId: "EMP-002",
    employeeName: "Bob Jones",
    leaveType: "SICK",
    status: "PENDING",
    startDate: "2026-10-15",
    endDate: "2026-10-16",
    reason: "Doctor appointment and recovery",
    createdAt: "2026-10-12T14:15:00Z"
  },
  {
    id: 3,
    employeeId: "EMP-003",
    employeeName: "Charlie Brown",
    leaveType: "ANNUAL",
    status: "PENDING",
    startDate: "2026-12-20",
    endDate: "2026-12-28",
    reason: "Winter holidays and year-end break",
    createdAt: "2026-10-13T08:00:00Z"
  },
  {
    id: 4,
    employeeId: "EMP-001",
    employeeName: "Alice Smith",
    leaveType: "REMOTE_WORK",
    status: "APPROVED",
    startDate: "2026-10-20",
    endDate: "2026-10-24",
    reason: "Working remotely from coastal hub",
    createdAt: "2026-10-01T11:20:00Z"
  },
  {
    id: 5,
    employeeId: "EMP-004",
    employeeName: "Diana Prince",
    leaveType: "MATERNITY",
    status: "APPROVED",
    startDate: "2026-11-15",
    endDate: "2027-02-15",
    reason: "Maternity leave",
    createdAt: "2026-09-25T16:45:00Z"
  },
  {
    id: 6,
    employeeId: "EMP-005",
    employeeName: "Evan Wright",
    leaveType: "UNPAID",
    status: "REJECTED",
    startDate: "2026-10-05",
    endDate: "2026-10-09",
    reason: "Personal sabbatical trial",
    createdAt: "2026-09-28T10:10:00Z"
  },
  {
    id: 7,
    employeeId: "EMP-002",
    employeeName: "Bob Jones",
    leaveType: "REMOTE_WORK",
    status: "CANCELLED",
    startDate: "2026-09-10",
    endDate: "2026-09-12",
    reason: "Relocating home office equipment",
    createdAt: "2026-09-02T13:00:00Z"
  }
];
