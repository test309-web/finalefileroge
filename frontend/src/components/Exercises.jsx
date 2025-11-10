
import React, { useState, useEffect } from 'react';
import { getExercises, searchExercises } from '../services/exerciseService';

const Exercises = () => {
    const [exercises, setExercises] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                setUser(userData);

                const exercisesData = await getExercises();
                setExercises(exercisesData.exercises || []);
            } catch (error) {
                console.error("Failed to fetch exercises", error);
            }
        };
        fetchData();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const searchData = {};
            if (searchTerm) {
                searchData.title = searchTerm;
            }
            const result = await searchExercises(searchData);
            setExercises(result.exercises || []);
        } catch (error) {
            console.error("Search failed", error);
        }
    };

    return (
        <div className="container mt-4">
            <nav className="navbar navbar-light bg-light mb-4">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/dashboard">← Back to Dashboard</a>
                    <form className="d-flex" onSubmit={handleSearch}>
                        <input 
                            className="form-control me-2" 
                            type="search" 
                            placeholder="Search exercises..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </nav>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>All Exercises</h1>
                {user && user.role === 'teacher' && (
                    <a href="/exercises/create" className="btn btn-primary">Create New Exercise</a>
                )}
            </div>

            <div className="row">
                {exercises.map(exercise => (
                    <div key={exercise.id} className="col-md-6 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">{exercise.title}</h5>
                                <p className="card-text">{exercise.description}</p>
                                <div className="mb-2">
                                    <small className="text-muted">
                                        Subject: {exercise.subject} | Level: {exercise.level}
                                    </small>
                                </div>
                                <div className="mb-2">
                                    <small className="text-muted">
                                        Points: {exercise.points} | Teacher: {exercise.teacher ? exercise.teacher.name : 'Unknown'}
                                    </small>
                                </div>
                                {exercise.lesson && (
                                    <div className="mb-2">
                                        <small className="text-muted">
                                            Lesson: {exercise.lesson.title}
                                        </small>
                                    </div>
                                )}
                            </div>
                            <div className="card-footer">
                                <a href={`/exercises/${exercise.id}`} className="btn btn-outline-primary btn-sm">
                                    View Details
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {exercises.length === 0 && (
                <div className="text-center mt-5">
                    <h3>No exercises found</h3>
                    <p>Try adjusting your search terms or create a new exercise.</p>
                </div>
            )}
        </div>
    );
};

export default Exercises;