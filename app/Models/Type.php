<?php

namespace App\Models;

class Type extends AnswerModel{
    public function analyses(){
        return $this->hasMany(Analysis::class);
    }
}
