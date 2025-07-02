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
        Schema::create('tb_input_tag', function (Blueprint $table) {
            $table->id();
            $table->string('tag_no', 50);
            $table->string('address_no', 50)->nullable();
            $table->string('description', 255)->nullable();
            $table->string('satuan', 20)->nullable();
            $table->integer('group_id')->nullable();
            $table->integer('unit_id');
            $table->integer('urutan')->nullable();
            $table->string('cell', 20)->nullable();
            $table->integer('m_input')->default(0);
            $table->integer('jm_input')->default(6);
            
            // Add indexes for better performance
            $table->index(['unit_id', 'm_input']);
            $table->index('tag_no');
            
            // Foreign key constraint (optional)
            // $table->foreign('unit_id')->references('unit_id')->on('tb_unit');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_input_tag');
    }
};
