<?php

namespace App\Http\Controllers;

use App\Models\Analysis;
use App\Models\AnalysisAnswer;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Questionnaire;
use App\Models\Question;
use App\Models\Scheme;

class QuestionnaireController extends Controller{
    function load(Request $request){
        $request->validate(['type' => 'required|string|in:rdm,frc']);
        $ans = null;
        $analysisTitle = null;
        $analysis = static::getAnalysis($request);  // for editing mode of questionnaire answers
        if($analysis){  // edit mode
            $q = $request->input('type') == 'rdm' ? $analysis->rdm : $analysis->frc;
            if(!$q) return;  // nothing to edit
            $questionnaireSchemes = $q->questionnairesSchemes->map(fn($qs) => $qs->scheme->id);
            $noneSchemeID = Scheme::noneID();
            $invalidAns = [];
            $ans = AnalysisAnswer::where('analysis_id', $analysis->id)
                    ->where('questionnaire_id', $q->id)->get()
                    ->map(function($m) use (&$invalidAns, $noneSchemeID){
                        $schemeID = $m->scheme->id;
                        $question = $m->question;
                        $splitSchemeAns = $question->split_scheme_answers;
                        if(!$splitSchemeAns && $schemeID != $noneSchemeID){     // should never happen, but fix DB integrity if it somehow does
                            $invalidAns[count($invalidAns)] = $m;
                            return null;
                        }
                        return [
                            $question->id,
                            $splitSchemeAns ? [
                                $schemeID != $noneSchemeID ? $schemeID : null,  // if $splitSchemeAns && $schemeID != $noneSchemeID, it's an old entry that needs to be translated to the new format (use null to mark it for later)
                                $m->answer->id
                            ] : $m->answer->id
                        ];
                    })->filter(fn($f) => $f != null)                            // skip invalid entries
                    ->flatMap(fn($m) => (is_array($m[1]) && $m[1][0] == null) ? // is old entry format?
                        Question::find($m[0])->questionsSchemes->map(fn($qs) => $qs->scheme->id)
                                ->filter(fn($sID) => $questionnaireSchemes->contains($sID))
                                ->map(fn($sID) => [$m[0], [$sID, $m[1][1]]])    // translate to the new format
                                ->toArray() :
                        [$m]
                    )->toArray();
            array_walk($invalidAns, fn($a) => $a->delete());    // delete invalid entries
            $ans = array_replace_recursive(...array_map(fn($m) => [$m[0] => is_array($m[1]) ? [$m[1][0] => $m[1][1]] : $m[1]], $ans));
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
                        'invert_ans_val' => $q->invert_ans_val,
                        'split_scheme_answers' => $q->split_scheme_answers
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
        $qQuestions = $q->questionnaireQuestions->map(fn($m) => $m->question);          // questionnaire's questions
        $qIDs = $qQuestions->map(fn($m) => $m->id)->toArray();                          // valid question IDs
        $aIDs = $q->questionnaireAnswers->map(fn($m) => $m->answer->id)->toArray();     // valid answer IDs
        $sIDs = $q->questionnairesSchemes->map(fn($m) => $m->scheme->id)->toArray();    // valid scheme IDs
        $request->validate([
            'answers' => 'required|array:' . join(',', $qIDs),                          // keys must be valid question IDs
            'answers.*' => [
                'required',
                function($attribute, $value, $fail) use ($aIDs, $sIDs){
                    $expects_split_scheme_answers = Question::find(substr($attribute, 8))->split_scheme_answers;    // question has split_scheme_answers == true
                    if(is_array($value)){                                                                           // received split scheme answers
                        if(!$expects_split_scheme_answers) return $fail($attribute . ' is invalid: question does not expect split scheme answers.');
                        foreach ($value as $sID => $aID) {                                                          // check scheme & answer IDs
                            if(!in_array($sID, $sIDs)) return $fail($attribute . ' is invalid: ' . $sID . ' is not a valid scheme ID.');
                            if(!in_array($aID, $aIDs)) return $fail($attribute . ' is invalid: ' . $aID . ' is not a valid answer ID.');
                        }
                    }else{
                        if($expects_split_scheme_answers) return $fail($attribute . ' is invalid: question expects split scheme answers.');
                        if(!in_array($value, $aIDs)) return $fail($attribute . ' is invalid: ' . $value . ' is not a valid answer ID.');
                    }
                }
            ]
        ]);

        // Make/update analysis
        $isAnalysisEdit = false;
        if($analysis){  // existing analysis found, update questionnaire IDs
            $isAnalysisEdit = true;
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
        $ans = $request->input('answers');  // answer array in format question_id => answer_id/array(scheme_id => answer_id)
        $noneSchemeID = Scheme::noneID();
        AnalysisAnswer::upsert(
            array_merge(...array_map(fn($qID, $aID) => array_map(   // flatMap each question => answer pair
                fn($arr) => array_merge([                           // add common data for each question
                    'questionnaire_id' => $q->id,
                    'analysis_id' => $analysis->id,
                    'question_id' => $qID
                ], $arr), is_array($aID) ?
                    array_map(fn($sID, $sAID) => [                  // add answer entry for each scheme
                        'answer_id' => $sAID,
                        'scheme_id' => $sID
                    ], array_keys($aID), array_values($aID)) : [[   // add single entry for questions without scheme split answers
                        'answer_id' => $aID,
                        'scheme_id' => $noneSchemeID
                    ]]
            ), array_keys($ans), array_values($ans))),
            ['analysis_id', 'questionnaire_id', 'question_id', 'scheme_id'],
            ['answer_id']
        );

        if($isAnalysisEdit) // delete any old format entries, to only keep new format ones - important to prevent dupes from load(), in edit mode, next time!
            AnalysisAnswer::where([
                ['questionnaire_id', $q->id],
                ['analysis_id', $analysis->id],
                ['scheme_id', $noneSchemeID]
            ])->whereIn('question_id', array_column($qQuestions->where('split_scheme_answers', true)->toArray(), 'id')) // where related questions' split_scheme_answers == true
            ->delete();

        return to_route('questionnaire.render');
    }
}
