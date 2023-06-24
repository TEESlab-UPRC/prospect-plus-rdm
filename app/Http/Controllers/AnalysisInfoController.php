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
    function render(Request $request){
        if(!$request->user()) return static::gotoSector();  // skip screen for guests
        return Inertia::render('AnalysisInfo', [
            'plans' => static::getPlans(),
            'types' => static::getTypes(),
            'phases' => static::getPhases(),
            'sectors' => static::getSectors(),
            'info' => session('info')
        ]);
    }

    function store(Request $request){
        return static::gotoSector($request);
    }

    static function gotoSector(Request $request = null){
        $info = null;
        if($request && $request->has('info')){
            $request->validate([
                'info.authority' => 'required|string',
                'info.region' => 'nullable|string',
                'info.country' => 'nullable|string',
                'info.plan' => 'nullable|in:' . join(',', static::getPlans()),
                'info.title' => 'nullable|string',
                'info.type' => 'nullable|in:' . join(',', static::getTypes()),
                'info.sector' => 'nullable|in:' . join(',', static::getSectors()),
                'info.phase' => 'nullable|in:' . join(',', static::getPhases()),
                'info.impl' => 'nullable|date_format:Y-m-d',
                'info.comp' => 'nullable|date_format:Y-m-d'
            ]);
            $info = $request->input('info');
        }
        session(['info' => $info]);
        return to_route('sector.render');
    }

    static function getArray(Collection $collection, string $colName = 'answer'){
        return array_column($collection->toArray(), $colName);
    }

    static function getPlans() {return static::getArray(Plan::all('answer'));}
    static function getTypes() {return static::getArray(Type::all('answer'));}
    static function getPhases() {return static::getArray(Phase::all('answer'));}
    static function getSectors() {return static::getArray(Questionnaire::where('isRDM', true)->get('title'), 'title');}
}
