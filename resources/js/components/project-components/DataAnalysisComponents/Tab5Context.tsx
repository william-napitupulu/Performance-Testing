import React, { createContext, useContext } from 'react';
import { SharedPerformanceData } from './Tab1Components/types';
import { useTab1Data } from './Tab1Components/hooks/useTab1Data';
import { useTab1Actions } from './Tab1Components/hooks/useTab1Actions';

export interface Tab5ContextType {
  dataHook: ReturnType<typeof useTab1Data>;
  actionsHook: ReturnType<typeof useTab1Actions>;
  mInput: number;
}

const Tab5Context = createContext<Tab5ContextType | undefined>(undefined);

interface Tab5ProviderProps {
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

export const Tab5Provider: React.FC<Tab5ProviderProps> = ({ sharedData, children, inputTagsData, onDataSaved }) => {
  const mInput = 5;
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
    <Tab5Context.Provider value={{ dataHook, actionsHook, mInput }}>
      {children}
    </Tab5Context.Provider>
  );
};

export const useTab5Context = (): Tab5ContextType => {
  const ctx = useContext(Tab5Context);
  if (!ctx) {
    throw new Error('useTab5Context must be used within a Tab5Provider');
  }
  return ctx;
}; 