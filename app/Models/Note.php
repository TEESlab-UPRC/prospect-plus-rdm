<?php

namespace App\Models;

class Note extends TextModel{
    protected $fillable = ['note'];

    public function text(){
        $this->note;
    }

    public function questions(){
        return $this->hasMany(Question::class);
    }
}
