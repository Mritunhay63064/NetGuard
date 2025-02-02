export interface NetworkDevice {
  id: string;
  ip: string;
  connectionDuration: string;
  protocol: string;
  ports: string[];
  status: 'active' | 'inactive';
  lastSeen: string;
}

export interface NetworkStats {
  packetsPerSecond: number;
  bandwidthUsage: number;
  activeConnections: number;
  alertsCount: number;
}

export interface ScanResult {
  id: string;
  url: string;
  targetInfo: {
    ip: string;
    hostname: string;
    port: string;
    server: string;
  };
  timing: {
    startTime: string;
    endTime: string;
    duration: string;
  };
  status: 'scanning' | 'completed' | 'failed';
  summary: {
    totalErrors: number;
    totalIssues: number;
    isSuccessful: boolean;
  };
  vulnerabilities: Vulnerability[];
}

export interface Vulnerability {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  recommendation?: string;
  timestamp: string;
  status: 'open' | 'resolved';
}