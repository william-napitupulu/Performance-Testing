import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { 
  DataAnalysisHeader, 
  DataAnalysisForm, 
  DataAnalysisStats, 
  DataAnalysisTable,
  type AnalysisData,
  type AnalysisFormData,
  type ApiResponse
} from '@/components/project-components';

// Mock data for the table
const mockTableData: AnalysisData[] = [
  {
    id: 1,
    no: 1,
    parameter: "Steam Temperature",
    uom: "°C",
    referenceData: 450.5,
    existingData: 445.2,
    gap: -5.3
  },
  {
    id: 2,
    no: 2,
    parameter: "Pressure Level",
    uom: "MPa",
    referenceData: 12.5,
    existingData: 12.8,
    gap: 0.3
  },
  {
    id: 3,
    no: 3,
    parameter: "Flow Rate",
    uom: "m³/h",
    referenceData: 1200.0,
    existingData: 1185.5,
    gap: -14.5
  },
  {
    id: 4,
    no: 4,
    parameter: "Efficiency",
    uom: "%",
    referenceData: 85.0,
    existingData: 82.3,
    gap: -2.7
  },
  {
    id: 5,
    no: 5,
    parameter: "Vibration Level",
    uom: "mm/s",
    referenceData: 2.5,
    existingData: 3.1,
    gap: 0.6
  }
];

export default function DataAnalysis() {
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisInfo, setAnalysisInfo] = useState<AnalysisFormData>({
    id: '',
    description: '',
    dateTime: ''
  });

  const handleFormSubmit = async (formData: AnalysisFormData) => {
    setLoading(true);
    setAnalysisInfo(formData);
    
    try {
      // Format the datetime for the API call
      const formattedDateTime = new Date(formData.dateTime).toISOString().slice(0, 19).replace('T', ' ');
      
      // Build the API URL using our Laravel backend proxy
      const apiUrl = `/api/dcs-data?perf_id=${encodeURIComponent(formData.id)}&tgl=${encodeURIComponent(formattedDateTime)}`;
      
      console.log('=== DATA ANALYSIS API CALL DEBUG ===');
      console.log('User Inputs:', formData);
      console.log('API URL:', apiUrl);
      
      // Make the API call
      const response = await fetch(apiUrl);
      const responseData: ApiResponse = await response.json();
      
      console.log('Response:', responseData);
      
      // Check if the backend request was successful
      if (!response.ok) {
        alert(`Backend Error: ${responseData.message || 'Unknown error'}`);
        return;
      }
      
      // Extract the actual DCS API response
      const responseText = responseData.data;
      
      // Process the response if successful
      if (response.ok && responseData.success) {
        console.log('✓ API call successful!');
        
        // Parse the response data to check for success
        const lines = responseText.trim().split('\n');
        let apiSuccess = false;
        
        // Look for JSON success indicator
        for (const line of lines) {
          try {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('[') || trimmedLine.startsWith('{')) {
              const data = JSON.parse(trimmedLine);
              if (Array.isArray(data) && data[0] && data[0].sukses === "1") {
                apiSuccess = true;
                break;
              }
            }
          } catch (e) {
            // Continue to next line
          }
        }
        
        if (apiSuccess) {
          // Show the analysis table
          setShowTable(true);
          alert('✓ Data retrieved successfully! Analysis table is now displayed.');
        } else {
          alert('⚠️ API responded but did not return success status. Check console for details.');
        }
      } else {
        alert('Failed to retrieve data from server.');
      }
      
    } catch (error) {
      console.error('API call error:', error);
      alert(`API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Head title="Performance Test - Data Analysis" />
      <div className="p-6 bg-background">
        <DataAnalysisHeader />
        
        <DataAnalysisForm 
          onSubmit={handleFormSubmit}
          loading={loading}
        />

        {showTable && (
          <>
            <DataAnalysisStats data={mockTableData} />
            <DataAnalysisTable 
              data={mockTableData} 
              analysisInfo={analysisInfo}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
} 