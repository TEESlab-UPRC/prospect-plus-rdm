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
        Schema::create('questions_schemes', function (Blueprint $table) {
            MH::rel($table, 'scheme_id', 'questionnaire_question_id', false, null, 'questionnaires_questions');
            MH::bool($table, 'enabled');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions_schemes');
    }
};
