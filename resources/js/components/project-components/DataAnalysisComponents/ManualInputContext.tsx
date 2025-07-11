import React, { createContext, useContext } from 'react';
import { SharedPerformanceData } from './Tab1Components/types';
import { useTab1Data } from './Tab1Components/hooks/useTab1Data';
import { useTab1Actions } from './Tab1Components/hooks/useTab1Actions';

export interface ManualInputContextType {
  // Spread of dataHook and actionsHook
  dataHook: ReturnType<typeof useTab1Data>;
  actionsHook: ReturnType<typeof useTab1Actions>;
  mInput?: number;
}

const ManualInputContext = createContext<ManualInputContextType | undefined>(undefined);

interface ManualInputProviderProps {
  sharedData: SharedPerformanceData;
  children: React.ReactNode;
  mInput?: number; // Add mInput prop to specify which m_input value to use
}

export const ManualInputProvider: React.FC<ManualInputProviderProps> = ({ 
  sharedData, 
  children, 
  mInput // No default value
}) => {
  const dataHook = useTab1Data(sharedData, mInput);
  const actionsHook = useTab1Actions({
    inputValuesByJm: dataHook.inputValuesByJm,
    setInputValuesByJm: dataHook.setInputValuesByJm,
    sortConfigByJm: dataHook.sortConfigByJm,
    setSortConfigByJm: dataHook.setSortConfigByJm,
    filtersByJm: dataHook.filtersByJm,
    setFiltersByJm: dataHook.setFiltersByJm,
    inputTags: dataHook.inputTags,
    groupedTags: dataHook.groupedTags,
    groupedSlots: dataHook.groupedSlots,
    dateTime: dataHook.dateTime,
    fetchInputTags: dataHook.fetchInputTags,
  });

  // Auto-fetch input tags when performance data is available
  React.useEffect(() => {
    if (sharedData.dateTime && sharedData.perfId && dataHook.inputTags.length === 0) {
      dataHook.fetchInputTags(sharedData.dateTime, sharedData.perfId);
    }
  }, [sharedData.dateTime, sharedData.perfId, dataHook.inputTags.length, dataHook.fetchInputTags]);

  return (
    <ManualInputContext.Provider value={{ dataHook, actionsHook, mInput }}>
      {children}
    </ManualInputContext.Provider>
  );
};

export const useManualInput = (): ManualInputContextType => {
  const ctx = useContext(ManualInputContext);
  if (!ctx) {
    throw new Error('useManualInput must be used within a ManualInputProvider');
  }
  return ctx;
}; 