<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class SimplePageController extends Controller{
    function renderPrivacyPolicy() {return Inertia::render('PrivacyPolicy');}
}
