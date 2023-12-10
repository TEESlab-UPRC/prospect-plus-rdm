<?php

use App\Models\AnalysisAnswer;
use App\Models\Scheme;
use Database\Helpers\MigHelper as MH;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('analyses_answers', function (Blueprint $table) {
            Scheme::firstOrCreate(['title' => '']); // make sure special "none" scheme exists first (used instead of NULL, important for compound unique index constraint)
            MH::ref($table, 'scheme_id')->default(Scheme::noneID());
            $table->index('question_id');   // needed before dropping the compound unique index constraint
            $table->dropUnique('analysis_questionnaire_question_id_compound_unique');
            $table->unique(['question_id', 'questionnaire_id', 'analysis_id', 'scheme_id'], 'analysis_questionnaire_question_scheme_id_compound_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('analyses_answers', function (Blueprint $table) {
            $c = ['question_id', 'questionnaire_id', 'analysis_id'];
            AnalysisAnswer::whereIn('id',
                AnalysisAnswer::rightJoinSub(
                    AnalysisAnswer::whereNot('scheme_id', Scheme::noneID())
                            ->select(DB::raw('count(distinct(answer_id)) as distinct_answer_count, min(id) as first_id'), ...$c)
                            ->groupBy($c),
                    'counted',
                    fn($j) => $j->on(array_map(fn($n) => ['analyses_answers.' . $n, '=', 'counted.' . $n], $c))
                )->get()
                        ->filter(fn($f) => $f->distinct_answer_count > 1 || $f->first_id < $f->id)
                        ->pluck('id')
            )->delete();    // delete all post-migration translated records, unless they have the same answer across all schemes, in which case, keep one
            $table->dropUnique('analysis_questionnaire_question_scheme_id_compound_unique');
            $table->unique($c, 'analysis_questionnaire_question_id_compound_unique');
            $table->dropIndex(['question_id']);
            $table->dropForeign(['scheme_id']);
            $table->dropColumn('scheme_id');
        });
    }
};
