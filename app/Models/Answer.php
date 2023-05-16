<?php

namespace App\Models;

class Answer extends AnswerModel{
    protected $fillable = ['answer', 'value'];

    public function value(){
        $this->val;
    }

    public function analysesAnswers(){
        return $this->hasMany(AnalysisAnswer::class);
    }

    public function questionnairesAnswers(){
        return $this->hasMany(QuestionnaireAnswer::class);
    }

    public function text(){
        return $this->answer;
    }
}
