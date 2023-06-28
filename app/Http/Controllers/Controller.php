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

    static function getAnalysis(Request $request, bool $required = true){
        $request->validate(['analysis' => ($required ? 'required' : 'nullable') . '|numeric|integer|exists:analyses,id']);
        return $request->has('analysis') ? Analysis::find($request->input('analysis')) : null;
    }

    static function mapInfoEntry(array $info, array $mappers){
        $n = array_map(fn($k, $m) => [$m[0], $info[$k] ? $m[1]($info[$k]) : null], array_keys($mappers), array_values($mappers));
        $n = array_combine(array_column($n, 0), array_column($n, 1));
        return array_merge(array_diff_key($info, $mappers), $n);    // remove old keys, add new key-val pairs
    }

    static function mapInfo(array $info){
        return static::mapInfoEntry($info, [
            'plan' => ['plan_id', fn($v) => Plan::where('answer', $v)->value('id')],
            'type' => ['type_id', fn($v) => Type::where('answer', $v)->value('id')],
            'phase' => ['phase_id', fn($v) => Phase::where('answer', $v)->value('id')],
            'sector' => ['sector_id', fn($v) => Questionnaire::where('title', $v)->value('id')]
        ]);
    }
}
