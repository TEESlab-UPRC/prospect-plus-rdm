<?php

namespace App\Models;

/**
 * @property integer $enabler_id
 * @property integer $analysis_id
 */
class AnalysisEnabler extends QuestionnaireRelModel{
    protected $table = 'analyses_enablers';
    protected $fillable = ['analysis_id', 'enabler_id'];

    public function analysis(){
        return $this->belongsTo(Analysis::class);
    }

    public function enabler(){
        return $this->belongsTo(Questionnaire::class, 'enabler_id');
    }

    public function questionnaire(){
        return $this->enabler();
    }
}
