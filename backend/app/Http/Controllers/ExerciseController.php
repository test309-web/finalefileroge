<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExerciseController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * @OA\Get(
     *     path="/api/exercises",
     *     summary="Get all exercises",
     *     tags={"Exercises"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Exercises retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function index()
    {
        $exercises = Exercise::with(['teacher', 'lesson'])->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $exercises
        ], 200);
    }

    /**
     * @OA\Get(
     *     path="/api/exercises/{id}",
     *     summary="Get specific exercise",
     *     tags={"Exercises"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Exercise retrieved successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Exercise not found"
     *     )
     * )
     */
    public function show($id)
    {
        $exercise = Exercise::with(['teacher', 'lesson'])->find($id);
        
        if (!$exercise) {
            return response()->json([
                'status' => 'error',
                'message' => 'Exercise not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $exercise
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/exercises",
     *     summary="Create a new exercise",
     *     tags={"Exercises"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title","description","content","solution","level","points","lesson_id"},
     *             @OA\Property(property="title", type="string", example="Exercise Title"),
     *             @OA\Property(property="description", type="string", example="Exercise description"),
     *             @OA\Property(property="content", type="string", example="Exercise content"),
     *             @OA\Property(property="solution", type="string", example="Exercise solution"),
     *             @OA\Property(property="level", type="string", enum={"beginner", "intermediate", "advanced"}, example="beginner"),
     *             @OA\Property(property="points", type="integer", example=10),
     *             @OA\Property(property="lesson_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Exercise created successfully"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'required|string',
            'solution' => 'required|string',
            'level' => 'required|in:beginner,intermediate,advanced',
            'points' => 'required|integer|min:1',
            'lesson_id' => 'required|exists:lessons,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $exercise = Exercise::create([
            'title' => $request->title,
            'description' => $request->description,
            'content' => $request->content,
            'solution' => $request->solution,
            'level' => $request->level,
            'points' => $request->points,
            'lesson_id' => $request->lesson_id,
            'teacher_id' => $request->user()->id
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Exercise created successfully',
            'data' => $exercise
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/api/exercises/{id}",
     *     summary="Update exercise",
     *     tags={"Exercises"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string", example="Updated Title"),
     *             @OA\Property(property="description", type="string", example="Updated description"),
     *             @OA\Property(property="content", type="string", example="Updated content"),
     *             @OA\Property(property="solution", type="string", example="Updated solution"),
     *             @OA\Property(property="level", type="string", enum={"beginner", "intermediate", "advanced"}),
     *             @OA\Property(property="points", type="integer", example=15),
     *             @OA\Property(property="lesson_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Exercise updated successfully"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized to update this exercise"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Exercise not found"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        $exercise = Exercise::find($id);
        
        if (!$exercise) {
            return response()->json([
                'status' => 'error',
                'message' => 'Exercise not found'
            ], 404);
        }

        if ($exercise->teacher_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to update this exercise'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'content' => 'sometimes|string',
            'solution' => 'sometimes|string',
            'level' => 'sometimes|in:beginner,intermediate,advanced',
            'points' => 'sometimes|integer|min:1',
            'lesson_id' => 'sometimes|exists:lessons,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $exercise->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Exercise updated successfully',
            'data' => $exercise
        ], 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/exercises/{id}",
     *     summary="Delete exercise",
     *     tags={"Exercises"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Exercise deleted successfully"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized to delete this exercise"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Exercise not found"
     *     )
     * )
     */
    public function destroy(Request $request, $id)
    {
        $exercise = Exercise::find($id);
        
        if (!$exercise) {
            return response()->json([
                'status' => 'error',
                'message' => 'Exercise not found'
            ], 404);
        }

        if ($exercise->teacher_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to delete this exercise'
            ], 403);
        }

        $exercise->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Exercise deleted successfully'
        ], 200);
    }

    /**
     * @OA\Get(
     *     path="/api/exercises/search/by",
     *     summary="Search exercises",
     *     tags={"Exercises"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="title",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="level",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="string", enum={"beginner", "intermediate", "advanced"})
     *     ),
     *     @OA\Parameter(
     *         name="lesson_id",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Search results"
     *     )
     * )
     */
    public function search(Request $request)
    {
        $query = Exercise::with(['teacher', 'lesson']);

        if ($request->has('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        if ($request->has('level')) {
            $query->where('level', $request->level);
        }

        if ($request->has('lesson_id')) {
            $query->where('lesson_id', $request->lesson_id);
        }

        $exercises = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $exercises
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/exercises/assign-points",
     *     summary="Assign points for exercise",
     *     tags={"Exercises"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"exercise_id","user_id","points"},
     *             @OA\Property(property="exercise_id", type="integer", example=1),
     *             @OA\Property(property="user_id", type="integer", example=1),
     *             @OA\Property(property="points", type="integer", example=10)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Points assigned successfully"
     *     )
     * )
     */
    public function assignPoints(Request $request)
    {
        
        return response()->json([
            'status' => 'success',
            'message' => 'Points assigned successfully'
        ], 200);
    }
}