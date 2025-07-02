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
        Schema::table('tb_user', function (Blueprint $table) {
            // Only add remember_token if it doesn't already exist
            if (!Schema::hasColumn('tb_user', 'remember_token')) {
                $table->string('remember_token', 100)->nullable()->after('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tb_user', function (Blueprint $table) {
            if (Schema::hasColumn('tb_user', 'remember_token')) {
                $table->dropColumn('remember_token');
            }
        });
    }
};
