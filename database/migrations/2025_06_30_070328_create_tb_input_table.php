<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tb_input', function (Blueprint $table) {
            $table->id();
            $table->string('tag_no', 100);
            $table->decimal('value', 15, 4)->nullable();
            $table->timestamp('date_rec')->nullable();
            $table->string('perf_id', 50);
            
            // Add indexes for better performance
            $table->index('perf_id');
            $table->index('tag_no');
            $table->index('date_rec');
            $table->index(['perf_id', 'date_rec']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_input');
    }
};
