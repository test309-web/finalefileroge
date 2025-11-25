<?php
// database/factories/ExerciseFactory.php

namespace Database\Factories;

use App\Models\User;
use App\Models\Lesson;
use App\Models\Exercise;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExerciseFactory extends Factory
{
    protected $model = Exercise::class;

    public function definition()
    {
        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'content' => $this->faker->text(200),
            'solution' => $this->faker->text(100),
            'level' => $this->faker->randomElement(['beginner', 'intermediate', 'advanced']),
            'points' => $this->faker->numberBetween(5, 20),
            'lesson_id' => Lesson::factory(),
            'teacher_id' => User::factory()->create(['role' => 'teacher'])->id,
        ];
    }
}