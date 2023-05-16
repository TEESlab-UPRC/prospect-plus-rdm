<?php

use Database\Helpers\MigHelper;
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
        Schema::create('analyses_answers', function (Blueprint $table) {
            $table->id();
            MigHelper::ref($table, 'question_id');
            MigHelper::ref($table, 'questionnaire_id');
            MigHelper::ref($table, 'analysis_id');
            MigHelper::ref($table, 'answer_id');
            $table->unique(['question_id', 'questionnaire_id', 'analysis_id', 'answer_id'], 'full_id_compound_unique');
            $table->index(['questionnaire_id', 'analysis_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analyses_answers');
    }
};
