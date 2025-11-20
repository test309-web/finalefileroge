<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Exercise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * @OA\Tag(name="Lessons")
 */
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
     *         description="List of lessons"
     *     )
     * )
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->isTeacher()) {
                $lessons = Lesson::where('teacher_id', $user->id)
                    ->with(['exercises'])
                    ->get();
            } else {
                $lessons = Lesson::with(['teacher', 'exercises'])
                    ->get();
            }

            return response()->json([
                'status' => 'success',
                'lessons' => $lessons
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch lessons: ' . $e->getMessage()
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
     *             required={"title","description","content","subject","level"},
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="content", type="string"),
     *             @OA\Property(property="subject", type="string"),
     *             @OA\Property(property="level", type="string"),
     *             @OA\Property(property="file_url", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Lesson created successfully"
     *     )
     * )
     */
    public function store(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user->isTeacher() && !$user->isAdmin()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only teachers and admins can create lessons'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'content' => 'required|string',
                'subject' => 'required|string|max:255',
                'level' => 'required|string|max:255'
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $lesson = Lesson::create([
                'title' => $request->title,
                'description' => $request->description,
                'content' => $request->content,
                'teacher_id' => $user->isTeacher() ? $user->id : $request->teacher_id ?? $user->id,
                'subject' => $request->subject,
                'level' => $request->level,
                'file_url' => $request->file_url
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Lesson created successfully',
                'lesson' => $lesson
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create lesson: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/lessons/{id}",
     *     summary="Get lesson details",
     *     tags={"Lessons"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lesson details"
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
                'lesson' => $lesson
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch lesson: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/lessons/{id}",
     *     summary="Update lesson",
     *     tags={"Lessons"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="content", type="string"),
     *             @OA\Property(property="subject", type="string"),
     *             @OA\Property(property="level", type="string"),
     *             @OA\Property(property="file_url", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lesson updated successfully"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        try {
            $user = $request->user();
            $lesson = Lesson::find($id);

            if (!$lesson) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Lesson not found'
                ], 404);
            }

            // Admin يمكنه تعديل أي درس، Teacher يمكنه تعديل دروسه فقط
            if (!$user->isAdmin() && $lesson->teacher_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to update this lesson'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'content' => 'sometimes|string',
                'subject' => 'sometimes|string|max:255',
                'level' => 'sometimes|string|max:255',
                'file_url' => 'sometimes|string'
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $lesson->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Lesson updated successfully',
                'lesson' => $lesson
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update lesson: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/lessons/{id}",
     *     summary="Delete lesson",
     *     tags={"Lessons"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lesson deleted successfully"
     *     )
     * )
     */
    public function destroy(Request $request, $id)
    {
        try {
            $user = $request->user();
            $lesson = Lesson::find($id);

            if (!$lesson) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Lesson not found'
                ], 404);
            }

            // Admin يمكنه حذف أي درس، Teacher يمكنه حذف دروسه فقط
            if (!$user->isAdmin() && $lesson->teacher_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized to delete this lesson'
                ], 403);
            }

            $lesson->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Lesson deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete lesson: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/lessons/search/by",
     *     summary="Search lessons",
     *     tags={"Lessons"},
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
        try {
            $query = Lesson::with(['teacher', 'exercises']);

            if ($request->has('title')) {
                $query->where('title', 'like', '%' . $request->title . '%');
            }

            if ($request->has('subject')) {
                $query->where('subject', 'like', '%' . $request->subject . '%');
            }

            if ($request->has('level')) {
                $query->where('level', $request->level);
            }

            $lessons = $query->get();

            return response()->json([
                'status' => 'success',
                'lessons' => $lessons
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Search failed: ' . $e->getMessage()
            ], 500);
        }
    }
}