<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ExerciseController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {
  
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/userdetail', [AuthController::class, 'userDetail']);


    Route::get('/lessons', [LessonController::class, 'index']);
    Route::get('/lessons/{id}', [LessonController::class, 'show']);
    Route::post('/lessons', [LessonController::class, 'store']);
    Route::put('/lessons/{id}', [LessonController::class, 'update']);
    Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);
    Route::get('/lessons/search/by', [LessonController::class, 'search']);
    Route::get('/teacher/lessons', [LessonController::class, 'teacherLessons']);

  
    Route::get('/exercises', [ExerciseController::class, 'index']);
    Route::get('/exercises/{id}', [ExerciseController::class, 'show']);
    Route::post('/exercises', [ExerciseController::class, 'store']);
    Route::put('/exercises/{id}', [ExerciseController::class, 'update']);
    Route::delete('/exercises/{id}', [ExerciseController::class, 'destroy']);
    Route::get('/exercises/search/by', [ExerciseController::class, 'search']);
    Route::post('/exercises/assign-points', [ExerciseController::class, 'assignPoints']);

    
    Route::prefix('admin')->group(function () {
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::post('/teachers', [AdminController::class, 'createTeacher']);
        Route::put('/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
    });
});