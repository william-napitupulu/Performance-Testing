import { useState, useEffect, useRef } from 'react';
import { Save, ArrowUpDown } from 'lucide-react';
import axios from 'axios';
import { PerformanceInfo } from './Tab1Components/PerformanceInfo';
import { PerformanceSelector } from './Tab1Components/PerformanceSelector';

interface InputTag {
  tag_no: string;
  description: string;
  unit_name: string;
  jm_input: number;
}

interface SharedPerformanceData {
  description: string;
  dateTime: string;
  perfId?: number;
}

interface PerformanceRecord {
  perf_id: number;
  description: string;
  date_perfomance: string;
  date_created: string;
  status: string;
  unit_id: number;
  unit_name: string;
  formatted_label: string;
}

interface Tab1Props {
  sharedData: SharedPerformanceData;
}

interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  tag_no: string;
  description: string;
  unit_name: string;
}

export function Tab1({ sharedData }: Tab1Props) {
  const [dateTime, setDateTime] = useState(sharedData.dateTime || '');
  const [inputTags, setInputTags] = useState<InputTag[]>([]);
  const [filteredTags, setFilteredTags] = useState<InputTag[]>([]);
  const [groupedTags, setGroupedTags] = useState<{ [jm: number]: InputTag[] }>({});
  const [groupedHeaders, setGroupedHeaders] = useState<{ [jm: number]: string[] }>({});
  const [groupedSlots, setGroupedSlots] = useState<{ [jm: number]: Date[] }>({});
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);
  const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>([]);
  const [selectedPerformance, setSelectedPerformance] = useState<PerformanceRecord | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'tag_no', direction: 'asc' });
  const [filters, setFilters] = useState<FilterConfig>({ tag_no: '', description: '', unit_name: '' });

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

  // Apply filtering and sorting
  useEffect(() => {
    let filtered = [...inputTags];

    // Apply filters
    if (filters.tag_no) {
      filtered = filtered.filter(tag => 
        tag.tag_no.toLowerCase().includes(filters.tag_no.toLowerCase())
      );
    }
    if (filters.description) {
      filtered = filtered.filter(tag => 
        tag.description.toLowerCase().includes(filters.description.toLowerCase())
      );
    }
    if (filters.unit_name) {
      filtered = filtered.filter(tag => 
        tag.unit_name.toLowerCase().includes(filters.unit_name.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (sortConfig.field) {
        case 'tag_no':
          aValue = a.tag_no || '';
          bValue = b.tag_no || '';
          break;
        case 'description':
          aValue = a.description || '';
          bValue = b.description || '';
          break;
        case 'unit_name':
          aValue = a.unit_name || '';
          bValue = b.unit_name || '';
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredTags(filtered);

    // Update grouped tags with filtered data
    const grouped: { [jm: number]: InputTag[] } = {};
    const headersMap: { [jm: number]: string[] } = {};
    const slotsMap: { [jm: number]: Date[] } = {};

    filtered.forEach(tag => {
      const jm = tag.jm_input || 6;
      if (!grouped[jm]) {
        grouped[jm] = [];
        if (dateTime) {
          const { headers, slots } = calculateTimeHeaders(dateTime, jm);
          headersMap[jm] = headers;
          slotsMap[jm] = slots;
        }
      }
      grouped[jm].push(tag);
    });

    setGroupedTags(grouped);
    setGroupedHeaders(headersMap);
    setGroupedSlots(slotsMap);
  }, [inputTags, filters, sortConfig, dateTime]);

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

  // Calculate time headers and slots
  const calculateTimeHeaders = (baseTime: string, jmInput: number) => {
    if (!baseTime || !jmInput || jmInput <= 0) {
      return { headers: [], slots: [] };
    }
    
    const baseDate = new Date(baseTime);
    if (isNaN(baseDate.getTime())) {
      return { headers: [], slots: [] };
    }
    
    const intervalMinutes = 120 / jmInput; // 2 hours divided by jm_input
    const headers = [];
    const slots = [];

    for (let i = 0; i < jmInput; i++) {
      const time = new Date(baseDate);
      time.setMinutes(time.getMinutes() + (i * intervalMinutes));
      
      headers.push(time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }));
      
      slots.push(new Date(time));
    }

    return { headers, slots };
  };

  // Handle sorting
  const handleSort = (field: string) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle filtering
  const handleFilterChange = (field: keyof FilterConfig, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Render sort icon
  const renderSortIcon = (field: string) => {
    const iconBaseClasses = "h-3.5 w-3.5 ml-1.5 transition-colors";
    const iconColor = getHeaderColor(field);
    
    if (sortConfig.field !== field) {
      return <ArrowUpDown className={`${iconBaseClasses} ${iconColor}`} />;
    }
    return (
      <ArrowUpDown 
        className={`${iconBaseClasses} ${iconColor} ${
          sortConfig.direction === 'desc' ? 'rotate-180' : ''
        }`}
      />
    );
  };

  // Get header colors
  const getHeaderColor = (field: string) => {
    switch (field) {
      case 'tag_no':
        return 'text-blue-700 dark:text-blue-300 group-hover:text-green-700 dark:group-hover:text-green-300';
      case 'description':
        return 'text-emerald-700 dark:text-emerald-300 group-hover:text-green-700 dark:group-hover:text-green-300';
      case 'unit_name':
        return 'text-violet-700 dark:text-violet-300 group-hover:text-green-700 dark:group-hover:text-green-300';
      default:
        return 'text-gray-600 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-300';
    }
  };

  // Handle input value changes
  const handleInputChange = (tagNo: string, timeIndex: number, value: string) => {
    const key = `${tagNo}_${timeIndex}`;
    setInputValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Get input value for a specific tag and time index
  const getInputValue = (tagNo: string, timeIndex: number): string => {
    const key = `${tagNo}_${timeIndex}`;
    return inputValues[key] || '';
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

      // Process existing inputs to pre-populate the form
      const existingInputs = response.data.existing_inputs || {};
      const newInputValues: { [key: string]: string } = {};

      if (Object.keys(existingInputs).length > 0) {
        processedTags.forEach((tag: InputTag, tagIndex: number) => {
          const safeTagNo = tag?.tag_no || `empty-tag-${tagIndex}`;
          
          if (tag?.tag_no) {
            const jm = tag.jm_input || 6;
            const { slots } = calculateTimeHeaders(selectedDateTime, jm);
            slots.forEach((slot: Date, timeIndex: number) => {
              // Format the slot time to match database format
              const year = slot.getFullYear();
              const month = String(slot.getMonth() + 1).padStart(2, '0');
              const day = String(slot.getDate()).padStart(2, '0');
              const hours = String(slot.getHours()).padStart(2, '0');
              const minutes = String(slot.getMinutes()).padStart(2, '0');
              const seconds = String(slot.getSeconds()).padStart(2, '0');
              const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
              
              const existingKey = `${tag.tag_no}_${formattedDateTime}`;
              const inputKey = `${safeTagNo}_${timeIndex}`;
              
              if (existingInputs[existingKey]) {
                newInputValues[inputKey] = String(existingInputs[existingKey].value);
              }
            });
          }
        });
      }

      setInputValues(newInputValues);
    } catch (error) {
      console.error('Error fetching input tags:', error);
      setInputTags([]);
      setGroupedTags({});
      setGroupedHeaders({});
      setGroupedSlots({});
      setInputValues({});
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
    setInputValues({});

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

  // Save manual input data
  const handleSaveData = async () => {
    const activePerf = selectedPerformance || (sharedData.perfId ? { perf_id: sharedData.perfId } : null);
    if (!activePerf) {
      alert('No performance ID available. Please select a performance test first.');
      return;
    }

    const dataToSave = [];
    
    for (let index = 0; index < inputTags.length; index++) {
      const tag = inputTags[index];
      const safeTagNo = tag?.tag_no || `empty-tag-${index}`;
      
      if (!tag?.tag_no) continue;
      
      const slotsForTag = groupedSlots[tag.jm_input || 6] || [];
      for (let timeIndex = 0; timeIndex < slotsForTag.length; timeIndex++) {
        const value = getInputValue(safeTagNo, timeIndex);
        
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
    }

    if (dataToSave.length === 0) {
      alert('No data to save. Please enter some values first.');
      return;
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
      } else {
        throw new Error(response.data.message || 'Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Check if there's any data to save
  const hasDataToSave = () => {
    return Object.values(inputValues).some(value => value && value.trim() !== '');
  };

  const headerBaseClasses = "group py-2.5 text-[11px] font-medium uppercase tracking-wider select-none cursor-pointer hover:bg-green-50/70 dark:hover:bg-green-900/20 transition-colors";

  return (
    <div className="p-6 bg-background rounded-b-lg border border-border dark:border-border/50">
      {/* Performance Test Info */}
      <PerformanceInfo sharedData={sharedData} />

      {/* Performance Test Selector */}
      <PerformanceSelector
        performanceRecords={performanceRecords}
        selectedPerfId={selectedPerformance?.perf_id ?? null}
        onSelect={(perfId) => {
          // mimic previous handlePerformanceSelect logic
          const fakeEvent = { target: { value: String(perfId) } } as unknown as React.ChangeEvent<HTMLSelectElement>;
          handlePerformanceSelect(fakeEvent);
        }}
      />

      {/* Grouped Input Tables */}
      {Object.keys(groupedTags).map(jmKey => {
        const jm = parseInt(jmKey, 10);
        const tags = groupedTags[jm];
        const headers = groupedHeaders[jm] || [];
        
        return (
          <div key={jm} className="mb-8">
            <div className="rounded-lg shadow-lg overflow-hidden bg-card dark:bg-gray-800 border border-border dark:border-gray-700">
              <div className="px-6 py-4 bg-blue-50/70 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-800/50">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                  Manual Input - {jm} Time Slots ({120/jm} minute intervals)
                </h3>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Total Tags: {tags.length}
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-blue-100 dark:divide-gray-700">
                  <thead className="bg-blue-50/70 dark:bg-gray-800/70 border-y border-blue-100 dark:border-gray-700">
                    <tr>
                      <th className={`${headerBaseClasses} px-6 ${getHeaderColor('tag_no')}`} onClick={() => handleSort('tag_no')}>
                        <div className="flex items-center">
                          Tag No {renderSortIcon('tag_no')}
                        </div>
                      </th>
                      <th className={`${headerBaseClasses} px-6 ${getHeaderColor('description')}`} onClick={() => handleSort('description')}>
                        <div className="flex items-center">
                          Description {renderSortIcon('description')}
                        </div>
                      </th>
                      <th className={`${headerBaseClasses} px-6 ${getHeaderColor('unit_name')}`} onClick={() => handleSort('unit_name')}>
                        <div className="flex items-center">
                          Unit {renderSortIcon('unit_name')}
                        </div>
                      </th>
                      {headers.map((header, index) => (
                        <th 
                          key={`${jm}-header-${index}`}
                          className="py-3 px-6 text-center text-sm font-semibold text-gray-700 dark:text-gray-200"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                    {/* Filter Row */}
                    <tr className="bg-blue-50/30 dark:bg-blue-900/10">
                      <td className="px-6 py-2">
                        <input
                          type="text"
                          placeholder="Search Tag No..."
                          className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                          value={filters.tag_no}
                          onChange={(e) => handleFilterChange('tag_no', e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-2">
                        <input
                          type="text"
                          placeholder="Search Description..."
                          className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                          value={filters.description}
                          onChange={(e) => handleFilterChange('description', e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-2">
                        <input
                          type="text"
                          placeholder="Search Unit..."
                          className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                          value={filters.unit_name}
                          onChange={(e) => handleFilterChange('unit_name', e.target.value)}
                        />
                      </td>
                     
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100 dark:divide-gray-700">
                    {tags.length === 0 ? (
                      <tr>
                        <td colSpan={3 + headers.length} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          No tags found matching the current filters
                        </td>
                      </tr>
                    ) : (
                      tags.map((tag, index) => {
                        const safeTagNo = tag?.tag_no || `empty-tag-${index}`;
                        const uniqueKey = `${jm}-tag-${index}-${safeTagNo}`;
                        
                        return (
                          <tr 
                            key={uniqueKey}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <td className="px-6 py-4 text-blue-700 dark:text-blue-300 font-medium">
                              {tag?.tag_no || `[No Tag #${index + 1}]`}
                            </td>
                            <td className="px-6 py-4 text-emerald-700 dark:text-emerald-300">
                              {tag?.description || '[No Description]'}
                            </td>
                            <td className="px-6 py-4 text-violet-700 dark:text-violet-300">
                              {tag?.unit_name || '[No Unit]'}
                            </td>
                                                          {headers.map((_, timeIndex) => (
                                <td 
                                  key={`${uniqueKey}-time-${timeIndex}`}
                                  className="px-6 py-4 text-center"
                                >
                                  <input
                                    type="number"
                                    step="any"
                                    value={getInputValue(safeTagNo, timeIndex)}
                                    onChange={(e) => handleInputChange(safeTagNo, timeIndex, e.target.value)}
                                    onKeyDown={(e) => {
                                      // Allow: backspace, delete, tab, escape, enter, decimal point, minus sign
                                      if ([8, 9, 27, 13, 46, 110, 190, 189, 109].indexOf(e.keyCode) !== -1 ||
                                          // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
                                          (e.keyCode === 65 && e.ctrlKey) ||
                                          (e.keyCode === 67 && e.ctrlKey) ||
                                          (e.keyCode === 86 && e.ctrlKey) ||
                                          (e.keyCode === 88 && e.ctrlKey) ||
                                          (e.keyCode === 90 && e.ctrlKey) ||
                                          // Allow: home, end, left, right, down, up
                                          (e.keyCode >= 35 && e.keyCode <= 40)) {
                                        return;
                                      }
                                      // Ensure that it is a number and stop the keypress
                                      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                                        e.preventDefault();
                                      }
                                    }}
                                    onPaste={(e) => {
                                      // Get pasted text
                                      const pastedText = e.clipboardData.getData('text');
                                      // Check if it's a valid number (including decimals and negative numbers)
                                      if (!/^-?\d*\.?\d*$/.test(pastedText)) {
                                        e.preventDefault();
                                      }
                                    }}
                                    placeholder="0.00"
                                    className="w-28 px-3 py-2 text-sm border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                </td>
                              ))}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}

      {/* Save Button */}
      {filteredTags.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSaveData}
            disabled={saving || !hasDataToSave()}
            className={`
              inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors
              ${saving || !hasDataToSave()
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
              }
            `}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Manual Input Data
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
} 