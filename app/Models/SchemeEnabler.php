<?php

namespace App\Models;

/**
 * @property integer $scheme_id
 * @property integer $enabler_id
 * @property float $relevance_coefficient
 */
class SchemeEnabler extends QuestionnaireRelModel{
    protected $table = 'schemes_enablers';
    protected $fillable = ['scheme_id', 'enabler_id', 'relevance_coefficient'];

    public function relevanceCoefficient(){
        return $this->relevance_coefficient;
    }

    public function scheme(){
        return $this->belongsTo(Scheme::class);
    }

    public function enabler(){
        return $this->belongsTo(Questionnaire::class, 'enabler_id');
    }

    public function questionnaire(){
        return $this->enabler();
    }
}
