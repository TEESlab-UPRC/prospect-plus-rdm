<?php

namespace App\Http\Controllers;

use App\Models\Analysis;
use App\Models\AnalysisAnswer;
use App\Models\Phase;
use App\Models\Plan;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Questionnaire;
use App\Models\Type;

class QuestionnaireController extends Controller{
    function load(Request $request){
        $request->validate([
            'type' => 'required|string|in:rdm,frc',
            'title' => 'nullable|string'
        ]);
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
                        'questions' => $s->questionsSchemes->map(fn($m2) => $m2->question->id)
                    ];
                }) : null
            ]
        ]);
    }

    function store(Request $request){
        // validation
        if(!$request || !$request->user()) return;
        $q = session('questionnaire');
        if(!$q) return redirect('/');
        $i = session('info');
        $analysis = session('analysis');
        if(!$analysis && !$i) return;   // no current analysis or info to create one - can't proceed
        $qIDs = $q->questionnaireQuestions->map(fn($m) => $m->question->id)->toArray(); // valid question IDs
        $ansMap = $q->questionnaireAnswers->map(function($m){
            $a = $m->answer;
            return [$a->id, $a->answer];
        })->toArray();
        $ansMap = array_combine(array_column($ansMap, 1), array_column($ansMap, 0));    // map: answer => id
        $request->validate([
            'answers' => 'required|array:' . join(',', $qIDs),                          // keys must be valid question IDs
            'answers.*' => 'required|string|in:' . join(',', array_keys($ansMap))       // values must be valid answers
        ]);

        $ans = array_map(fn($a) => $ansMap[$a], $request->input('answers'));            // answer array in format question_id => answer_id

        // Make/update analysis
        if($analysis){  // existing analysis found, update questionnaire IDs
            $aQKey = ($q->isRDM ? 'rdm' : 'frc') . '_id';
            if($analysis[$aQKey] != $q->id){
                $analysis[$aQKey] = $q->id;
                $analysis->save();
            }
        }else{ // Need to make new analysis, process info for it and create it
            $i = static::mapInfo($i, [
                'plan' => ['plan_id', fn($v) => Plan::where('answer', $v)->value('id')],
                'type' => ['type_id', fn($v) => Type::where('answer', $v)->value('id')],
                'phase' => ['phase_id', fn($v) => Phase::where('answer', $v)->value('id')],
                'sector' => ['sector_id', fn($v) => Questionnaire::where('title', $v)->value('id')]
            ]);
            $i['user_id'] = $request->user()->id;
            $i[($q->isRDM ? 'rdm' : 'frc') . '_id'] = $q->id;
            $analysis = Analysis::create($i);
            session(['analysis' => $analysis]);
        }

        // Add/update answers
        AnalysisAnswer::upsert(
            array_map(fn($qID, $aID) => [
                'question_id' => $qID,
                'answer_id' => $aID,
                'analysis_id' => $analysis->id,
                'questionnaire_id' => $q->id
            ], array_keys($ans), array_values($ans)),
            ['analysis_id', 'questionnaire_id', 'question_id'],
            ['answer_id']
        );

        return to_route('questionnaire.render');
    }

    static function mapInfo(array $info, array $mappers){
        $n = array_map(fn($k, $m) => [$m[0], $info[$k] ? $m[1]($info[$k]) : null], array_keys($mappers), array_values($mappers));
        $n = array_combine(array_column($n, 0), array_column($n, 1));
        return array_merge(array_diff_key($info, $mappers), $n);    // remove old keys, add new key-val pairs
    }
}
