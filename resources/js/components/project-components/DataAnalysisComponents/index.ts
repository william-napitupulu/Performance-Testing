// Export main components
export { DataAnalysisContainer } from './DataAnalysisContainer';
export { DataAnalysisForm } from './DataAnalysisForm';
export { DataAnalysisTable } from './DataAnalysisTable';
export { DataAnalysisFilters } from './DataAnalysisFilters';
export { DataAnalysisHeader } from './DataAnalysisHeader';
export { DataAnalysisStats } from './DataAnalysisStats';
export { DataAnalysisSearchFilters } from './DataAnalysisSearchFilters';
export { DataAnalysisPagination } from './DataAnalysisPagination';
export { DataAnalysisTableHeader } from './DataAnalysisTableHeader';

// Export special tabs
export { NewPerformanceTestTab } from './NewPerformanceTestTab';
export { RunTab } from './RunTab';
export { SaveDataTab } from './SaveDataTab';

// Export unified template system
export { UnifiedTabTemplate } from './UnifiedTabTemplate';
export { UniversalTabProvider, useUniversalTabContext } from './shared/UniversalTabContext';

// Export shared components
export * from './shared';

// Export Tab1 components (reusable components)
export * from './Tab1Components';

// Export types
export type { AnalysisData, ApiResponse } from './types';
export type { SharedPerformanceData, InputTag } from './Tab1Components/types';
export type { UniversalTabContextType } from './shared/UniversalTabContext';

// Individual Tab components (Tab1-Tab10) have been removed and replaced with UnifiedTabTemplate
// All functionality is now provided by the unified template system 