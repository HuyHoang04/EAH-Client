'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define tab types
export type TabType = 'dashboard' | 'network' | 'files';

// Define context interface
interface TabContextProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

// Create the context with default values
const TabContext = createContext<TabContextProps>({
  activeTab: 'dashboard',
  setActiveTab: () => {},
});

// Create a provider component
export function TabProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}

// Create a hook to use the tab context
export function useTab() {
  return useContext(TabContext);
}
