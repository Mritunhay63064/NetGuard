export interface NetworkDevice {
  id: string;
  ip: string;
  connectionDuration: string;
  protocol: string;
  ports: string[];
  status: 'active' | 'inactive';
  lastSeen: string;
}

export interface Vulnerability {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendation: string;
  timestamp: string;
  status: 'open' | 'resolved';
}

export interface ScanResult {
  id: string;
  url: string;
  timestamp: string;
  status: 'scanning' | 'completed' | 'failed';
  vulnerabilities: Vulnerability[];
}

export interface NetworkStats {
  packetsPerSecond: number;
  bandwidthUsage: number;
  activeConnections: number;
  alertsCount: number;
}