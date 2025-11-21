<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LessonController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * @OA\Get(
     *     path="/api/lessons",
     *     summary="Get all lessons",
     *     tags={"Lessons"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(ref="#/components/schemas/Lesson")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Server error message")
     *         )
     *     )
     * )
     */
    public function index()
    {
        try {
            $lessons = Lesson::with('teacher')->get();
            
            return response()->json([
                'status' => 'success',
                'data' => $lessons
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/lessons/{id}",
     *     summary="Get specific lesson by ID",
     *     tags={"Lessons"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Lesson ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="data", ref="#/components/schemas/LessonWithExercises")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Lesson not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Lesson not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error"
     *     )
     * )
     */
    public function show($id)
    {
        try {
            $lesson = Lesson::with(['teacher', 'exercises'])->find($id);
            
            if (!$lesson) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Lesson not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $lesson
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/lessons",
     *     summary="Create a new lesson",
     *     tags={"Lessons"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title","description","content","level"},
     *             @OA\Property(property="title", type="string", maxLength=255, example="Introduction to PHP"),
     *             @OA\Property(property="description", type="string", example="A beginner-friendly introduction to PHP programming"),
     *             @OA\Property(property="content", type="string", example="Full lesson content here..."),
     *             @OA\Property(property="level", type="string", enum={"beginner","intermediate","advanced"}, example="beginner")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Lesson created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Lesson created successfully"),
     *             @OA\Property(property="data", ref="#/components/schemas/Lesson")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Validation failed"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error"
     *     )
     * )
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'content' => 'required|string',
                'level' => 'required|in:beginner,intermediate,advanced'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $lesson = Lesson::create([
                'title' => $request->title,
                'description' => $request->description,
                'content' => $request->content,
                'level' => $request->level,
                'teacher_id' => $request->user()->id
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Lesson created successfully',
                'data' => $lesson
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/lessons/{id}",
     *     summary="Update an existing lesson",
     *     tags={"Lessons"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Lesson ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string", maxLength=255, example="Updated Lesson Title"),
     *             @OA\Property(property="description", type="string", example="Updated description"),
     *             @OA\Property(property="content", type="string", example="Updated content..."),
     *             @OA\Property(property="level", type="string", enum={"beginner","intermediate","advanced"}, example="intermediate")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lesson updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Lesson updated successfully"),
     *             @OA\Property(property="data", ref="#/components/schemas/Lesson")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized to update this lesson",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Unauthorized to update this lesson")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Lesson not found"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        try {
            $lesson = Lesson::find($id);
            
            if (!$lesson) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Lesson not found'
                ], 404);
            }

            if ($lesson->teacher_id !== $request->user()->id && !$request->user()->isAdmin()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to update this lesson'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'content' => 'sometimes|string',
                'level' => 'sometimes|in:beginner,intermediate,advanced'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $lesson->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Lesson updated successfully',
                'data' => $lesson
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/lessons/{id}",
     *     summary="Delete a lesson",
     *     tags={"Lessons"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Lesson ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lesson deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Lesson deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized to delete this lesson"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Lesson not found"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error"
     *     )
     * )
     */
    public function destroy(Request $request, $id)
    {
        try {
            $lesson = Lesson::find($id);
            
            if (!$lesson) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Lesson not found'
                ], 404);
            }

            if ($lesson->teacher_id !== $request->user()->id && !$request->user()->isAdmin()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to delete this lesson'
                ], 403);
            }

            $lesson->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Lesson deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/teacher/lessons",
     *     summary="Get lessons created by the authenticated teacher",
     *     tags={"Lessons"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(ref="#/components/schemas/Lesson")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error"
     *     )
     * )
     */
    public function teacherLessons(Request $request)
    {
        try {
            $lessons = Lesson::where('teacher_id', $request->user()->id)->get();
            
            return response()->json([
                'status' => 'success',
                'data' => $lessons
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/lessons/search",
     *     summary="Search lessons by title and/or level",
     *     tags={"Lessons"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="title",
     *         in="query",
     *         description="Search by lesson title",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="level",
     *         in="query",
     *         description="Filter by level",
     *         @OA\Schema(type="string", enum={"beginner","intermediate","advanced"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(ref="#/components/schemas/Lesson")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error"
     *     )
     * )
     */
    public function search(Request $request)
    {
        try {
            $query = Lesson::with('teacher');

            if ($request->has('title')) {
                $query->where('title', 'like', '%' . $request->title . '%');
            }

            if ($request->has('level')) {
                $query->where('level', $request->level);
            }

            $lessons = $query->get();

            return response()->json([
                'status' => 'success',
                'data' => $lessons
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }
}