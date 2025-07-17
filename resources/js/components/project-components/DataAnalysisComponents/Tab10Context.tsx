import React, { createContext, useContext } from 'react';
import { SharedPerformanceData } from './Tab1Components/types';
import { useTab1Data } from './Tab1Components/hooks/useTab1Data';
import { useTab1Actions } from './Tab1Components/hooks/useTab1Actions';

export interface Tab10ContextType {
  dataHook: ReturnType<typeof useTab1Data>;
  actionsHook: ReturnType<typeof useTab1Actions>;
  mInput: number;
}

const Tab10Context = createContext<Tab10ContextType | undefined>(undefined);

interface Tab10ProviderProps {
  sharedData: SharedPerformanceData;
  children: React.ReactNode;
  onDataSaved?: () => Promise<void>;
  inputTagsData?: {
    input_tags: Array<{
      tag_no: string;
      description: string;
      unit_name: string;
      jm_input: number;
      group_id: number;
      urutan: number;
      m_input: number;
    }>;
    existing_inputs: Record<string, {
      tag_no: string;
      value: number;
      date_rec: string;
    }>;
  };
}

export const Tab10Provider: React.FC<Tab10ProviderProps> = ({ sharedData, children, inputTagsData, onDataSaved }) => {
  const mInput = 10;
  const dataHook = useTab1Data(sharedData, mInput, inputTagsData);
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
    onDataSaved,
  });

  // No more auto-fetch - data is passed from parent
  
  return (
    <Tab10Context.Provider value={{ dataHook, actionsHook, mInput }}>
      {children}
    </Tab10Context.Provider>
  );
};

export const useTab10Context = (): Tab10ContextType => {
  const ctx = useContext(Tab10Context);
  if (!ctx) {
    throw new Error('useTab10Context must be used within a Tab10Provider');
  }
  return ctx;
}; 