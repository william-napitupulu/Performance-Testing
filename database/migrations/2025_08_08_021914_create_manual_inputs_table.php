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
            $table->increments('ID');
            $table->string('Nama', 50)->nullable();
            $table->smallInteger('unit_id')->unsigned()->nullable();
            $table->smallInteger('tab_num')->nullable();

            $table->foreign('unit_id')->references('unit_id')->on('tb_unit')->onDelete('cascade');
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
