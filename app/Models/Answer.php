<?php

namespace App\Models;

/**
 * @property boolean $value
 */
class Answer extends AnswerModel{
    protected $fillable = ['answer', 'value'];

    public function analysesAnswers(){
        return $this->hasMany(AnalysisAnswer::class);
    }

    public function questionnairesAnswers(){
        return $this->hasMany(QuestionnaireAnswer::class);
    }

    }
}
