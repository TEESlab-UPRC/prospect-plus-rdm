<?php

namespace App\Models;

class Analysis extends Model{
    protected $fillable = [
        'org', 'region', 'country', 'title', 'implementation_start', 'completion_start',
        'user_id', 'rdm_id', 'frc_id', 'plan_id', 'type_id', 'phase_id'
    ];

    protected $casts = [
        'implementation_start' => 'datetime',
        'completion_start' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function phase(){
        return $this->belongsTo(Phase::class);
    }

    public function type(){
        return $this->belongsTo(Type::class);
    }

    public function plan(){
        return $this->belongsTo(Plan::class);
    }

    public function rdm(){
        return $this->belongsTo(Questionnaire::class, 'rdm_id');
    }

    public function frc(){
        return $this->belongsTo(Questionnaire::class, 'frc_id');
    }

    public function analysesAnswers(){
        return $this->hasMany(AnalysisAnswer::class);
    }
}
