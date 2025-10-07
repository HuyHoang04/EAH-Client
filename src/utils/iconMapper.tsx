/**
 * Icon Mapper Utility
 * Maps icon names (strings) to Lucide React icon components
 */

import React from 'react';
import {
  Mail,
  Clock,
  Save,
  BarChart3,
  BarChart,
  RefreshCw,
  Globe,
  GitBranch,
  Download,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Search,
  Link,
  Inbox,
  Check,
  Settings,
  Circle,
  LucideIcon
} from 'lucide-react';

// Icon name to component mapping
const iconMap: Record<string, LucideIcon> = {
  'mail': Mail,
  'clock': Clock,
  'save': Save,
  'bar-chart-3': BarChart3,
  'bar-chart': BarChart,
  'refresh-cw': RefreshCw,
  'globe': Globe,
  'git-branch': GitBranch,
  'download': Download,
  'help-circle': HelpCircle,
  'check-circle': CheckCircle,
  'alert-triangle': AlertTriangle,
  'trending-up': TrendingUp,
  'calendar': Calendar,
  'search': Search,
  'link': Link,
  'inbox': Inbox,
  'check': Check,
  'settings': Settings,
  'circle': Circle,
};

export function getIconComponent(
  iconName: string | undefined,
  defaultIcon: LucideIcon = Circle
): LucideIcon {
  if (!iconName) return defaultIcon;
  return iconMap[iconName.toLowerCase()] || defaultIcon;
}

export function renderIcon(
  iconName: string | undefined,
  className: string = 'w-5 h-5'
): React.ReactElement {
  const IconComponent = getIconComponent(iconName);
  return <IconComponent className={className} />;
}
