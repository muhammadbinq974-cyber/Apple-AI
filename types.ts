export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface StrategicReport {
  title: string;
  summary: string;
  googleAdvantage: string;
  recommendation: string;
  metrics?: { name: string; apple: number; google: number }[];
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  REPORTS = 'REPORTS'
}

export interface ChartData {
  name: string;
  Apple: number;
  Google: number;
}