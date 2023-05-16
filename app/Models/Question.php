<?php

namespace App\Models;

class Question extends TextModel{
    protected $fillable = ['question', 'note_id'];

    public function text(){
        $this->question;
    }

    public function analysesAnswers(){
        return $this->hasMany(AnalysisAnswer::class);
    }

    public function questionnairesQuestions(){
        return $this->hasMany(QuestionnaireQuestion::class);
    }

    public function note(){
        return $this->belongsTo(Note::class);
    }
}
