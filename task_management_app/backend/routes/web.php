<?php

use Illuminate\Support\Facades\Route;

/*
| Web Routes

|  register web routes for application.
|
*/

Route::get('/', function () {
    return view('welcome');
});
