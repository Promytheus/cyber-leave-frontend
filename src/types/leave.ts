export type LeaveType = 
  | 'ANNUAL' 
  | 'SICK' 
  | 'UNPAID' 
  | 'MATERNITY' 
  | 'PATERNITY' 
  | 'REMOTE_WORK';

export type LeaveStatus = 
  | 'PENDING' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'CANCELLED';

export interface LeaveRequest {
  id: number;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  status: LeaveStatus;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  reason?: string | null;
  createdAt: string; // ISO 8601 date-time string
}

export interface CreateLeaveRequestDto {
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string | null;
}

export interface UpdateLeaveStatusDto {
  status: LeaveStatus;
}

export interface ActuatorHealth {
  status: 'UP' | 'DOWN' | 'OUT_OF_SERVICE' | 'UNKNOWN' | string;
  components?: Record<string, { status: string; details?: Record<string, unknown> }>;
  details?: Record<string, unknown>;
}

export interface ActuatorInfo {
  app?: {
    name?: string;
    version?: string;
    description?: string;
  };
  build?: {
    artifact?: string;
    name?: string;
    time?: string;
    version?: string;
  };
  [key: string]: unknown;
}

export interface ActuatorMetrics {
  names: string[];
}

export interface MetricDetail {
  name: string;
  description?: string;
  baseUnit?: string;
  measurements?: Array<{ statistic: string; value: number }>;
}
