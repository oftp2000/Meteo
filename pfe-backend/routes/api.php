<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\UserController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Routes protégées pour admin
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AdminController::class, 'getProfile']);
    Route::put('/profile', [AdminController::class, 'updateProfile']);
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::post('/users', [AdminController::class, 'createUser']);
    Route::put('/users/{id}', [AdminController::class, 'updateUserStatus']);
});
Route::middleware('cors')->group(function () {
    Route::post('/api/login', [LoginController::class, 'login']);
});


Route::put('/users/{id}', [UserController::class, 'update']);



Route::post('/users', [UserController::class, 'store']);


Route::delete('/users/{id}', [UserController::class, 'destroy']);