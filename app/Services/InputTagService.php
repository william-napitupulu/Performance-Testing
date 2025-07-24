<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\InputTag;
use App\Models\TbInput;

class InputTagService
{
    /**
     * Get tab names from tb_manual_input table
     */
    public function getTabNames(int $unitId, int $tabCount = 3): array
    {
        try {
            $tabNames = [];
            
            // Get manual input entries for this unit, ordered by tab_num
            $manualInputs = DB::table('tb_manual_input')
                ->where('unit_id', $unitId)
                ->where('tab_num', '<=', $tabCount)
                ->orderBy('tab_num', 'asc')
                ->get();
            
            // Create tab names array
            foreach ($manualInputs as $input) {
                $tabNames[$input->tab_num] = $input->Nama;
            }
            
            // Fill in missing tabs with default names
            for ($i = 1; $i <= $tabCount; $i++) {
                if (!isset($tabNames[$i])) {
                    $tabNames[$i] = "Tab {$i}";
                }
            }
            
            return $tabNames;
            
        } catch (\Exception $e) {
            Log::error('Error in getTabNames:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Return default names if error occurs
            $tabNames = [];
            for ($i = 1; $i <= $tabCount; $i++) {
                $tabNames[$i] = "Tab {$i}";
            }
            return $tabNames;
        }
    }

    /**
     * Get input tags for all tabs (dynamic based on unit's tab_manual_aktif)
     */
    public function getInputTagsForTabs(int $unitId, int $perfId, int $tabCount = 3): array
    {
        try {
            Log::info('Getting input tags for tabs', [
                'unit_id' => $unitId,
                'perf_id' => $perfId,
                'tab_count' => $tabCount
            ]);
            
            $result = [];
            $allTagNos = collect();
            
            // Get input tags for each tab based on tab count
            for ($i = 1; $i <= $tabCount; $i++) {
                $inputTags = InputTag::where('unit_id', $unitId)
                    ->where('m_input', $i)
                    ->orderBy('urutan', 'asc')
                    ->orderBy('tag_no', 'asc')
                    ->get();
                
                Log::info("Input tags for tab {$i}", [
                    'count' => $inputTags->count(),
                    'first_tag' => $inputTags->first()?->tag_no
                ]);
                
                $allTagNos = $allTagNos->merge($inputTags->pluck('tag_no'));
                
                // Transform tags for this tab
                $transformedTags = $inputTags->map(function($tag) {
                    return [
                        'tag_no' => $tag->tag_no,
                        'description' => $tag->description,
                        'unit_name' => $tag->satuan,
                        'jm_input' => $tag->jm_input,
                        'group_id' => $tag->group_id,
                        'urutan' => $tag->urutan,
                        'm_input' => $tag->m_input
                    ];
                });
                
                $result["tab{$i}"] = [
                    'input_tags' => $transformedTags,
                    'existing_inputs' => [] // Will be populated below
                ];
            }
            
            // Get existing manual input data for all tabs
            $allTagNos = $allTagNos->unique()->values();
            $existingInputs = [];
            
            if ($allTagNos->count() > 0) {
                $existingRecords = TbInput::where('perf_id', $perfId)
                    ->whereIn('tag_no', $allTagNos)
                    ->get();
                
                // Organize existing data by tag_no and date_rec for easy lookup
                foreach ($existingRecords as $record) {
                    $key = $record->tag_no . '_' . $record->date_rec;
                    $existingInputs[$key] = [
                        'tag_no' => $record->tag_no,
                        'value' => $record->value,
                        'date_rec' => $record->date_rec,
                    ];
                }
            }
            
            // Add existing inputs to all tabs
            foreach ($result as $tabKey => $tabData) {
                $result[$tabKey]['existing_inputs'] = $existingInputs;
            }

            return $result;
            
        } catch (\Exception $e) {
            Log::error('Error in getInputTagsForTabs:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Return empty structure for the requested number of tabs
            $result = [];
            for ($i = 1; $i <= $tabCount; $i++) {
                $result["tab{$i}"] = [
                    'input_tags' => [],
                    'existing_inputs' => []
                ];
            }
            return $result;
        }
    }

    /**
     * Get input tags for specific parameters
     */
    public function getInputTags(Request $request, int $unitId): array
    {
        // Datetime is optional - only used for frontend time calculations
        $datetime = $request->input('datetime');
        $perfId = $request->input('perf_id'); // Get perf_id to fetch existing manual inputs
        $mInput = $request->input('m_input'); // No default value

        Log::info('Fetching input tags', [
            'unit_id' => $unitId,
            'datetime' => $datetime,
            'perf_id' => $perfId,
            'm_input' => $mInput
        ]);

        // Get input tags for the unit with specified m_input value
        $query = InputTag::where('unit_id', $unitId);
        
        if ($mInput !== null) {
            $query->where('m_input', $mInput);
        }
        
        $inputTags = $query->orderBy('urutan', 'asc')  // Order by urutan for consistent display
            ->orderBy('tag_no', 'asc')   // Then by tag_no as secondary sort
            ->get();

        Log::info('Query completed', [
            'found_records' => $inputTags->count(),
            'first_record' => $inputTags->first(),
            'm_input' => $mInput,
            'sql' => InputTag::where('unit_id', $unitId)
                ->where('m_input', $mInput)
                ->orderBy('urutan', 'asc')
                ->orderBy('tag_no', 'asc')
                ->toSql()
        ]);

        Log::info('Input tags fetched successfully', [
            'total_records' => $inputTags->count(),
            'unit_id' => $unitId
        ]);

        // Get existing manual input data if perf_id is provided
        $existingInputs = [];
        if ($perfId) {
            $tagNos = $inputTags->pluck('tag_no');
            $existingRecords = TbInput::where('perf_id', $perfId)
                ->whereIn('tag_no', $tagNos)
                ->get();
            
            // Organize existing data by tag_no and date_rec for easy lookup
            foreach ($existingRecords as $record) {
                $key = $record->tag_no . '_' . $record->date_rec;
                $existingInputs[$key] = [
                    'tag_no' => $record->tag_no,
                    'value' => $record->value,
                    'date_rec' => $record->date_rec,
                ];
            }
            
            Log::info('Existing manual inputs found', [
                'perf_id' => $perfId,
                'existing_records_count' => $existingRecords->count(),
                'organized_inputs' => count($existingInputs)
            ]);
        }

        // Transform and log each tag for debugging
        $transformedTags = $inputTags->map(function($tag, $index) {
            $transformed = [
                'tag_no' => $tag->tag_no,
                'description' => $tag->description,
                'unit_name' => $tag->satuan,
                'jm_input' => $tag->jm_input
            ];
            
            Log::info("Tag #{$index}", [
                'original' => [
                    'tag_no' => $tag->tag_no,
                    'description' => $tag->description,
                    'satuan' => $tag->satuan,
                    'jm_input' => $tag->jm_input,
                    'address_no' => $tag->address_no,
                    'group_id' => $tag->group_id,
                    'unit_id' => $tag->unit_id,
                    'urutan' => $tag->urutan,
                    'cell' => $tag->cell,
                    'm_input' => $tag->m_input
                ],
                'transformed' => $transformed
            ]);
            
            return $transformed;
        });

        return [
            'input_tags' => $transformedTags,
            'existing_inputs' => $existingInputs,
            'datetime' => $datetime,
            'perf_id' => $perfId
        ];
    }

    /**
     * Save manual input data to tb_input table
     */
    public function saveManualInput(array $inputData): array
    {
        $savedCount = 0;
        $updatedCount = 0;
        
        foreach ($inputData as $item) {
            // Determine if row exists
            $exists = DB::table('tb_input')->where([
                'tag_no'   => $item['tag_no'],
                'date_rec' => $item['date_rec'],
                'perf_id'  => $item['perf_id'],
            ])->exists();

            // Always insert or update value (upsert)
            DB::table('tb_input')->updateOrInsert(
                [
                    'tag_no'   => $item['tag_no'],
                    'date_rec' => $item['date_rec'],
                    'perf_id'  => $item['perf_id'],
                ],
                ['value' => $item['value']]
            );

            if ($exists) {
                $updatedCount++;
                Log::info('Updated existing manual input record', $item);
            } else {
                $savedCount++;
                Log::info('Created new manual input record', $item);
            }
        }

        return [
            'records_created' => $savedCount,
            'records_updated' => $updatedCount,
            'total_processed' => $savedCount + $updatedCount
        ];
    }
}