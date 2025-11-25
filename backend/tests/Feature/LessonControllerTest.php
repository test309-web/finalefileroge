<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Lesson;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LessonControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $teacher;
    protected $student;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->teacher = User::factory()->create(['role' => 'teacher']);
        $this->student = User::factory()->create(['role' => 'student']);
    }

    /** @test */
    public function teacher_can_create_lesson()
    {
        $response = $this->actingAs($this->teacher)
            ->postJson('/api/lessons', [
                'title' => 'Test Lesson',
                'description' => 'Test Description',
                'content' => 'Test Content',
                'level' => 'beginner'
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'message' => 'Lesson created successfully'
            ]);
    }

    /** @test */
    public function user_can_get_all_lessons()
    {
        // إنشاء دروس بدون استخدام Factory
        Lesson::create([
            'title' => 'Lesson 1',
            'description' => 'Description 1',
            'content' => 'Content 1',
            'level' => 'beginner',
            'teacher_id' => $this->teacher->id
        ]);

        Lesson::create([
            'title' => 'Lesson 2',
            'description' => 'Description 2', 
            'content' => 'Content 2',
            'level' => 'intermediate',
            'teacher_id' => $this->teacher->id
        ]);

        $response = $this->actingAs($this->student)
            ->getJson('/api/lessons');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    '*' => ['id', 'title', 'description', 'level']
                ]
            ]);
    }

    /** @test */
    public function user_can_get_single_lesson()
    {
        $lesson = Lesson::create([
            'title' => 'Single Lesson',
            'description' => 'Single Description',
            'content' => 'Single Content',
            'level' => 'beginner',
            'teacher_id' => $this->teacher->id
        ]);

        $response = $this->actingAs($this->student)
            ->getJson("/api/lessons/{$lesson->id}");

        $response->assertStatus(200)
            ->assertJson(['status' => 'success']);
    }
}