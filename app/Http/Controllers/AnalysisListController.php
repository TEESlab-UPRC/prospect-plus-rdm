<?php

namespace App\Http\Controllers;

use App\Models\Analysis;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AnalysisListController extends Controller{
    function render(Request $request){
        if(!$request->user()) return redirect('/');
        $data = Analysis::where('user_id', $request->user()->id)
                ->oldest()->get()
                ->map(fn($a) => array_merge($a->only(['id', 'org', 'title']), [
                    'sector' => $a->rdm ? $a->rdm->title : null,
                    'hasRDM' => !!$a->rdm,
                    'hasFRC' => !!$a->frc
                ]));
        return Inertia::render('AnalysisList', ['analyses' => $data]);
    }

    function delete(Request $request){
        $analysis = static::getAnalysis($request);
        if(!$analysis) return;
        $analysis->delete();
        return to_route('analyses.render');
    }
}
