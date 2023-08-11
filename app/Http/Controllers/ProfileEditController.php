<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ProfileEditController extends Controller{
    function render(Request $request){
        return $request->user() ? Inertia::render('ProfileEdit') : redirect('/');
    }

    function store(Request $request){
        $user = $request->user();
        if(!$user) return;

        $pw = $request->input('password');
        $hasPw = isset($pw[0]);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255' . ($user->email != $request->input('email') ? '|unique:'.User::class : ''),
            'current_password' => $hasPw ? 'required|current_password' : '',
            'password' => ['nullable', 'confirmed', Password::defaults()]
        ], [], [
            'password' => __('new password')
        ]);

        $in = $request->only(['name', 'email']);
        $in = array_filter($in, fn($v, $k) => $user[$k] != $v, ARRAY_FILTER_USE_BOTH);  // exclude unchanged

        if($hasPw) $in['password'] = Hash::make($pw);

        $user->fill($in);
        $user->save();

        return to_route('profile.render');
    }
}
