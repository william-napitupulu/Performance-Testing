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
            $table->string('id', 50)->primary()->comment('User ID - also used as username');
            $table->string('nama', 255)->comment('User full name');
            $table->string('kode', 255)->nullable()->comment('User code or additional identifier');
            $table->string('password', 255)->comment('User password (hashed)');
            $table->integer('plant_id')->comment('Plant ID that user belongs to');
            $table->tinyInteger('status')->default(1)->comment('User status (1=active, 0=inactive)');
            $table->string('remember_token', 100)->nullable()->comment('Remember me token');
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