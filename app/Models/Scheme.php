<?php

namespace App\Models;

class Scheme extends TitleModel{
    public function questionsSchemes(){
        return $this->hasMany(QuestionScheme::class);
    }

    public function text(){
        return $this->title;
    }
}
