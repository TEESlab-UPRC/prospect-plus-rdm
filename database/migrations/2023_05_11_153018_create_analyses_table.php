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
        Schema::create('analyses', function (Blueprint $table) {
            $table->id();
            $table->text('org');
            $table->text('region')->nullable();
            $table->text('country')->nullable();
            $table->text('title')->nullable();
            $table->timestamp('implementation_start')->nullable();
            $table->timestamp('completion_start')->nullable();
            MH::ref($table, 'user_id', true);
            MH::ref($table, 'rdm_id', false, true, 'questionnaires');
            MH::ref($table, 'frc_id', false, true, 'questionnaires');
            MH::ref($table, 'plan_id', false, true);
            MH::ref($table, 'type_id', false, true);
            MH::ref($table, 'phase_id', false, true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analyses');
    }
};
