
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getExercise } from '../services/exerciseService';

const ExerciseDetail = () => {
    const { id } = useParams();
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                setUser(userData);

                const exerciseData = await getExercise(id);
                setExercise(exerciseData.exercise);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch exercise", error);
                setLoading(false);
            }
        };
        fetchExercise();
    }, [id]);

    if (loading) {
        return <div className="container mt-5 text-center">Loading...</div>;
    }

    if (!exercise) {
        return (
            <div className="container mt-5 text-center">
                <h2>Exercise not found</h2>
                <a href="/exercises" className="btn btn-primary">Back to Exercises</a>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <nav className="navbar navbar-light bg-light mb-4">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/exercises">← Back to Exercises</a>
                </div>
            </nav>

            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2>{exercise.title}</h2>
                        {user && user.role === 'teacher' && exercise.teacher_id === user.id && (
                            <div>
                                <button className="btn btn-warning btn-sm me-2">Edit</button>
                                <button className="btn btn-danger btn-sm">Delete</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="card-body">
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <p><strong>Subject:</strong> {exercise.subject}</p>
                            <p><strong>Level:</strong> {exercise.level}</p>
                            <p><strong>Points:</strong> <span className="badge bg-primary">{exercise.points}</span></p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Teacher:</strong> {exercise.teacher ? exercise.teacher.name : 'Unknown'}</p>
                            <p><strong>Created:</strong> {new Date(exercise.created_at).toLocaleDateString()}</p>
                            {exercise.lesson && (
                                <p><strong>Lesson:</strong> {exercise.lesson.title}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h5>Description</h5>
                        <p className="lead">{exercise.description}</p>
                    </div>

                    <div className="mb-4">
                        <h5>Exercise Content</h5>
                        <div className="p-3 bg-light rounded">
                            {exercise.content}
                        </div>
                    </div>

                    {exercise.file_path && (
                        <div className="mb-4">
                            <h5>Attached File</h5>
                            <a href={exercise.file_path} className="btn btn-outline-primary" target="_blank" rel="noopener noreferrer">
                                Download File
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Student Points Section - Only for Teachers */}
            {user && user.role === 'teacher' && exercise.student_points && exercise.student_points.length > 0 && (
                <div className="card mt-4">
                    <div className="card-header">
                        <h4>Student Submissions</h4>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Points Earned</th>
                                        <th>Teacher Notes</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exercise.student_points.map(point => (
                                        <tr key={point.id}>
                                            <td>{point.student ? point.student.name : 'Unknown'}</td>
                                            <td>
                                                <span className={`badge ${point.points_earned >= exercise.points * 0.8 ? 'bg-success' : 'bg-warning'}`}>
                                                    {point.points_earned}/{exercise.points}
                                                </span>
                                            </td>
                                            <td>{point.teacher_notes || 'No notes'}</td>
                                            <td>{new Date(point.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExerciseDetail;