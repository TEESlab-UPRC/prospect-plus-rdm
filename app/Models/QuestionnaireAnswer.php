<?php

namespace App\Models;

/**
 * @property integer $questionnaire_id
 * @property integer $answer_id
 */
class QuestionnaireAnswer extends QuestionnaireRelModel{
    protected $fillable = ['questionnaire_id', 'answer_id'];
    protected $table = 'questionnaires_answers';

    public function answer(){
        return $this->belongsTo(Answer::class);
    }

    public function questionnaire(){
        return $this->belongsTo(Questionnaire::class);
    }
}
