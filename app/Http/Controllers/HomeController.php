<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class HomeController extends Controller{
    function render(){
        return Inertia::render('Home');
    }
}
