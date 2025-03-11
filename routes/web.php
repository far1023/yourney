<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('user-list', function () {
        return Inertia::render('users/index');
    })->name('users.list');
    Route::get('users', [UserController::class, 'userDataTable'])->name('users.datatable');

    Route::get('phpinfo', function () {
        return dd(phpinfo());
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
