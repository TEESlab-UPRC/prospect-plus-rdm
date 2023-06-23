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
        session(['info' => ($request && $request->has('info')) ? $request->input('info') : null]);
        return to_route('sector.render');
    }

    static function getArray(Collection $collection){
        return array_column($collection->toArray(), 'answer');
    }
}
