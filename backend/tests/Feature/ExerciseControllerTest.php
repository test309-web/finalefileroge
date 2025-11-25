<?php
namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Lesson;
use App\Models\Exercise;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ExerciseControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $teacher;
    protected $lesson;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->teacher = User::factory()->create(['role' => 'teacher']);
        $this->lesson = Lesson::create([
            'title' => 'Test Lesson',
            'description' => 'Test Description',
            'content' => 'Test Content',
            'level' => 'beginner',
            'teacher_id' => $this->teacher->id
        ]);
    }

    /** @test */
    public function teacher_can_create_exercise()
    {
        $response = $this->actingAs($this->teacher)
            ->postJson('/api/exercises', [
                'title' => 'Test Exercise',
                'description' => 'Test Description',
                'content' => 'Test Content',
                'solution' => 'Test Solution',
                'level' => 'beginner',
                'points' => 10,
                'lesson_id' => $this->lesson->id
            ]);

        $response->assertStatus(201)
            ->assertJson(['status' => 'success']);
    }

    /** @test */
    public function user_can_get_all_exercises()
    {
        // إنشاء تمارين بدون استخدام Factory
        Exercise::create([
            'title' => 'Exercise 1',
            'description' => 'Description 1',
            'content' => 'Content 1',
            'solution' => 'Solution 1',
            'level' => 'beginner',
            'points' => 10,
            'lesson_id' => $this->lesson->id,
            'teacher_id' => $this->teacher->id
        ]);

        Exercise::create([
            'title' => 'Exercise 2', 
            'description' => 'Description 2',
            'content' => 'Content 2',
            'solution' => 'Solution 2',
            'level' => 'intermediate',
            'points' => 15,
            'lesson_id' => $this->lesson->id,
            'teacher_id' => $this->teacher->id
        ]);

        $response = $this->actingAs($this->teacher)
            ->getJson('/api/exercises');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data'
            ]);
    }
}