// Export main components
export { DataAnalysisContainer } from './DataAnalysisContainer';
export { DataAnalysisFilters } from './DataAnalysisFilters';
export { DataAnalysisForm } from './DataAnalysisForm';
export { DataAnalysisHeader } from './DataAnalysisHeader';
export { DataAnalysisPagination } from './DataAnalysisPagination';
export { DataAnalysisSearchFilters } from './DataAnalysisSearchFilters';
export { DataAnalysisStats } from './DataAnalysisStats';
export { DataAnalysisTable } from './DataAnalysisTable';
export { DataAnalysisTableHeader } from './DataAnalysisTableHeader';

// Export special tabs
export { NewPerformanceTestTab } from './NewPerformanceTestTab';
export { RunTab } from './RunTab';
export { SaveDataTab } from './SaveDataTab';

// Export unified template system
export { UniversalTabProvider, useUniversalTabContext } from './shared/UniversalTabContext';
export { UnifiedTabTemplate } from './UnifiedTabTemplate';

// Export shared components
export * from './shared';

// Export Tab1 components (reusable components)
export * from './Tab1Components';

// Export types
export type { UniversalTabContextType } from './shared/UniversalTabContext';
export type { InputTag, SharedPerformanceData } from './Tab1Components/types';
export type { AnalysisData, ApiResponse } from './types';

// Individual Tab components (Tab1-Tab10) have been removed and replaced with UnifiedTabTemplate
// All functionality is now provided by the unified template system
