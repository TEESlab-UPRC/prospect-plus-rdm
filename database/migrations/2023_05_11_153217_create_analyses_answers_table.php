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
        Schema::create('analyses_answers', function (Blueprint $table) {
            $table->id();
            MH::ref($table, 'question_id');
            MH::ref($table, 'questionnaire_id');
            MH::ref($table, 'analysis_id');
            MH::ref($table, 'answer_id');
            $table->unique(['question_id', 'questionnaire_id', 'analysis_id'], 'analysis_questionnaire_question_id_compound_unique');
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
