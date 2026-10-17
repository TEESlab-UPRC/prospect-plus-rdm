<?php

namespace App\Models;

/**
 * @property string $title
 */
abstract class TitleModel extends TextModel{
    protected $fillable = ['title'];

    public function text(){
        return $this->title;
    }
}
