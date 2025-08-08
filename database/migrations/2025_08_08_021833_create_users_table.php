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
        Schema::create('tb_user', function (Blueprint $table) {
            $table->string('id', 10);
            $table->string('nama', 80)->nullable();
            $table->string('kode', 50);
            $table->string('password');
            $table->tinyInteger('plant_id')->unsigned()->nullable();
            $table->string('unit_id', 50)->nullable();
            $table->smallInteger('status')->nullable();
            $table->string('remember_token', 100)->nullable();
            $table->timestamps();

            $table->foreign('plant_id')->references('plant_id')->on('tb_plant')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_user');
    }
};
