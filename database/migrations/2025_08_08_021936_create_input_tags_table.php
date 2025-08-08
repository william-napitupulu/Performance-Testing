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
            $table->string('tag_no', 255);
            $table->string('address_no', 225)->nullable();
            $table->string('description', 80)->nullable();
            $table->tinyInteger('jm_input')->unsigned()->nullable();
            $table->smallInteger('unit_id')->unsigned();
            $table->tinyInteger('group_id')->unsigned()->nullable();
            $table->tinyInteger('urutan')->unsigned()->nullable();
            $table->unsignedInteger('m_input')->unsigned()->nullable();
            $table->string('keterangan', 255)->nullable();
            $table->tinyInteger('status')->nullable()->default(1);

            $table->foreign('unit_id')->references('unit_id')->on('tb_unit')->onDelete('cascade');
            $table->foreign('m_input')->references('ID')->on('tb_manual_input')->onDelete('cascade');
            $table->index('tag_no');
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
