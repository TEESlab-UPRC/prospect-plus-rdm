<?php

namespace App\Models;

/**
 * @property integer $question_id
 * @property integer $scheme_id
 * @property boolean $must_pass
 */
class QuestionScheme extends Model{
    protected $table = 'questions_schemes';
    protected $fillable = ['scheme_id', 'question_id', 'must_pass'];
    protected $casts = ['must_pass' => 'boolean'];

    public function question(){
        return $this->belongsTo(Question::class);
    }

    public function scheme(){
        return $this->belongsTo(Scheme::class);
    }
}
