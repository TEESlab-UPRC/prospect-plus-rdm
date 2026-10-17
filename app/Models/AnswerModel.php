<?php

namespace App\Models;

/**
 * @property string $answer
 */
abstract class AnswerModel extends TextModel{
    protected $fillable = ['answer'];

    public function text(){
        return $this->answer;
    }
}
