<?php

use Database\Helpers\MigHelper as MH;
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
        Schema::create('schemes_enablers', function (Blueprint $table) {
            MH::rel($table, 'scheme_id', 'enabler_id', false, null, 'questionnaires');
            $table->unsignedFloat('relevance_coefficient', 4, 3);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schemes_enablers');
    }
};
