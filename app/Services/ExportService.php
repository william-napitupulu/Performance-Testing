<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Performance;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class ExportService
{
    private DataAnalysisService $dataAnalysisService;

    public function __construct(DataAnalysisService $dataAnalysisService)
    {
        $this->dataAnalysisService = $dataAnalysisService;
    }

    /**
     * Export analysis data to Excel
     */
    public function exportAnalysisData(Request $request, Performance $performance): void
    {
        // Get all data without pagination for export
        $tempRequest = clone $request;
        $tempRequest->merge(['per_page' => 999999]); // Get all records
        
        Log::info('Export: Getting filtered data', [
            'perf_id' => $performance->perf_id,
            'per_page' => $tempRequest->per_page,
            'has_filters' => $request->has(['filter_tag_no', 'filter_description', 'filter_value_min', 'filter_value_max'])
        ]);
        
        $result = $this->dataAnalysisService->getFilteredData($tempRequest, $performance->perf_id);
        $data = $result['data'];
        
        Log::info('Export: Data retrieved', [
            'perf_id' => $performance->perf_id,
            'data_count' => count($data),
            'total_records' => $result['pagination']['total'] ?? 0
        ]);

        // Create new PHPExcel object
        $objPHPExcel = new Spreadsheet();
        $objPHPExcel->setActiveSheetIndex(0);
        $activeSheet = $objPHPExcel->getActiveSheet();

        // Set document properties
        $objPHPExcel->getProperties()
            ->setCreator('Performance Testing System')
            ->setLastModifiedBy('Performance Testing System')
            ->setTitle('Analysis Data Export')
            ->setSubject('Performance Analysis Data')
            ->setDescription('Export of performance analysis data from DCS system');

        // Set sheet title
        $activeSheet->setTitle('Analysis Data');

        // Create header with performance info
        $activeSheet->setCellValue('A1', 'Performance Analysis Data Export');
        $activeSheet->mergeCells('A1:F1');
        $activeSheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
        $activeSheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Performance details
        $activeSheet->setCellValue('A3', 'Performance Details');
        $activeSheet->getStyle('A3')->getFont()->setBold(true)->setSize(12);
        
        $activeSheet->setCellValue('A4', 'Description:');
        $activeSheet->setCellValue('B4', $performance->description);
        
        $activeSheet->setCellValue('A5', 'Date/Time:');
        $activeSheet->setCellValue('B5', date('Y-m-d H:i:s', strtotime($performance->date_perfomance)));
        
        $activeSheet->setCellValue('A6', 'Performance ID:');
        $activeSheet->setCellValue('B6', $performance->perf_id);
        
        $activeSheet->setCellValue('A7', 'Total Records:');
        $activeSheet->setCellValue('B7', count($data));

        // Set column headers
        $headers = ['No', 'Tag No', 'Description', 'Min Value', 'Max Value', 'Average Value'];
        $headerRow = 9;
        
        foreach ($headers as $index => $header) {
            $column = chr(65 + $index); // A, B, C, etc.
            $activeSheet->setCellValue($column . $headerRow, $header);
        }

        // Style the headers
        $headerStyle = array(
            'font' => array(
                'bold' => true,
                'color' => array('rgb' => 'FFFFFF')
            ),
            'fill' => array(
                'fillType' => Fill::FILL_SOLID,
                'startColor' => array('rgb' => '4A90E2')
            ),
            'borders' => array(
                'allBorders' => array(
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => array('rgb' => '000000')
                )
            ),
            'alignment' => array(
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER
            )
        );
        
        $activeSheet->getStyle('A' . $headerRow . ':F' . $headerRow)->applyFromArray($headerStyle);

        // Add data rows
        $dataStartRow = $headerRow + 1;
        foreach ($data as $index => $item) {
            $row = $dataStartRow + $index;
            
            $activeSheet->setCellValue('A' . $row, $index + 1);
            $activeSheet->setCellValue('B' . $row, $item['tag_no']);
            $activeSheet->setCellValue('C' . $row, $item['description']);
            $activeSheet->setCellValue('D' . $row, $item['min']);
            $activeSheet->setCellValue('E' . $row, $item['max']);
            $activeSheet->setCellValue('F' . $row, $item['average']);
        }

        // Style the data rows
        if (!empty($data)) {
            $dataRange = 'A' . $dataStartRow . ':F' . ($dataStartRow + count($data) - 1);
            $dataStyle = array(
                'borders' => array(
                    'allBorders' => array(
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => array('rgb' => 'CCCCCC')
                    )
                )
            );
            $activeSheet->getStyle($dataRange)->applyFromArray($dataStyle);
        }

        // Auto-size columns
        foreach (range('A', 'F') as $column) {
            $activeSheet->getColumnDimension($column)->setAutoSize(true);
        }

        // Set filename
        $fileName = 'Performance_Analysis_' . date('Y-m-d_H-i-s') . '.xlsx';
        
        // Set headers for download
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="' . $fileName . '"');
        header('Cache-Control: max-age=0');

        // Write file
        $objWriter = new Xlsx($objPHPExcel);
        $objWriter->save('php://output');
        
        // Clean up
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
    }
}