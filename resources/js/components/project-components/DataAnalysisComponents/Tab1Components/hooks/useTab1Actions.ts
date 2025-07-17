import { useState } from 'react';
import axios from 'axios';
import { InputTag, SortConfig, FilterConfig } from '../types';
import { getFilteredAndSortedTags } from '../utils';

interface UseTab1ActionsProps {
  inputValuesByJm: { [jm: number]: { [key: string]: string } };
  setInputValuesByJm: React.Dispatch<React.SetStateAction<{ [jm: number]: { [key: string]: string } }>>;
  sortConfigByJm: { [jm: number]: SortConfig };
  setSortConfigByJm: React.Dispatch<React.SetStateAction<{ [jm: number]: SortConfig }>>;
  filtersByJm: { [jm: number]: FilterConfig };
  setFiltersByJm: React.Dispatch<React.SetStateAction<{ [jm: number]: FilterConfig }>>;
  inputTags: InputTag[];
  groupedTags: { [jm: number]: InputTag[] };
  groupedSlots: { [jm: number]: Date[] };
  dateTime: string;
  fetchInputTags: (selectedDateTime: string, performanceId?: number) => Promise<void>;
  onDataSaved?: () => Promise<void>;
}

export const useTab1Actions = ({
  inputValuesByJm,
  setInputValuesByJm,
  sortConfigByJm,
  setSortConfigByJm,
  filtersByJm,
  setFiltersByJm,
  inputTags,
  groupedTags,
  groupedSlots,
  dateTime,
  fetchInputTags,
  onDataSaved,
}: UseTab1ActionsProps) => {
  const [saving, setSaving] = useState(false);

  // Handle input value changes
  const handleInputChange = (jm: number, tagNo: string, timeIndex: number, value: string) => {
    const key = `${tagNo}_${timeIndex}`;
    setInputValuesByJm(prev => ({
      ...prev,
      [jm]: {
        ...prev[jm],
        [key]: value
      }
    }));
  };

  // Get input value for a specific tag and time index
  const getInputValue = (jm: number, tagNo: string, timeIndex: number): string => {
    const key = `${tagNo}_${timeIndex}`;
    return inputValuesByJm[jm]?.[key] || '';
  };

  // Handle sorting for specific jm group
  const handleSort = (jm: number, field: string) => {
    setSortConfigByJm(prev => ({
      ...prev,
      [jm]: {
        field,
        direction: prev[jm]?.field === field && prev[jm]?.direction === 'asc' ? 'desc' : 'asc'
      }
    }));
  };

  // Handle filtering for specific jm group
  const handleFilterChange = (jm: number, field: keyof FilterConfig, value: string) => {
    setFiltersByJm(prev => ({
      ...prev,
      [jm]: {
        ...prev[jm],
        [field]: value
      }
    }));
  };

  // Save manual input data
  const handleSaveData = async (selectedPerformance: any, sharedData: any): Promise<boolean> => {
    const activePerf = selectedPerformance || (sharedData.perfId ? { perf_id: sharedData.perfId } : null);
    if (!activePerf) {
      alert('No performance ID available. Please select a performance test first.');
      return false;
    }

    const dataToSave: Array<{
      tag_no: string;
      value: number;
      date_rec: string;
      perf_id: number;
    }> = [];
    
    // Only save data from currently filtered/visible tags
    Object.keys(groupedTags).forEach(jmKey => {
      const jm = parseInt(jmKey, 10);
      const allTags = groupedTags[jm];
      const filters = filtersByJm[jm] || { tag_no: '', description: '', unit_name: '' };
      const sortConfig = sortConfigByJm[jm] || { field: 'tag_no', direction: 'asc' };
      const visibleTags = getFilteredAndSortedTags(jm, allTags, filters, sortConfig); // Only the filtered tags
      const slotsForTag = groupedSlots[jm] || [];
      
      visibleTags.forEach((tag, index) => {
        const safeTagNo = tag?.tag_no || `empty-tag-${index}`;
        
        if (!tag?.tag_no) return;
        
        for (let timeIndex = 0; timeIndex < slotsForTag.length; timeIndex++) {
          const value = getInputValue(jm, safeTagNo, timeIndex);
          
          if (value && value.trim() !== '' && slotsForTag[timeIndex]) {
            const localDateTime = slotsForTag[timeIndex];
            const year = localDateTime.getFullYear();
            const month = String(localDateTime.getMonth() + 1).padStart(2, '0');
            const day = String(localDateTime.getDate()).padStart(2, '0');
            const hours = String(localDateTime.getHours()).padStart(2, '0');
            const minutes = String(localDateTime.getMinutes()).padStart(2, '0');
            const seconds = String(localDateTime.getSeconds()).padStart(2, '0');
            const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            
            dataToSave.push({
              tag_no: tag.tag_no,
              value: parseFloat(value),
              date_rec: formattedDateTime,
              perf_id: activePerf.perf_id
            });
          }
        }
      });
    });

    if (dataToSave.length === 0) {
      alert('No data to save. Please enter some values first.');
      return false;
    }

    setSaving(true);
    try {
      const response = await axios.post('/api/data-analysis/save-manual-input', {
        data: dataToSave
      });

      if (response.data.success) {
        alert(`Successfully saved ${dataToSave.length} records!`);
        // Re-fetch the latest values to update the table instead of clearing inputs
        if (dateTime) {
          await fetchInputTags(dateTime, activePerf.perf_id);
        }
        // Trigger refetch of main data table
        if (onDataSaved) {
          await onDataSaved();
        }
      } else {
        throw new Error(response.data.message || 'Failed to save data');
      }
    } catch (error: any) {
      // Only log actual errors (not aborts/cancellations) to console
      if (error.name !== 'AbortError' && error.code !== 'ERR_CANCELED') {
        console.error('Error saving data:', error);
      }
      alert('Failed to save data. Please try again.');
    } finally {
      setSaving(false);
    }
    return true;
  };

  // Check if there's any data to save
  const hasDataToSave = () => {
    return Object.values(inputValuesByJm).some(jmValues => 
      Object.values(jmValues).some(value => value && value.trim() !== '')
    );
  };

  return {
    saving,
    handleInputChange,
    getInputValue,
    handleSort,
    handleFilterChange,
    handleSaveData,
    hasDataToSave,
  };
}; 