<?php

namespace App\Models;

/**
 * @property integer $questionnaire_id
 * @property integer $question_id
 */
class QuestionnaireQuestion extends QuestionnaireRelModel{
    protected $table = 'questionnaires_questions';
    protected $fillable = ['questionnaire_id', 'question_id'];

    public function question(){
        return $this->belongsTo(Question::class);
    }

    public function questionnaire(){
        return $this->belongsTo(Questionnaire::class);
    }
}
