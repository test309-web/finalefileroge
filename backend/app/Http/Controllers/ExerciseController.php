<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\StudentPoint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * @OA\Tag(name="Exercises")
 */
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
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of exercises"
     *     )
     * )
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->isTeacher()) {
            $exercises = Exercise::where('teacher_id', $user->id)
                ->with(['lesson'])
                ->get();
        } else {
            $exercises = Exercise::with(['teacher', 'lesson'])
                ->get();
        }

        return response()->json([
            'status' => 'success',
            'exercises' => $exercises
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/exercises",
     *     summary="Create a new exercise",
     *     tags={"Exercises"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title","description","content","lesson_id","subject","level","points"},
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="content", type="string"),
     *             @OA\Property(property="lesson_id", type="integer"),
     *             @OA\Property(property="subject", type="string"),
     *             @OA\Property(property="level", type="string"),
     *             @OA\Property(property="points", type="integer"),
     *             @OA\Property(property="file_url", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Exercise created successfully"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $user = $request->user();
        
        if (!$user->isTeacher()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Only teachers can create exercises'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'required|string',
            'lesson_id' => 'required|exists:lessons,id',
            'subject' => 'required|string|max:255',
            'level' => 'required|string|max:255',
            'points' => 'required|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $exercise = Exercise::create([
            'title' => $request->title,
            'description' => $request->description,
            'content' => $request->content,
            'teacher_id' => $user->id,
            'lesson_id' => $request->lesson_id,
            'subject' => $request->subject,
            'level' => $request->level,
            'points' => $request->points,
            'file_url' => $request->file_url
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Exercise created successfully',
            'exercise' => $exercise
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/exercises/{id}",
     *     summary="Get exercise details",
     *     tags={"Exercises"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Exercise details"
     *     )
     * )
     */
    public function show($id)
    {
        $exercise = Exercise::with(['teacher', 'lesson', 'studentPoints.student'])->find($id);

        if (!$exercise) {
            return response()->json([
                'status' => 'error',
                'message' => 'Exercise not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'exercise' => $exercise
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/exercises/search/by",
     *     summary="Search exercises",
     *     tags={"Exercises"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="title",
     *         in="query",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="subject",
     *         in="query",
     *         @OA\Schema(type="string")
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

        if ($request->has('subject')) {
            $query->where('subject', 'like', '%' . $request->subject . '%');
        }

        if ($request->has('level')) {
            $query->where('level', $request->level);
        }

        $exercises = $query->get();

        return response()->json([
            'status' => 'success',
            'exercises' => $exercises
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/exercises/assign-points",
     *     summary="Assign points to student",
     *     tags={"Exercises"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"student_id","exercise_id","points_earned"},
     *             @OA\Property(property="student_id", type="integer"),
     *             @OA\Property(property="exercise_id", type="integer"),
     *             @OA\Property(property="points_earned", type="integer"),
     *             @OA\Property(property="teacher_notes", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Points assigned successfully"
     *     )
     * )
     */
    public function assignPoints(Request $request)
    {
        $user = $request->user();
        
        if (!$user->isTeacher()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Only teachers can assign points'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:users,id',
            'exercise_id' => 'required|exists:exercises,id',
            'points_earned' => 'required|integer|min:0',
            'teacher_notes' => 'sometimes|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $studentPoint = StudentPoint::create([
            'student_id' => $request->student_id,
            'exercise_id' => $request->exercise_id,
            'points_earned' => $request->points_earned,
            'teacher_notes' => $request->teacher_notes
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Points assigned successfully',
            'student_point' => $studentPoint
        ], 201);
    }
}