<?php

namespace App\Models;

class QuestionScheme extends Model{
    protected $table = 'questions_schemes';
    protected $fillable = ['scheme_id', 'questionnaire_question_id', 'enabled'];
    protected $casts = ['enabled' => 'boolean'];

    public function questionnaireQuestion(){
        return $this->belongsTo(QuestionnaireQuestion::class);
    }

    public function scheme(){
        return $this->belongsTo(Scheme::class);
    }
}
