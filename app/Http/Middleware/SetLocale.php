<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale{
    public function handle(Request $request, Closure $next): Response{
        app()->setLocale($request->session()->get('locale') ?? config('app.fallback_locale', 'en'));
        return $next($request);
    }
}
