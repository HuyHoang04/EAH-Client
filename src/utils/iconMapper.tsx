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

/**
 * Get icon component by name
 * @param iconName - The name of the icon (e.g., 'mail', 'clock')
 * @param defaultIcon - Default icon to use if name not found
 * @returns Lucide icon component
 */
export function getIconComponent(
  iconName: string | undefined,
  defaultIcon: LucideIcon = Circle
): LucideIcon {
  if (!iconName) return defaultIcon;
  return iconMap[iconName.toLowerCase()] || defaultIcon;
}

/**
 * Render icon component with props
 * @param iconName - The name of the icon
 * @param className - Optional CSS classes
 * @returns React element
 */
export function renderIcon(
  iconName: string | undefined,
  className: string = 'w-5 h-5'
): React.ReactElement {
  const IconComponent = getIconComponent(iconName);
  return <IconComponent className={className} />;
}
