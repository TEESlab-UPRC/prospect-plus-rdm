<?php

namespace App\Models;

/**
 * @property integer $question_id
 * @property integer $questionnaire_id
 * @property integer $analysis_id
 * @property integer $answer_id
 * @property integer $scheme_id
 */
class AnalysisAnswer extends Model{
    protected $table = 'analyses_answers';
    protected $fillable = ['question_id', 'questionnaire_id', 'analysis_id', 'answer_id', 'scheme_id'];

    public function question(){
        return $this->belongsTo(Question::class);
    }

    public function answer(){
        return $this->belongsTo(Answer::class);
    }

    public function questionnaire(){
        return $this->belongsTo(Questionnaire::class);
    }

    public function analysis(){
        return $this->belongsTo(Analysis::class);
    }

    public function scheme(){
        return $this->belongsTo(Scheme::class);
    }
}
