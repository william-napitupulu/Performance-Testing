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
        Schema::create('tb_manual_input', function (Blueprint $table) {
            $table->id('ID');
            $table->string('Nama', 255);
            $table->unsignedBigInteger('unit_id');
            $table->integer('tab_num');
            $table->timestamps();
            
            // Add foreign key constraint
            $table->foreign('unit_id')->references('id')->on('tb_unit')->onDelete('cascade');
            
            // Add unique constraint to prevent duplicate tab_num for same unit
            $table->unique(['unit_id', 'tab_num']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_manual_input');
    }
};
