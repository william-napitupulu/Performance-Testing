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
            $table->string('tag_no', 255);
            $table->float('value')->nullable();
            $table->dateTime('date_rec');
            $table->mediumInteger('perf_id')->unsigned();

            $table->primary(['tag_no', 'date_rec', 'perf_id']);
            $table->foreign('perf_id')->references('perf_id')->on('tb_performance')->onDelete('cascade');
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
