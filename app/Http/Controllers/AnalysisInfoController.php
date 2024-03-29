<?php

namespace App\Http\Controllers;

use App\Models\Analysis;
use Inertia\Inertia;
use App\Models\Phase;
use App\Models\Plan;
use App\Models\Questionnaire;
use App\Models\Type;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnalysisInfoController extends Controller{
    function load(Request $request){
        $analysis = static::getAnalysis($request);   // for editing mode of analysis info
        if($analysis) session([ // edit mode
            'analysis' => $analysis,
            'infoEditMode' => true,
            'info' => static::analysisInfo($analysis)
        ]);
        else{
            if($request->user()) $analysis = Analysis::where('user_id', $request->user()->id)
                    ->latest()->first();   // get user's latest analysis
            session([
                'infoEditMode' => false,
                'info' => $analysis ? static::analysisInfo($analysis, true) : null
            ]);
        }
        return to_route('info.render');
    }

    function render(Request $request){
        if(!$request->user()) return static::gotoSector();  // skip screen for guests
        return Inertia::render('AnalysisInfo', [
            'plans' => static::getPlans(),
            'types' => static::getTypes(),
            'phases' => static::getPhases(),
            'sectors' => static::getSectors(),
            'info' => session('info'),
            'editMode' => session('infoEditMode')
        ]);
    }

    function store(Request $request){
        if(session('infoEditMode')){
            $analysis = session('analysis');
            $info = static::getInfo($request);
            if(!$info || !$analysis) return;
            $info = static::mapInfo($info);
            $analysis->update($info);
            session(['analysis' => null, 'info' => null, 'infoEditMode' => null]);
            return to_route('analyses.render');
        }
        return static::gotoSector($request);
    }

    static function gotoSector(Request $request = null){
        session([
            'info' => $request ? static::getInfo($request) : null,
            'analysis' => null  // new analysis
        ]);
        return to_route('sector.render');
    }

    static function getInfo(Request $request){
        if($request && $request->has('info')){
            $i = $request->input('info');
            Validator::make($i, [
                'org' => 'required|string',
                'region' => 'nullable|string',
                'country' => 'nullable|string',
                'plan' => 'nullable|in:' . join(',', static::getPlans()),
                'title' => 'nullable|string',
                'type' => 'nullable|in:' . join(',', static::getTypes()),
                'sector' => 'nullable|in:' . join(',', static::getSectors()),
                'phase' => 'nullable|in:' . join(',', static::getPhases()),
                'implementation_start' => 'nullable|date_format:Y-m-d',
                'completion_start' => 'nullable|date_format:Y-m-d'
            ], [], array_map(fn($v) => __($v), [
                'org' => 'authority/agency',
                'region' => 'city/region',
                'plan' => 'plan/strategy',
                'title' => 'project title',
                'type' => 'type of measure'
            ]))->validate();
            return $i;
        }
        return null;
    }

    static function getArray(Collection $collection, string $colName = 'answer'){
        return array_column($collection->toArray(), $colName);
    }

    static function getPlans() {return static::getArray(Plan::all('answer'));}
    static function getTypes() {return static::getArray(Type::all('answer'));}
    static function getPhases() {return static::getArray(Phase::all('answer'));}
    static function getSectors() {return static::getArray(Questionnaire::where('isRDM', true)->get('title'), 'title');}
}
