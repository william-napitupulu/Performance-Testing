import React, { createContext, useContext } from 'react';
import { SharedPerformanceData } from './Tab1Components/types';
import { useTab1Data } from './Tab1Components/hooks/useTab1Data';
import { useTab1Actions } from './Tab1Components/hooks/useTab1Actions';

export interface Tab9ContextType {
  dataHook: ReturnType<typeof useTab1Data>;
  actionsHook: ReturnType<typeof useTab1Actions>;
  mInput: number;
}

const Tab9Context = createContext<Tab9ContextType | undefined>(undefined);

interface Tab9ProviderProps {
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

export const Tab9Provider: React.FC<Tab9ProviderProps> = ({ sharedData, children, inputTagsData, onDataSaved }) => {
  const mInput = 9;
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
    <Tab9Context.Provider value={{ dataHook, actionsHook, mInput }}>
      {children}
    </Tab9Context.Provider>
  );
};

export const useTab9Context = (): Tab9ContextType => {
  const ctx = useContext(Tab9Context);
  if (!ctx) {
    throw new Error('useTab9Context must be used within a Tab9Provider');
  }
  return ctx;
}; 