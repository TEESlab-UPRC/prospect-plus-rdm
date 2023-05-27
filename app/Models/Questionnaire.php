<?php

namespace App\Models;

class Questionnaire extends TitleModel{
    protected $fillable = ['title', 'isRDM'];
    protected $casts = ['isRDM' => 'boolean'];

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

    public function text(){
        return $this->title;
    }
}
