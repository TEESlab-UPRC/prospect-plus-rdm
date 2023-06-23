<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Phase;
use App\Models\Plan;
use App\Models\Type;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class AnalysisInfoController extends Controller{
    function render(Request $request){
        if(!$request->user()) return static::gotoSector();  // skip screen for guests
        return Inertia::render('AnalysisInfo', [
            'plans' => static::getArray(Plan::all('answer')),
            'types' => static::getArray(Type::all('answer')),
            'phases' => static::getArray(Phase::all('answer')),
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
                'info.plan' => 'nullable|in:' . join(',', static::getArray(Plan::all('answer'))),
                'info.title' => 'nullable|string',
                'info.type' => 'nullable|in:' . join(',', static::getArray(Type::all('answer'))),
                'info.sector' => 'nullable|in:Public Buildings,Private Buildings,Transport,Public Lighting,Cross Sectoral',
                'info.phase' => 'nullable|in:' . join(',', static::getArray(Phase::all('answer'))),
                'info.impl' => 'nullable|date_format:Y-m-d',
                'info.comp' => 'nullable|date_format:Y-m-d',
            ]);
            $info = $request->input('info');
        }
        session(['info' => $info]);
        return to_route('sector.render');
    }

    static function getArray(Collection $collection){
        return array_column($collection->toArray(), 'answer');
    }
}
