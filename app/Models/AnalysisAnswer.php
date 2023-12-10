<?php

namespace App\Models;

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
