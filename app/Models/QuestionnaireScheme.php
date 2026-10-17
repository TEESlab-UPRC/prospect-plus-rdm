<?php

namespace App\Models;

/**
 * @property integer $scheme_id
 * @property integer $questionnaire_id
 */
class QuestionnaireScheme extends Model{
    protected $table = 'questionnaires_schemes';
    protected $fillable = ['scheme_id', 'questionnaire_id'];

    public function questionnaire(){
        return $this->belongsTo(Questionnaire::class);
    }

    public function scheme(){
        return $this->belongsTo(Scheme::class);
    }
}
