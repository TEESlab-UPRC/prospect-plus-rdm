<?php

namespace App\Models;

/**
 * @property boolean $value
 * @property float $must_pass_multiplier
 */
class Answer extends AnswerModel{
    protected $fillable = ['answer', 'value', 'must_pass_multiplier'];

    public function analysesAnswers(){
        return $this->hasMany(AnalysisAnswer::class);
    }

    public function questionnairesAnswers(){
        return $this->hasMany(QuestionnaireAnswer::class);
    }

    public function questionsAnswers(){
        return $this->hasMany(QuestionAnswer::class);
    }
}
