<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ExerciseController;

Route::controller(AuthController::class)->group(function(){
    Route::post('register','register');
    Route::post('login','login');
    Route::get('userdetail','userDetails')->middleware('auth:sanctum');
    Route::post('logout','logout')->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function(){
    Route::apiResource('lessons', LessonController::class);
    Route::get('lessons/search/by', [LessonController::class, 'search']);
    
    Route::apiResource('exercises', ExerciseController::class);
    Route::get('exercises/search/by', [ExerciseController::class, 'search']);
    Route::post('exercises/assign-points', [ExerciseController::class, 'assignPoints']);
});