<?php

namespace App\Models;

/**
 * @property integer $question_id
 * @property integer $scheme_id
 */
class QuestionScheme extends Model{
    protected $table = 'questions_schemes';
    protected $fillable = ['scheme_id', 'question_id'];

    public function question(){
        return $this->belongsTo(Question::class);
    }

    public function scheme(){
        return $this->belongsTo(Scheme::class);
    }
}
