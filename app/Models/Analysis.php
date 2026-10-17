<?php

namespace App\Models;

/**
 * @property string $org
 * @property string $region
 * @property string $country
 * @property string $title
 * @property \Illuminate\Support\Carbon $implementation_start
 * @property \Illuminate\Support\Carbon $completion_start
 * @property integer $user_id
 * @property integer $rdm_id
 * @property integer $frc_id
 * @property integer $plan_id
 * @property integer $type_id
 * @property integer $phase_id
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property integer $sector_id
 */
class Analysis extends Model{
    public $timestamps = true;

    protected $fillable = [
        'org', 'region', 'country', 'title', 'implementation_start', 'completion_start',
        'user_id', 'rdm_id', 'frc_id', 'plan_id', 'type_id', 'phase_id', 'sector_id'
    ];

    protected $casts = [
        'implementation_start' => 'date:Y-m-d',
        'completion_start' => 'date:Y-m-d',
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

    public function sector(){
        return $this->belongsTo(Questionnaire::class, 'sector_id');
    }

    public function analysesAnswers(){
        return $this->hasMany(AnalysisAnswer::class);
    }
}
