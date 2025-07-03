import React, { createContext, useContext } from 'react';
import { SharedPerformanceData } from './Tab1Components/types';
import { useTab1Data } from './Tab1Components/hooks/useTab1Data';
import { useTab1Actions } from './Tab1Components/hooks/useTab1Actions';

export interface ManualInputContextType {
  // Spread of dataHook and actionsHook
  dataHook: ReturnType<typeof useTab1Data>;
  actionsHook: ReturnType<typeof useTab1Actions>;
}

const ManualInputContext = createContext<ManualInputContextType | undefined>(undefined);

interface ManualInputProviderProps {
  sharedData: SharedPerformanceData;
  children: React.ReactNode;
}

export const ManualInputProvider: React.FC<ManualInputProviderProps> = ({ sharedData, children }) => {
  const dataHook = useTab1Data(sharedData);
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

  return (
    <ManualInputContext.Provider value={{ dataHook, actionsHook }}>
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