<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentPoint extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'exercise_id',
        'points_earned',
        'teacher_notes'
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }
}