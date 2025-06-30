-- Mock data for pt.tb_performance table
-- Insert sample performance testing records
-- Status: 1 = Editable, 0 = Locked

INSERT INTO pt.tb_performance (perf_id, description, date_perfomance, date_created, status, unit_id) VALUES
(1, 'Boiler Efficiency Performance Test - Monthly Check', '2024-12-20', '2024-12-20 08:30:00', 1, 1),
(2, 'Turbine Performance Analysis - Load Test', '2024-12-19', '2024-12-19 10:15:00', 0, 1),
(3, 'Generator Load Test Performance Evaluation', '2024-12-18', '2024-12-18 14:20:00', 1, 1),
(4, 'Steam Cycle Performance Assessment', '2024-12-17', '2024-12-17 09:45:00', 0, 1),
(5, 'Heat Rate Performance Monitoring', '2024-12-16', '2024-12-16 11:30:00', 1, 1),
(6, 'Condenser Performance Check', '2024-12-15', '2024-12-15 13:00:00', 1, 1),
(7, 'Feed Water System Performance Test', '2024-12-14', '2024-12-14 15:45:00', 0, 1),
(8, 'Auxiliary Power Consumption Analysis', '2024-12-13', '2024-12-13 07:20:00', 1, 1),
(9, 'Overall Plant Efficiency Review', '2024-12-12', '2024-12-12 16:10:00', 0, 1),
(10, 'Emissions Performance Testing', '2024-12-11', '2024-12-11 12:30:00', 1, 1),

-- Additional data for PLTU Paiton 2 (unit_id = 2)
(11, 'Boiler Performance Baseline Test', '2024-12-20', '2024-12-20 09:00:00', 1, 2),
(12, 'Turbine Vibration Performance Check', '2024-12-19', '2024-12-19 11:30:00', 0, 2),
(13, 'Generator Thermal Performance Test', '2024-12-18', '2024-12-18 13:15:00', 1, 2),
(14, 'Steam Quality Assessment', '2024-12-17', '2024-12-17 10:20:00', 1, 2),
(15, 'Cooling Water System Performance', '2024-12-16', '2024-12-16 14:45:00', 0, 2),

-- Additional data for other units
(16, 'Gas Turbine Performance Test', '2024-12-15', '2024-12-15 08:00:00', 1, 3),
(17, 'Combined Cycle Efficiency Check', '2024-12-14', '2024-12-14 10:30:00', 0, 4),
(18, 'Hydro Turbine Performance Analysis', '2024-12-13', '2024-12-13 12:00:00', 1, 24),
(19, 'Diesel Generator Load Test', '2024-12-12', '2024-12-12 14:15:00', 1, 142),
(20, 'Wind Turbine Performance Monitoring', '2024-12-11', '2024-12-11 16:30:00', 0, 5),

-- Recent performance tests
(21, 'Weekly Performance Monitoring - Week 51', '2024-12-21', '2024-12-21 07:00:00', 1, 1),
(22, 'Daily Performance Check - Shift A', '2024-12-22', '2024-12-22 06:30:00', 1, 1),
(23, 'Annual Performance Review Preparation', '2024-12-23', '2024-12-23 09:15:00', 0, 1),
(24, 'Emergency Performance Assessment', '2024-12-24', '2024-12-24 11:45:00', 1, 1),
(25, 'Year-End Performance Evaluation', '2024-12-25', '2024-12-25 14:30:00', 1, 1); 