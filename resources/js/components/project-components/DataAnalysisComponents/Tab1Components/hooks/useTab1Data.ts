import { useState, useEffect } from 'react';
import axios from 'axios';
import { InputTag, PerformanceRecord, SharedPerformanceData, SortConfig, FilterConfig } from '../types';
import { calculateTimeHeaders, processExistingInputs, groupTagsByJmInput } from '../utils';

export const useTab1Data = (
  sharedData: SharedPerformanceData, 
  mInput?: number,
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
  }
) => {
  const [dateTime, setDateTime] = useState(sharedData.dateTime || '');
  const [inputTags, setInputTags] = useState<InputTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
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
        // Don't fetch input tags here - use passed data instead
      }
    }
  }, [sharedData.perfId, performanceRecords, selectedPerformance]);

  // Process passed input tags data
  useEffect(() => {
    if (inputTagsData && inputTagsData.input_tags && sharedData.dateTime) {
      setLoading(false);
      setLoadingTimeout(false);
      setNoDataFound(false);
      
      const processedTags = inputTagsData.input_tags.map(tag => ({
        tag_no: tag.tag_no,
        description: tag.description,
        unit_name: tag.unit_name,
        jm_input: tag.jm_input
      }));
      
      setInputTags(processedTags);
      
      if (processedTags.length === 0) {
        setNoDataFound(true);
      } else {
        // Group tags by jm_input
        const { grouped, headersMap, slotsMap } = groupTagsByJmInput(processedTags, sharedData.dateTime, calculateTimeHeaders);
        setGroupedTags(grouped);
        setGroupedHeaders(headersMap);
        setGroupedSlots(slotsMap);

        // Process existing inputs to pre-populate the form
        const existingInputs = inputTagsData.existing_inputs || {};
        const newInputValuesByJm = processExistingInputs(processedTags, existingInputs, sharedData.dateTime, calculateTimeHeaders);
        setInputValuesByJm(newInputValuesByJm);
      }
    }
  }, [inputTagsData, sharedData.dateTime]);

  // Fetch all performance tests
  const fetchPerformanceRecords = async () => {
    try {
      const response = await axios.get('/api/performance-records');
      if (response.data.success) {
        setPerformanceRecords(response.data.performances);
      }
    } catch (error: any) {
      // Only log actual errors (not aborts/cancellations) to console
      if (error.name !== 'AbortError' && error.code !== 'ERR_CANCELED') {
        console.error('Error fetching performance records:', error);
      }
    }
  };

  // Fetch input tags from the server
  const fetchInputTags = async (selectedDateTime: string, performanceId?: number) => {
    setLoading(true);
    setLoadingTimeout(false);
    setNoDataFound(false);
    
    // Create abort controller for timeout
    const abortController = new AbortController();
    
    // Set timeout for 10 seconds - abort the request
    const timeoutId = setTimeout(() => {
      abortController.abort();
      setLoadingTimeout(true);
      setLoading(false);
      setNoDataFound(true);
      // Clear any existing data when timeout occurs
      setInputTags([]);
      setGroupedTags({});
      setGroupedHeaders({});
      setGroupedSlots({});
      setInputValuesByJm({});
    }, 10000);
    
    try {
      const params: any = {
        datetime: selectedDateTime,
        perf_id: performanceId || sharedData.perfId
      };
      
      if (mInput !== undefined) {
        params.m_input = mInput;
      }
      
      const response = await axios.get('/api/input-tags', {
        params,
        signal: abortController.signal
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Operation was not successful');
      }

      const processedTags = Array.isArray(response.data.input_tags) ? response.data.input_tags : [];
      setInputTags(processedTags);

      // Check if no data was found
      if (processedTags.length === 0) {
        setNoDataFound(true);
      }

      // Group tags by jm_input
      const { grouped, headersMap, slotsMap } = groupTagsByJmInput(processedTags, selectedDateTime, calculateTimeHeaders);
      setGroupedTags(grouped);
      setGroupedHeaders(headersMap);
      setGroupedSlots(slotsMap);

      // Process existing inputs to pre-populate the form
      const existingInputs = response.data.existing_inputs || {};
      const newInputValuesByJm = processExistingInputs(processedTags, existingInputs, selectedDateTime, calculateTimeHeaders);
      setInputValuesByJm(newInputValuesByJm);
      
      // Clear timeout since we got a response
      clearTimeout(timeoutId);
      setLoading(false);
    } catch (error: any) {
      // Clear timeout first
      clearTimeout(timeoutId);
      
      // Check if error is due to abort (timeout)
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        // Don't log timeout errors to console - this is expected behavior
        // Don't modify state here since timeout callback already handled it
        return;
      }
      
      // Only log actual errors (not timeouts) to console
      console.error('Error fetching input tags:', error);
      setInputTags([]);
      setGroupedTags({});
      setGroupedHeaders({});
      setGroupedSlots({});
      setInputValuesByJm({});
      setNoDataFound(true);
      setLoading(false);
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
    loading,
    loadingTimeout,
    noDataFound,
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