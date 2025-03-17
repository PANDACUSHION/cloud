import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MoodTracker = () => {
    const [moodScore, setMoodScore] = useState(5);
    const [notes, setNotes] = useState('');
    const [moods, setMoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const { user } = useAuth();
    const userId = user?.id;

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

            const formattedMoods = response.data.map(mood => {
                const dateObj = new Date(mood.moodDate);

                return {
                    ...mood,
                    date: dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                    time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
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
            setNotes('');
            fetchMoods();

            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (err) {
            setError('Failed to record mood. Please try again.');
            console.error('Error saving mood:', err);

            setTimeout(() => {
                setError('');
            }, 3000);
        }
    };

    const getMoodEmoji = (score) => {
        const emojis = ['😭', '😟', '😐', '🙂', '😄'];
        return emojis[Math.min(Math.floor(score / 2), 4)];
    };

    const getMoodText = (score) => {
        const texts = ['Very Bad', 'Bad', 'Neutral', 'Good', 'Excellent'];
        return texts[Math.min(Math.floor(score / 2), 4)];
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

    const getMoodLineColor = (score) => {
        const colors = [
            '#ef4444', // red-500
            '#f97316', // orange-500
            '#eab308', // yellow-500
            '#22c55e', // green-500
            '#16a34a'  // green-600
        ];
        return colors[Math.min(Math.floor(score / 2), 4)];
    };

    const renderCustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const score = payload[0].value;
            return (
                <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
                    <p className="font-semibold">{label}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-block w-4 h-4 rounded-full ${getMoodColor(score)}`}></span>
                        <span className="font-bold">{score}/10</span>
                        <span>{getMoodEmoji(score)}</span>
                        <span>{getMoodText(score)}</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6 ">
            {/* Mood Input Section */}
            <div className="card w-full lg:w-1/3 bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                    <h2 className="text-2xl font-bold text-white">How are you feeling today?</h2>
                </div>
                <div className="card-body p-6">
                    {successMessage && (
                        <div className="alert alert-success shadow-lg mb-4 rounded-lg">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="ml-2">{successMessage}</span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-error shadow-lg mb-4 rounded-lg">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="ml-2">{error}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-8">
                            <div className="flex justify-between text-2xl mb-2">
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
                                className="range range-primary w-full h-4 accent-blue-600"
                                step="1"
                            />
                            <div className="flex justify-between text-sm mt-1 text-gray-600">
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

                        <div className="mb-8">
                            <div className="flex flex-col items-center justify-center mb-4">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-lg ${getMoodColor(moodScore)}`}>
                                    {getMoodEmoji(moodScore)}
                                </div>
                                <p className="text-center font-bold text-xl mt-4">
                                    {moodScore}/10 - {getMoodText(moodScore)}
                                </p>
                            </div>
                        </div>

                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text font-medium text-gray-700">Notes (optional)</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-24 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                placeholder="How's your day going? What's on your mind?"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="form-control">
                            <button type="submit" className="btn btn-primary bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all">
                                Record Mood
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Mood History Graph Section */}
            <div className="card w-full lg:w-2/3 bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                    <h2 className="text-2xl font-bold text-white">Your Mood History</h2>
                </div>
                <div className="card-body p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="loading loading-spinner loading-lg text-blue-500"></div>
                        </div>
                    ) : moods.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-64 bg-gray-50 rounded-lg p-8">
                            <div className="text-5xl mb-4">📊</div>
                            <p className="text-xl font-semibold mb-2">No mood data yet</p>
                            <p className="text-gray-500 text-center">Start tracking your mood to see your history here</p>
                        </div>
                    ) : (
                        <>
                            <div className="h-72 mb-8 p-4 bg-gray-50 rounded-lg">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={moods}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12, fill: '#6b7280' }}
                                            tickFormatter={(value, index) => index % 2 === 0 ? value : ''}
                                            stroke="#9ca3af"
                                        />
                                        <YAxis
                                            domain={[1, 10]}
                                            tick={{ fontSize: 12, fill: '#6b7280' }}
                                            stroke="#9ca3af"
                                            ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                                        />
                                        <Tooltip content={renderCustomTooltip} />
                                        <Line
                                            type="monotone"
                                            dataKey="moodScore"
                                            stroke="#8884d8"
                                            strokeWidth={3}
                                            activeDot={{ r: 8 }}
                                            dot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
                                            strokeLinecap="round"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <h3 className="font-bold text-xl mb-4 text-gray-800">Recent Entries</h3>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="rounded-tl-lg">Date</th>
                                        <th>Time</th>
                                        <th>Mood</th>
                                        <th className="rounded-tr-lg">Notes</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {moods.slice(0, 5).map((mood) => (
                                        <tr key={mood.id} className="hover:bg-gray-50">
                                            <td className="font-medium">{mood.date}</td>
                                            <td>{mood.time}</td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                        <span className={`badge ${getMoodColor(mood.moodScore)} text-white px-3 py-2`}>
                                                            {mood.moodScore}/10
                                                        </span>
                                                    <span className="text-xl">{getMoodEmoji(mood.moodScore)}</span>
                                                    <span className="text-sm text-gray-600">{getMoodText(mood.moodScore)}</span>
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