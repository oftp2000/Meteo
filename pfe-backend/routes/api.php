<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Auth\ForgotPasswordController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Routes protégées pour admin
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AdminController::class, 'getProfile']);
    Route::put('/profile', [AdminController::class, 'updateProfile']);
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::post('/users', [AdminController::class, 'createUser']);
    Route::put('/users/{id}', [AdminController::class, 'updateUserStatus']);
    Route::get('/permissions', [PermissionController::class, 'index']);

    Route::get('/profile', [UserController::class, 'getProfile']);
});




Route::middleware('cors')->group(function () {
    Route::post('/api/login', [LoginController::class, 'login']);
});


Route::put('/users/{id}', [UserController::class, 'update']);



Route::post('/users', [UserController::class, 'store']);


Route::delete('/users/{id}', [UserController::class, 'destroy']);


// Route pour envoyer la demande de réinitialisation
Route::post('/forgot-password', [\App\Http\Controllers\Auth\ForgotPasswordController::class, 'sendResetRequest']);

// Route pour que l'admin puisse traiter la demande et changer le mot de passe
Route::post('/password-requests/{id}', [\App\Http\Controllers\Auth\ForgotPasswordController::class, 'setNewPassword']);

// (Optionnel) Route pour récupérer la liste des demandes pour l'interface admin
Route::get('/password-requests', [\App\Http\Controllers\Auth\ForgotPasswordController::class, 'getRequests']);


Route::delete('/password-requests/{id}', [ForgotPasswordController::class, 'deleteRequest']);

