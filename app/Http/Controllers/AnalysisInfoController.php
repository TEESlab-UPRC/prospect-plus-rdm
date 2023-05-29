<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Phase;
use App\Models\Plan;
use App\Models\Type;
use Illuminate\Database\Eloquent\Collection;

class AnalysisInfoController extends Controller{
    function render(Request $request){
        $request->validate(['next' => 'in:frc,rdm']);
        return Inertia::render('AnalysisInfo', [
            'plans' => static::getArray(Plan::all('answer')),
            'types' => static::getArray(Type::all('answer')),
            'phases' => static::getArray(Phase::all('answer')),
            'next' => $request->input('next')
        ]);
    }

    static function getArray(Collection $collection){
        return array_column($collection->toArray(), 'answer');
    }
}
