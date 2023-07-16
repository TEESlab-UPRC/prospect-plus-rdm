<?php

// use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
// use Illuminate\Foundation\Application;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SectorController;
// use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\ProfileEditController;
use App\Http\Controllers\AnalysisInfoController;
use App\Http\Controllers\AnalysisListController;
use App\Http\Controllers\QuestionnaireController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

Route::get('/', [WelcomeController::class, 'welcome'])->name('welcome');
Route::get('/login', [WelcomeController::class, 'login'])->name('login');
Route::get('/register', [WelcomeController::class, 'register'])->name('register');

Route::get('/home', [HomeController::class, 'render'])->name('home.render');

Route::post('/info/load', [AnalysisInfoController::class, 'load'])->name('info.load');
Route::get('/info', [AnalysisInfoController::class, 'render'])->name('info.render');
Route::post('/info/store', [AnalysisInfoController::class, 'store'])->name('info.store');

Route::get('/sector', [SectorController::class, 'render'])->name('sector.render');

Route::post('/questionnaire/load', [QuestionnaireController::class, 'load'])->name('questionnaire.load');
Route::get('/questionnaire', [QuestionnaireController::class, 'render'])->name('questionnaire.render');
Route::post('/questionnaire/store', [QuestionnaireController::class, 'store'])->name('questionnaire.store');

Route::get('/analyses', [AnalysisListController::class, 'render'])->name('analyses.render');
Route::post('/analyses/delete', [AnalysisListController::class, 'delete'])->name('analyses.delete');

Route::get('/profile', [ProfileEditController::class, 'render'])->name('profile.render');
Route::post('/profile/store', [ProfileEditController::class, 'store'])->name('profile.store');

require __DIR__.'/auth.php';
