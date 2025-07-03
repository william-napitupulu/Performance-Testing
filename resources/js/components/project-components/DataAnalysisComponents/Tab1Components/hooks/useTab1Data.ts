import { useState, useEffect } from 'react';
import axios from 'axios';
import { InputTag, PerformanceRecord, SharedPerformanceData, SortConfig, FilterConfig } from '../types';
import { calculateTimeHeaders, processExistingInputs, groupTagsByJmInput } from '../utils';

export const useTab1Data = (sharedData: SharedPerformanceData) => {
  const [dateTime, setDateTime] = useState(sharedData.dateTime || '');
  const [inputTags, setInputTags] = useState<InputTag[]>([]);
  const [groupedTags, setGroupedTags] = useState<{ [jm: number]: InputTag[] }>({});
  const [groupedHeaders, setGroupedHeaders] = useState<{ [jm: number]: string[] }>({});
  const [groupedSlots, setGroupedSlots] = useState<{ [jm: number]: Date[] }>({});
  const [inputValuesByJm, setInputValuesByJm] = useState<{ [jm: number]: { [key: string]: string } }>({});
  const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>([]);
  const [selectedPerformance, setSelectedPerformance] = useState<PerformanceRecord | null>(null);
  const [sortConfigByJm, setSortConfigByJm] = useState<{ [jm: number]: SortConfig }>({});
  const [filtersByJm, setFiltersByJm] = useState<{ [jm: number]: FilterConfig }>({});

  // Fetch performance records on component mount
  useEffect(() => {
    fetchPerformanceRecords();
  }, []);

  // Auto-select performance if we have sharedData
  useEffect(() => {
    if (sharedData.perfId && performanceRecords.length > 0 && !selectedPerformance) {
      const matchingPerformance = performanceRecords.find(p => p.perf_id === sharedData.perfId);
      if (matchingPerformance) {
        setSelectedPerformance(matchingPerformance);
        setDateTime(sharedData.dateTime);
        fetchInputTags(sharedData.dateTime, sharedData.perfId);
      }
    }
  }, [sharedData.perfId, performanceRecords, selectedPerformance]);

  // Fetch all performance tests
  const fetchPerformanceRecords = async () => {
    try {
      const response = await axios.get('/api/performance-records');
      if (response.data.success) {
        setPerformanceRecords(response.data.performances);
      }
    } catch (error) {
      console.error('Error fetching performance records:', error);
    }
  };

  // Fetch input tags from the server
  const fetchInputTags = async (selectedDateTime: string, performanceId?: number) => {
    try {
      const response = await axios.get('/api/input-tags', {
        params: {
          datetime: selectedDateTime,
          perf_id: performanceId || sharedData.perfId
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Operation was not successful');
      }

      const processedTags = Array.isArray(response.data.input_tags) ? response.data.input_tags : [];
      setInputTags(processedTags);

      // Group tags by jm_input
      const { grouped, headersMap, slotsMap } = groupTagsByJmInput(processedTags, selectedDateTime, calculateTimeHeaders);
      setGroupedTags(grouped);
      setGroupedHeaders(headersMap);
      setGroupedSlots(slotsMap);

      // Process existing inputs to pre-populate the form
      const existingInputs = response.data.existing_inputs || {};
      const newInputValuesByJm = processExistingInputs(processedTags, existingInputs, selectedDateTime, calculateTimeHeaders);
      setInputValuesByJm(newInputValuesByJm);
    } catch (error) {
      console.error('Error fetching input tags:', error);
      setInputTags([]);
      setGroupedTags({});
      setGroupedHeaders({});
      setGroupedSlots({});
      setInputValuesByJm({});
    }
  };

  // Handle dropdown change
  const handlePerformanceSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const perfId = parseInt(event.target.value, 10);
    const perf = performanceRecords.find(p => p.perf_id === perfId) || null;
    setSelectedPerformance(perf);

    // Clear previous state
    setInputTags([]);
    setGroupedTags({});
    setGroupedHeaders({});
    setGroupedSlots({});
    setInputValuesByJm({});

    if (perf) {
      const perfDateTime = perf.date_perfomance || '';
      setDateTime(perfDateTime);
      if (perfDateTime) {
        fetchInputTags(perfDateTime, perf.perf_id);
      }
    } else {
      setDateTime('');
    }
  };

  return {
    // State
    dateTime,
    setDateTime,
    inputTags,
    groupedTags,
    groupedHeaders,
    groupedSlots,
    inputValuesByJm,
    setInputValuesByJm,
    performanceRecords,
    selectedPerformance,
    sortConfigByJm,
    setSortConfigByJm,
    filtersByJm,
    setFiltersByJm,
    
    // Functions
    fetchInputTags,
    handlePerformanceSelect,
  };
}; 