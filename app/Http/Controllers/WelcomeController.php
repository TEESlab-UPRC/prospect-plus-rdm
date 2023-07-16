<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class WelcomeController extends Controller{
    static function render(Request $request, $isRegister = false){
        if($request->user()) return to_route('home.render');
        $pwReset = session('pwReset') ?? false;
        session(['pwReset' => false]);
        return Inertia::render('Welcome', ['isRegister' => $isRegister, 'pwReset' => $pwReset]);
    }

    function welcome(Request $request) {return static::render($request);}
    function login() {return to_route('welcome');}
    function register(Request $request) {return static::render($request, true);}
}
