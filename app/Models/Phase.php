<?php

namespace App\Models;

class Phase extends AnswerModel{
    public function analyses(){
        return $this->hasMany(Analysis::class);
    }

    public function text(){
        return $this->answer;
    }
}
