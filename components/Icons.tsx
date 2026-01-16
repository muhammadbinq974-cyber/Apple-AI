import React from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  Zap, 
  Settings, 
  ChevronRight, 
  Cpu, 
  Send,
  RefreshCcw,
  LayoutDashboard
} from 'lucide-react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 1.44S9.22 5 7 5a4.91 4.91 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
    <path d="M10 2c1 0 2 .88 2 2a2 2 0 0 1-2 2c-1 0-2-.88-2-2a2 2 0 0 1 2-2Z" />
  </svg>
);

export { 
  BarChart3, 
  MessageSquare, 
  Zap, 
  Settings, 
  ChevronRight, 
  Cpu, 
  Send,
  RefreshCcw,
  LayoutDashboard
};