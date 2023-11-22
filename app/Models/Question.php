<?php

namespace App\Models;

use Parsedown;

class Question extends TextModel{
    protected $fillable = ['question', 'invert_ans_val', 'note_id'];
    protected $casts = ['invert_ans_val' => 'boolean'];
    protected $parsedown;

    public function __construct(){
        parent::__construct();
        $this->parsedown = new Parsedown();
    }

    public function text(){
        return $this->question;
    }

    public function analysesAnswers(){
        return $this->hasMany(AnalysisAnswer::class);
    }

    public function questionnairesQuestions(){
        return $this->hasMany(QuestionnaireQuestion::class);
    }

    public function questionsSchemes(){
        return $this->hasMany(QuestionScheme::class);
    }

    public function note(){
        return $this->belongsTo(Note::class);
    }

    public function formattedQuestion(){
        return $this->parsedown->line($this->question);
    }

    public function formattedText(){
        return $this->formattedQuestion();
    }
}
