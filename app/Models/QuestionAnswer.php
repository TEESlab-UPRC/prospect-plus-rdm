<?php

namespace App\Models;

/**
 * @property integer $answer_id
 * @property integer $question_id
 */
class QuestionAnswer extends Model{
    protected $table = 'questions_answers';
    protected $fillable = ['question_id', 'answer_id'];

    public function question(){
        return $this->belongsTo(Question::class);
    }

    public function answer(){
        return $this->belongsTo(Answer::class);
    }
}
