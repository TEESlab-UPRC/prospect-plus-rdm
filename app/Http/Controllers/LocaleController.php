<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LocaleController extends Controller{
    function setLocale(Request $request){
        $request->validate(['locale' => ['required', Rule::in(array_merge(['en'], ...array_values(config('autotranslate.target_languages'))))]]);
        $request->session()->put('locale', $request->input('locale') ?? config('app.fallback_locale', 'en'));
        return redirect()->back();
    }
}
