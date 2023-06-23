<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class SectorController extends Controller{
    function render(){
        return Inertia::render('SectorSelection');
    }
}
