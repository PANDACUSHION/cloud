// src/components/MoodTracker.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

const MoodTracker = () => {
    const [moodScore, setMoodScore] = useState(5);
    const [notes, setNotes] = useState('');
    const [moods, setMoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const { user } = useAuth(); // Get the authenticated user from AuthContext
    const userId = user?.id; // Access the user ID from the user object

    // Fetch user moods when component mounts
    useEffect(() => {
        if (userId) {
            fetchMoods();
        }
    }, [userId]);

    const fetchMoods = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`api/moods/user/${userId}/moods`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Properly format the date and time
            const formattedMoods = response.data.map(mood => {
                const dateObj = new Date(mood.moodDate); // Directly parse the ISO date

                return {
                    ...mood,
                    date: dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }), // DD/MM/YYYY
                    time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) // HH:MM:SS AM/PM
                };
            });

            setMoods(formattedMoods.length > 0 ? formattedMoods : []);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch mood history. Please try again later.');
            setLoading(false);
            console.error('Error fetching moods:', err);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            await axios.post('api/moods/mood',
                { moodScore, notes, userId },
                { headers: { Authorization: `Bearer ${token}` }}
            );

            setSuccessMessage('Mood recorded successfully!');
            // Clear the form
            setNotes('');
            // Don't reset moodScore to allow for quick consecutive entries

            // Refresh the mood list
            fetchMoods();

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (err) {
            setError('Failed to record mood. Please try again.');
            console.error('Error saving mood:', err);

            // Clear error message after 3 seconds
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    };

    const getMoodEmoji = (score) => {
        const emojis = ['😭', '😟', '😐', '🙂', '😄'];
        return emojis[Math.min(Math.floor(score / 2), 4)];
    };

    const getMoodColor = (score) => {
        const colors = [
            'bg-red-500', // 1-2
            'bg-orange-400', // 3-4
            'bg-yellow-400', // 5-6
            'bg-green-400', // 7-8
            'bg-green-600'  // 9-10
        ];
        return colors[Math.min(Math.floor(score / 2), 4)];
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6">
            {/* Mood Input Section */}
            <div className="card w-full lg:w-1/3 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold mb-4">How are you feeling today?</h2>

                    {successMessage && (
                        <div className="alert alert-success mb-4">
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <div className="flex justify-between text-lg mb-2">
                                <span>😭</span>
                                <span>😟</span>
                                <span>😐</span>
                                <span>🙂</span>
                                <span>😄</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={moodScore}
                                onChange={(e) => setMoodScore(parseInt(e.target.value))}
                                className="range range-primary w-full"
                                step="1"
                            />
                            <div className="flex justify-between text-sm">
                                <span>1</span>
                                <span>2</span>
                                <span>3</span>
                                <span>4</span>
                                <span>5</span>
                                <span>6</span>
                                <span>7</span>
                                <span>8</span>
                                <span>9</span>
                                <span>10</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${getMoodColor(moodScore)}`}>
                                    {getMoodEmoji(moodScore)}
                                </div>
                            </div>
                            <p className="text-center font-semibold">
                                {moodScore}/10
                            </p>
                        </div>

                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text">Notes (optional)</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-24"
                                placeholder="How's your day going? What's on your mind?"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="form-control">
                            <button type="submit" className="btn btn-primary">Record Mood</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Mood History Graph Section */}
            <div className="card w-full lg:w-2/3 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold mb-4">Your Mood History</h2>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : moods.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-64">
                            <p className="text-lg mb-2">No mood data yet</p>
                            <p className="text-gray-500">Start tracking your mood to see your history here</p>
                        </div>
                    ) : (
                        <>
                            <div className="h-64 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={moods}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12 }}
                                            tickFormatter={(value, index) => index % 2 === 0 ? value : ''}
                                        />
                                        <YAxis domain={[1, 10]} />
                                        <Tooltip
                                            formatter={(value, name) => [`Mood: ${value}/10`, '']}
                                            labelFormatter={(label) => `Date: ${label}`}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="moodScore"
                                            stroke="#8884d8"
                                            strokeWidth={2}
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <h3 className="font-bold text-lg mb-2">Recent Entries</h3>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                    <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Mood</th>
                                        <th>Notes</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {moods.slice(0, 5).map((mood) => (
                                        <tr key={mood.id}>
                                            <td>{mood.date}</td>
                                            <td>{mood.time}</td>
                                            <td>
                                                <div className="flex items-center gap-2">
                            <span className={`badge ${getMoodColor(mood.moodScore)} text-white`}>
                              {mood.moodScore}/10
                            </span>
                                                    <span>{getMoodEmoji(mood.moodScore)}</span>
                                                </div>
                                            </td>
                                            <td className="truncate max-w-xs">{mood.notes || '-'}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MoodTracker;