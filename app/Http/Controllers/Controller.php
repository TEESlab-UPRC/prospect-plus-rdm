<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Type;
use App\Models\Phase;
use App\Models\Analysis;
use Illuminate\Http\Request;
use App\Models\Questionnaire;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController{
    use AuthorizesRequests, ValidatesRequests;

    static function getAnalysis(Request $request, bool $required = false){
        if(!$request->user()) return null;
        $request->validate(['analysis' => ($required ? 'required' : 'nullable') . '|numeric|integer|exists:analyses,id']);
        if(!$request->has('analysis')) return null;
        $analysis = Analysis::find($request->input('analysis'));
        return $analysis->user_id == $request->user()->id ? $analysis : null;   // only return owned
    }

    static function mapInfoEntries(array $info, array $mappers){
        $n = array_map(fn($k, $m) => [$m[0], $info[$k] ? $m[1]($info[$k]) : null], array_keys($mappers), array_values($mappers));
        $n = array_combine(array_column($n, 0), array_column($n, 1));
        return array_merge(array_diff_key($info, $mappers), $n);    // remove old keys, add new key-val pairs
    }

    static function mapInfo(array $info){       // values -> foreign IDs (user options only)
        return static::mapInfoEntries($info, [
            'plan' => ['plan_id', fn($v) => Plan::where('answer', $v)->value('id')],
            'type' => ['type_id', fn($v) => Type::where('answer', $v)->value('id')],
            'phase' => ['phase_id', fn($v) => Phase::where('answer', $v)->value('id')],
            'sector' => ['sector_id', fn($v) => Questionnaire::where('title', $v)->value('id')]
        ]);
    }

    static function mapInfoRev(array $info){    // foreign IDs -> values (user options only)
        return static::mapInfoEntries($info, [
            'plan_id' => ['plan', fn($v) => Plan::find($v)->value('answer')],
            'type_id' => ['type', fn($v) => Type::find($v)->value('answer')],
            'phase_id' => ['phase', fn($v) => Phase::find($v)->value('answer')],
            'sector_id' => ['sector', fn($v) => Questionnaire::find($v)->value('title')]
        ]);
    }

    static function analysisInfo(Analysis $analysis, bool $noTitle = false){   // Analysis -> info form data
        $info = $analysis->only(['org', 'region', 'country', 'plan_id', 'title', 'type_id', 'sector_id', 'phase_id', 'implementation_start', 'completion_start']);
        if($noTitle) $info['title'] = null;
        $info = array_map(fn($k, $v) => [$k, in_array($k, ['implementation_start', 'completion_start']) ? ($v ? $v->format('Y-m-d') : $v) : $v], array_keys($info), array_values($info));   // format dates
        $info = array_combine(array_column($info, 0), array_column($info, 1));
        return static::mapInfoRev($info);
    }
}
