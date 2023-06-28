<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Phase;
use App\Models\Plan;
use App\Models\Questionnaire;
use App\Models\Type;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class AnalysisInfoController extends Controller{
    function load(Request $request){
        $analysis = static::getAnalysis($request, false);   // for editing mode of analysis info
        if($analysis) session([ // edit mode
            'analysis' => $analysis,
            'info' => static::analysisInfo($analysis),
            'infoEditMode' => true
        ]);
        else session(['infoEditMode' => false]);
        return to_route('info.render');
    }

    function render(Request $request){
        if(!$request->user()) return static::gotoSector();  // skip screen for guests
        return Inertia::render('AnalysisInfo', [
            'plans' => static::getPlans(),
            'types' => static::getTypes(),
            'phases' => static::getPhases(),
            'sectors' => static::getSectors(),
            'info' => session('info'),   // TODO load latest user analysis from DB instead (account for edit mode)
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
            return to_route('home.render'); // TODO change to analysis list, when implemented
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
            $request->validate([
                'info.org' => 'required|string',
                'info.region' => 'nullable|string',
                'info.country' => 'nullable|string',
                'info.plan' => 'nullable|in:' . join(',', static::getPlans()),
                'info.title' => 'nullable|string',
                'info.type' => 'nullable|in:' . join(',', static::getTypes()),
                'info.sector' => 'nullable|in:' . join(',', static::getSectors()),
                'info.phase' => 'nullable|in:' . join(',', static::getPhases()),
                'info.implementation_start' => 'nullable|date_format:Y-m-d',
                'info.completion_start' => 'nullable|date_format:Y-m-d'
            ]);
            return $request->input('info');
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
