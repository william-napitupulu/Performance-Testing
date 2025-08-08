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
        Schema::create('tb_performance', function (Blueprint $table) {
            $table->mediumIncrements('perf_id');
            $table->string('description', 100)->nullable();
            $table->dateTime('date_perfomance')->nullable();
            $table->timestamp('date_created')->useCurrent();
            $table->tinyInteger('status')->unsigned()->nullable();
            $table->smallInteger('unit_id')->unsigned()->nullable();
            $table->string('type', 50)->nullable();
            $table->string('weight', 50)->nullable();

            $table->foreign('unit_id')->references('unit_id')->on('tb_unit')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_performance');
    }
};
