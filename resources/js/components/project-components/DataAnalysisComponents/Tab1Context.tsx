import React, { createContext, useContext } from 'react';
import { SharedPerformanceData } from './Tab1Components/types';
import { useTab1Data } from './Tab1Components/hooks/useTab1Data';
import { useTab1Actions } from './Tab1Components/hooks/useTab1Actions';

export interface Tab1ContextType {
  dataHook: ReturnType<typeof useTab1Data>;
  actionsHook: ReturnType<typeof useTab1Actions>;
  mInput: number;
}

const Tab1Context = createContext<Tab1ContextType | undefined>(undefined);

interface Tab1ProviderProps {
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

export const Tab1Provider: React.FC<Tab1ProviderProps> = ({ sharedData, children, inputTagsData }) => {
  const mInput = 1;
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
    <Tab1Context.Provider value={{ dataHook, actionsHook, mInput }}>
      {children}
    </Tab1Context.Provider>
  );
};

export const useTab1Context = (): Tab1ContextType => {
  const ctx = useContext(Tab1Context);
  if (!ctx) {
    throw new Error('useTab1Context must be used within a Tab1Provider');
  }
  return ctx;
}; 