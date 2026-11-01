<?php

namespace App\Models;

/**
 * @property boolean $isRDM
 * @property boolean $isEnabler
 * @property boolean $isLegacy
 */
class Questionnaire extends TitleModel{
    protected $fillable = ['title', 'isRDM', 'isEnabler', 'isLegacy'];
    protected $casts = ['isRDM' => 'boolean', 'isEnabler' => 'boolean', 'isLegacy' => 'boolean'];

    public function analyses(){
        return $this->hasMany(Analysis::class);
    }

    public function questionnaireQuestions(){
        return $this->hasMany(QuestionnaireQuestion::class);
    }

    public function questionnaireAnswers(){
        return $this->hasMany(QuestionnaireAnswer::class);
    }

    public function analysesAnswers(){
        return $this->hasMany(AnalysisAnswer::class);
    }

    public function questionnairesSchemes(){
        return $this->hasMany(QuestionnaireScheme::class);
    }

    public function schemesEnablers(){
        return $this->hasMany(SchemeEnabler::class, 'enabler_id');
    }

    public function analysesEnablers(){
        return $this->hasMany(AnalysisEnabler::class, 'enabler_id');
    }
}
