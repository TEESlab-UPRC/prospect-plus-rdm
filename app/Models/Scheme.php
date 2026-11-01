<?php

namespace App\Models;

class Scheme extends TitleModel{
    public function questionsSchemes(){
        return $this->hasMany(QuestionScheme::class);
    }

    public function questionnairesSchemes(){
        return $this->hasMany(QuestionnaireScheme::class);
    }

    public function analysesAnswers(){
        return $this->hasMany(AnalysisAnswer::class);
    }

    public function schemesEnablers(){
        return $this->hasMany(SchemeEnabler::class);
    }

    public function pillarsSchemes(){
        return $this->hasMany(PillarScheme::class);
    }

    public static function none(): Scheme{
        return Scheme::firstWhere('title', '');
    }

    public static function noneID(): int{
        return static::none()->id;
    }
}
