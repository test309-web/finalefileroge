<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exercises', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('content');
            $table->text('solution');
            $table->enum('level', ['beginner', 'intermediate', 'advanced']);
            $table->integer('points')->default(0);
            $table->foreignId('lesson_id')->constrained()->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exercises');
    }
};