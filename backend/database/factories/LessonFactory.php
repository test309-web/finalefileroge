<?php
// database/factories/LessonFactory.php

namespace Database\Factories;

use App\Models\User;
use App\Models\Lesson;
use Illuminate\Database\Eloquent\Factories\Factory;

class LessonFactory extends Factory
{
    protected $model = Lesson::class;

    public function definition()
    {
        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'content' => $this->faker->text(500),
            'level' => $this->faker->randomElement(['beginner', 'intermediate', 'advanced']),
            'teacher_id' => User::factory()->create(['role' => 'teacher'])->id,
        ];
    }
}