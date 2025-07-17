import React, { createContext, useContext } from 'react';
import { SharedPerformanceData } from './Tab1Components/types';
import { useTab1Data } from './Tab1Components/hooks/useTab1Data';
import { useTab1Actions } from './Tab1Components/hooks/useTab1Actions';

export interface Tab8ContextType {
  dataHook: ReturnType<typeof useTab1Data>;
  actionsHook: ReturnType<typeof useTab1Actions>;
  mInput: number;
}

const Tab8Context = createContext<Tab8ContextType | undefined>(undefined);

interface Tab8ProviderProps {
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

export const Tab8Provider: React.FC<Tab8ProviderProps> = ({ sharedData, children, inputTagsData, onDataSaved }) => {
  const mInput = 8;
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
    <Tab8Context.Provider value={{ dataHook, actionsHook, mInput }}>
      {children}
    </Tab8Context.Provider>
  );
};

export const useTab8Context = (): Tab8ContextType => {
  const ctx = useContext(Tab8Context);
  if (!ctx) {
    throw new Error('useTab8Context must be used within a Tab8Provider');
  }
  return ctx;
}; 