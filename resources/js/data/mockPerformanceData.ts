// Define the Performance interface matching the database structure
export interface Performance {
  id: number; // perf_id from database
  description: string;
  date_perfomance: string;
  date_created: string;
  status: 'Editable' | 'Locked';
  unit_id: number;
  unit_name?: string; // Optional for backward compatibility
  type?: string; // Type field
  weight?: string; // Weight field
}

// Mock data for development (will be replaced by actual database data)
export const mockPerformanceData: Performance[] = [
  {
    id: 1,
    description: "Boiler Efficiency Performance Check",
            date_perfomance: "2024-12-25",
    date_created: "2024-12-25 14:30:00",
    status: "Editable",
    unit_id: 1
  },
  {
    id: 2,
    description: "Turbine Performance Analysis",
            date_perfomance: "2024-12-24",
    date_created: "2024-12-24 09:15:00",
    status: "Locked",
    unit_id: 1
  },
  {
    id: 3,
    description: "Generator Load Test Performance",
            date_perfomance: "2024-12-23",
    date_created: "2024-12-23 16:45:00",
    status: "Editable",
    unit_id: 1
  },
  {
    id: 4,
    description: "Steam Cycle Performance Evaluation",
            date_perfomance: "2024-12-22",
    date_created: "2024-12-22 11:20:00",
    status: "Locked",
    unit_id: 1
  },
  {
    id: 5,
    description: "Heat Rate Performance Test",
            date_perfomance: "2024-12-21",
    date_created: "2024-12-21 08:00:00",
    status: "Editable",
    unit_id: 1
  }
]; 