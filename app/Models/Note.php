<?php

namespace App\Models;

use Parsedown;

/**
 * @property string $note
 */
class Note extends TextModel{
    protected $fillable = ['note'];
    /** @var Parsedown */
    protected $parsedown;

    public function __construct(){
        parent::__construct();
        $this->parsedown = new Parsedown();
    }

    public function text(){
        return $this->note;
    }

    public function questions(){
        return $this->hasMany(Question::class);
    }

    public function formattedNote(){
        return $this->parsedown->line($this->note);
    }

    public function formattedText(){
        return $this->formattedNote();
    }
}
