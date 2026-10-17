<?php

namespace App\Models;

class Plan extends AnswerModel{
    public function analyses(){
        return $this->hasMany(Analysis::class);
    }
}
