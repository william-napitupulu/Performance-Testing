import React, { createContext, useContext } from 'react';
import { SharedPerformanceData } from './Tab1Components/types';
import { useTab1Data } from './Tab1Components/hooks/useTab1Data';
import { useTab1Actions } from './Tab1Components/hooks/useTab1Actions';

export interface Tab3ContextType {
  dataHook: ReturnType<typeof useTab1Data>;
  actionsHook: ReturnType<typeof useTab1Actions>;
  mInput: number;
}

const Tab3Context = createContext<Tab3ContextType | undefined>(undefined);

interface Tab3ProviderProps {
  sharedData: SharedPerformanceData;
  children: React.ReactNode;
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

export const Tab3Provider: React.FC<Tab3ProviderProps> = ({ sharedData, children, inputTagsData }) => {
  const mInput = 3;
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
  });

  // No more auto-fetch - data is passed from parent
  
  return (
    <Tab3Context.Provider value={{ dataHook, actionsHook, mInput }}>
      {children}
    </Tab3Context.Provider>
  );
};

export const useTab3Context = (): Tab3ContextType => {
  const ctx = useContext(Tab3Context);
  if (!ctx) {
    throw new Error('useTab3Context must be used within a Tab3Provider');
  }
  return ctx;
}; 