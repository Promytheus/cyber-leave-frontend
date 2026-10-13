import { 
  LeaveRequest, 
  LeaveStatus, 
  CreateLeaveRequestDto, 
  ActuatorHealth, 
  ActuatorInfo, 
  ActuatorMetrics,
  MetricDetail
} from '@/types/leave';
import { INITIAL_MOCK_LEAVES } from './mockData';

const STORAGE_KEY = 'cyber_leave_mock_records_v1';
const PREF_MODE_KEY = 'cyber_leave_prefer_live_mode';

export class ApiClient {
  private baseUrl: string;

  constructor() {
    // Default to the backend URL or Next.js proxy route
    this.baseUrl = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL 
      ? process.env.NEXT_PUBLIC_API_URL 
      : '/backend-api';
  }

  // Local storage mock helpers
  private getMockStore(): LeaveRequest[] {
    if (typeof window === 'undefined') return INITIAL_MOCK_LEAVES;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_LEAVES));
        return INITIAL_MOCK_LEAVES;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_MOCK_LEAVES;
    }
  }

  private saveMockStore(records: LeaveRequest[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  public resetMockData(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_LEAVES));
  }

  public isPreferredLive(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(PREF_MODE_KEY) === 'true';
  }

  public setPreferredLive(preferred: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PREF_MODE_KEY, preferred ? 'true' : 'false');
  }

  // Actuator endpoints
  async checkHealth(): Promise<{ live: boolean; data?: ActuatorHealth; error?: string; latencyMs: number }> {
    const start = performance.now();
    try {
      const res = await fetch(`${this.baseUrl}/actuator/health`, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      const latencyMs = Math.round(performance.now() - start);
      if (!res.ok) {
        return { live: false, latencyMs, error: `HTTP ${res.status}: ${res.statusText}` };
      }
      const data: ActuatorHealth = await res.json();
      return { live: true, data, latencyMs };
    } catch (err: unknown) {
      const latencyMs = Math.round(performance.now() - start);
      const msg = err instanceof Error ? err.message : 'Connection refused';
      return { live: false, latencyMs, error: msg };
    }
  }

  async getInfo(): Promise<ActuatorInfo> {
    try {
      const res = await fetch(`${this.baseUrl}/actuator/info`, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch {}
    return {
      app: {
        name: "Cyber Leave Management Service",
        version: "1.0.0",
        description: "HR Presence & Leave Management Engine"
      },
      build: {
        artifact: "cyber-leave-service",
        version: "1.0.0",
        time: "2026-10-13T10:00:00Z"
      }
    };
  }

  async getMetrics(): Promise<ActuatorMetrics> {
    try {
      const res = await fetch(`${this.baseUrl}/actuator/metrics`, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch {}
    return {
      names: [
        "jvm.memory.used",
        "jvm.memory.max",
        "system.cpu.usage",
        "process.uptime",
        "http.server.requests",
        "jvm.threads.live"
      ]
    };
  }

  async getMetricDetail(name: string): Promise<MetricDetail | null> {
    try {
      const res = await fetch(`${this.baseUrl}/actuator/metrics/${name}`, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch {}
    return {
      name,
      description: `Metric for ${name}`,
      measurements: [{ statistic: 'VALUE', value: Math.round(Math.random() * 100) }]
    };
  }

  // Leave Requests API (/api/v1/leaves)
  async getAllLeaves(status?: LeaveStatus, forceLive = false): Promise<LeaveRequest[]> {
    if (forceLive) {
      const url = status 
        ? `${this.baseUrl}/api/v1/leaves?status=${encodeURIComponent(status)}`
        : `${this.baseUrl}/api/v1/leaves`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to fetch leaves (status ${res.status})`);
      return await res.json();
    }

    // Mock Mode
    let records = this.getMockStore();
    if (status) {
      records = records.filter(r => r.status === status);
    }
    return records;
  }

  async getLeaveById(id: number, forceLive = false): Promise<LeaveRequest> {
    if (forceLive) {
      const res = await fetch(`${this.baseUrl}/api/v1/leaves/${id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Leave #${id} not found`);
      return await res.json();
    }

    const records = this.getMockStore();
    const item = records.find(r => r.id === id);
    if (!item) throw new Error(`Leave #${id} not found`);
    return item;
  }

  async getLeavesByEmployee(employeeId: string, forceLive = false): Promise<LeaveRequest[]> {
    if (forceLive) {
      const res = await fetch(`${this.baseUrl}/api/v1/leaves/employee/${encodeURIComponent(employeeId)}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to fetch employee leaves (${res.status})`);
      return await res.json();
    }

    const records = this.getMockStore();
    return records.filter(r => r.employeeId.toLowerCase() === employeeId.toLowerCase());
  }

  async createLeave(dto: CreateLeaveRequestDto, forceLive = false): Promise<LeaveRequest> {
    // Validate dates
    if (new Date(dto.endDate) < new Date(dto.startDate)) {
      throw new Error("End date cannot be before start date");
    }

    if (forceLive) {
      const res = await fetch(`${this.baseUrl}/api/v1/leaves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to create leave (${res.status})`);
      }
      return await res.json();
    }

    const records = this.getMockStore();
    const nextId = records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1;
    const newRecord: LeaveRequest = {
      id: nextId,
      employeeId: dto.employeeId.trim(),
      employeeName: dto.employeeName.trim(),
      leaveType: dto.leaveType,
      status: 'PENDING',
      startDate: dto.startDate,
      endDate: dto.endDate,
      reason: dto.reason || null,
      createdAt: new Date().toISOString()
    };

    records.unshift(newRecord);
    this.saveMockStore(records);
    return newRecord;
  }

  async updateLeaveStatus(id: number, status: LeaveStatus, forceLive = false): Promise<LeaveRequest> {
    if (forceLive) {
      const res = await fetch(`${this.baseUrl}/api/v1/leaves/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error(`Failed to update leave #${id} status`);
      return await res.json();
    }

    const records = this.getMockStore();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) throw new Error(`Leave #${id} not found`);

    records[index] = { ...records[index], status };
    this.saveMockStore(records);
    return records[index];
  }

  async deleteLeave(id: number, forceLive = false): Promise<void> {
    if (forceLive) {
      const res = await fetch(`${this.baseUrl}/api/v1/leaves/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok && res.status !== 204) {
        throw new Error(`Failed to delete leave #${id} (${res.status})`);
      }
      return;
    }

    const records = this.getMockStore();
    const updated = records.filter(r => r.id !== id);
    if (updated.length === records.length) {
      throw new Error(`Leave #${id} not found`);
    }
    this.saveMockStore(updated);
  }
}

export const api = new ApiClient();
