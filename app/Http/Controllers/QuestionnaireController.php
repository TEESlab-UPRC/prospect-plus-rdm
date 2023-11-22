<?php

namespace App\Http\Controllers;

use App\Models\Analysis;
use App\Models\AnalysisAnswer;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Questionnaire;
use Illuminate\Validation\Rule;

class QuestionnaireController extends Controller{
    function load(Request $request){
        $request->validate(['type' => 'required|string|in:rdm,frc']);
        $ans = null;
        $analysisTitle = null;
        $analysis = static::getAnalysis($request);  // for editing mode of questionnaire answers
        if($analysis){  // edit mode
            $q = $request->input('type') == 'rdm' ? $analysis->rdm : $analysis->frc;
            if(!$q) return;  // nothing to edit
            $ans = AnalysisAnswer::where('analysis_id', $analysis->id)
                    ->where('questionnaire_id', $q->id)->get()
                    ->map(fn($m) => [$m->question->id, $m->answer->id])->toArray();
            $ans = array_combine(array_column($ans, 0), array_column($ans, 1));
            $analysisTitle = $analysis->title ?? $analysis->org;
            session(['analysis' => $analysis]);
        }else{
            $request->validate(['title' => 'nullable|string']);
            $q = Questionnaire::where('isRDM', $request->input('type') == 'rdm');
            if($request->has('title')) $q->where('title', $request->input('title'));
            $q = $q->orderByDesc('id')->first();
            $i = session('info');
            if($request->user() && $i) $analysisTitle = $i['title'] ?? $i['org'];
        }
        session([
            'currentAnswers' => $ans,
            'questionnaire' => $q,
            'analysisTitle' => $analysisTitle
        ]);
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
                        'note' => $n ? $n->formattedNote() : null,
                        'invert_ans_val' => $q->invert_ans_val
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
            ],
            'currentAnswers' => session('currentAnswers'),
            'analysisTitle' => session('analysisTitle')
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
        $aIDs = $q->questionnaireAnswers->map(fn($m) => $m->answer->id)->toArray();     // valid answer IDs
        $request->validate([
            'answers' => 'required|array:' . join(',', $qIDs),                          // keys must be valid question IDs
            'answers.*' => ['required', Rule::in($aIDs)]                                // values must be valid answer IDs
        ]);

        $ans = $request->input('answers');                                              // answer array in format question_id => answer_id

        // Make/update analysis
        if($analysis){  // existing analysis found, update questionnaire IDs
            $aQKey = ($q->isRDM ? 'rdm' : 'frc') . '_id';
            if($analysis[$aQKey] != $q->id){
                $analysis[$aQKey] = $q->id;
                $analysis->save();
            }
        }else{ // Need to make new analysis, process info for it and create it
            $i = static::mapInfo($i);
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
}
