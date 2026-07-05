<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\PostController;
use Illuminate\Support\Facades\Route;

Route::post('/register',    [AuthController::class, 'register']);
Route::post('/login',       [AuthController::class, 'login'])->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me',       [AuthController::class, 'me']);
    Route::post('/logout',  [AuthController::class, 'logout']);

    Route::get('/posts',                    [PostController::class, 'index']);
    Route::post('/posts',                   [PostController::class, 'store']);
    Route::post('/posts/{post}/like',       [LikeController::class, 'togglePost']);
    Route::get('/posts/{post}/likes',       [LikeController::class, 'postLikers']);

    Route::post('/comments/{comment}/like', [LikeController::class, 'toggleComment']);
    Route::get('/comments/{comment}/likes', [LikeController::class, 'commentLikers']);
});
