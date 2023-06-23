<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Questionnaire;

class QuestionnaireController extends Controller{
    function load(Request $request){
        $request->validate(['type' => 'in:rdm,frc']);
        $q = Questionnaire::where('isRDM', $request->input('type') == 'rdm');
        if($request->has('title')) $q->where('title', $request->input('title'));
        $q = $q->orderByDesc('id')->first();
        session(['questionnaire' => $q]);
        return to_route('questionnaire.render');
    }

    function render(){
        $q = session('questionnaire');
        if(!$q) return redirect('/');
        return Inertia::render('Questionnaire', [
            'questionnaire' => [
                'title' => $q->title,
                'isRDM' => $q->isRDM,
                'answers' => $q->questionnaireAnswers->map(function($m){
                    $a = $m->answer;
                    return [
                        'id' => $a->id,
                        'answer' => $a->answer,
                        'value' => $a->value
                    ];
                }),
                'questions' => $q->questionnaireQuestions->map(function($m){
                    $q = $m->question;
                    $n = $q->note;
                    return [
                        'id' => $q->id,
                        'question' => $q->formattedQuestion(),
                        'note' => $n ? $n->formattedNote() : null
                    ];
                }),
                'schemes' => $q->isRDM ? $q->questionnairesSchemes->map(function($m){
                    $s = $m->scheme;
                    return [
                        'id' => $s->id,
                        'title' => $s->title,
                        'questions' => $s->questionsSchemes->map(fn($m) => $m->question->id)
                    ];
                }) : null
            ]
        ]);
    }
}
