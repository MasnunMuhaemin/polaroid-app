<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

use Inertia\Inertia;

Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');

Route::get('/', function () {

    return Inertia::render('Dashboard');

});