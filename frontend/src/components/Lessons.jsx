
import React, { useState, useEffect } from 'react';
import { getLessons, searchLessons } from '../services/lessonService';

const Lessons = () => {
    const [lessons, setLessons] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                setUser(userData);

                const lessonsData = await getLessons();
                setLessons(lessonsData.lessons || []);
            } catch (error) {
                console.error("Failed to fetch lessons", error);
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
            const result = await searchLessons(searchData);
            setLessons(result.lessons || []);
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
                            placeholder="Search lessons..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </nav>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>All Lessons</h1>
                {user && user.role === 'teacher' && (
                    <a href="/lessons/create" className="btn btn-primary">Create New Lesson</a>
                )}
            </div>

            <div className="row">
                {lessons.map(lesson => (
                    <div key={lesson.id} className="col-md-6 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">{lesson.title}</h5>
                                <p className="card-text">{lesson.description}</p>
                                <div className="mb-2">
                                    <small className="text-muted">
                                        Subject: {lesson.subject} | Level: {lesson.level}
                                    </small>
                                </div>
                                <div className="mb-2">
                                    <small className="text-muted">
                                        Teacher: {lesson.teacher ? lesson.teacher.name : 'Unknown'}
                                    </small>
                                </div>
                                {lesson.exercises && lesson.exercises.length > 0 && (
                                    <div className="mb-2">
                                        <small className="text-muted">
                                            Exercises: {lesson.exercises.length}
                                        </small>
                                    </div>
                                )}
                            </div>
                            <div className="card-footer">
                                <a href={`/lessons/${lesson.id}`} className="btn btn-outline-primary btn-sm">
                                    View Details
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {lessons.length === 0 && (
                <div className="text-center mt-5">
                    <h3>No lessons found</h3>
                    <p>Try adjusting your search terms or create a new lesson.</p>
                </div>
            )}
        </div>
    );
};

export default Lessons;