/**
 * Recently Used Fields - localStorage Management
 * 
 * Tracks frequently used fields across workflow configurations
 * to provide quick access to commonly used data references.
 */

export interface RecentField {
  nodeId: string;
  nodeType: string;
  nodeName: string;
  fieldPath: string;
  icon?: string;
  usedAt: string;
  count: number;
}

const STORAGE_KEY = 'smartInput_recentFields';
const MAX_RECENT_FIELDS = 20;

/**
 * Get all recent fields from localStorage
 */
export function getRecentFields(): RecentField[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const fields = JSON.parse(stored) as RecentField[];
    
    // Filter out fields older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return fields.filter(f => new Date(f.usedAt) > thirtyDaysAgo);
  } catch (error) {
    console.error('Error reading recent fields:', error);
    return [];
  }
}

/**
 * Save a field to recent history
 */
export function saveRecentField(
  nodeId: string,
  nodeType: string,
  nodeName: string,
  fieldPath: string,
  icon?: string
): void {
  try {
    const recent = getRecentFields();
    
    // Find existing entry
    const existing = recent.find(
      r => r.nodeType === nodeType && r.fieldPath === fieldPath
    );
    
    if (existing) {
      // Update existing entry
      existing.count++;
      existing.usedAt = new Date().toISOString();
      existing.nodeName = nodeName; // Update in case node was renamed
      existing.nodeId = nodeId; // Update in case node ID changed
      if (icon) existing.icon = icon;
    } else {
      // Add new entry
      recent.push({
        nodeId,
        nodeType,
        nodeName,
        fieldPath,
        icon,
        usedAt: new Date().toISOString(),
        count: 1
      });
    }
    
    // Sort by usage count (most used first), then by recency
    recent.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime();
    });
    
    // Keep only top N fields
    const trimmed = recent.slice(0, MAX_RECENT_FIELDS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error saving recent field:', error);
  }
}

/**
 * Get recent fields filtered by available node types
 */
export function getRecentFieldsForNodes(
  availableNodeTypes: string[],
  limit: number = 5
): RecentField[] {
  const recent = getRecentFields();
  
  return recent
    .filter(f => availableNodeTypes.includes(f.nodeType))
    .slice(0, limit);
}

/**
 * Clear all recent fields
 */
export function clearRecentFields(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing recent fields:', error);
  }
}

/**
 * Format time ago for display (e.g., "2 minutes ago", "1 day ago")
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}
