<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PolicyController;
use App\Http\Controllers\AuthController;

// Authentication routes (public)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Policy API Routes (protected)
    Route::apiResource('policies', PolicyController::class);
});

Route::get('/policies/{id}/certificate', [PolicyController::class, 'generateCertificate']);

// Legacy route for testing (will be removed)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
