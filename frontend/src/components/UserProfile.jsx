import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [moods, setMoods] = useState([]);
    const [posts, setPosts] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('posts');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`/api/users/user/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setUser(userResponse.data);

                const moodsResponse = await axios.get(`/api/users/user/${id}/moods`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setMoods(moodsResponse.data);

                const postsResponse = await axios.get(`/api/users/user/${id}/posts`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setPosts(postsResponse.data);

                const appointmentsResponse = await axios.get(`/api/users/user/${id}/appointments`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setAppointments(appointmentsResponse.data);

                const likesResponse = await axios.get(`/api/users/user/${id}/likes`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setLikes(likesResponse.data);

                const commentsResponse = await axios.get(`/api/users/user/${id}/comments`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setComments(commentsResponse.data);
            } catch (err) {
                setError('Failed to fetch user data');
                console.error(err);
            }
        };

        fetchUserData();
    }, [id]);

    // Get mood emoji based on mood score
    const getMoodEmoji = (moodScore) => {
        if (moodScore === undefined || moodScore === null) {
            return '😐';
        }

        const score = Number(moodScore);
        if (isNaN(score)) return '😐';

        if (score >= 9) return '🤩';
        if (score >= 7) return '😊';
        if (score >= 5) return '😌';
        if (score >= 3) return '😔';
        return '😢';
    };

    // Get mood text based on score
    const getMoodText = (moodScore) => {
        if (moodScore === undefined || moodScore === null) return 'Unknown';

        const score = Number(moodScore);
        if (isNaN(score)) return 'Unknown';

        if (score >= 9) return 'Excellent';
        if (score >= 7) return 'Happy';
        if (score >= 5) return 'Okay';
        if (score >= 3) return 'Sad';
        return 'Very Sad';
    };

    // Format date nicely
    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Custom color categories for post types
    const getCategoryBadge = (category) => {
        if (!category) return null;

        const colors = {
            'IMAGE': 'bg-blue-600 text-white',
            'LINK': 'bg-black text-white',
            'TEXT': 'bg-white text-blue-800 border border-blue-800',
            'ZIP': 'bg-orange-500 text-white'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[category] || 'bg-gray-200'}`}>
                {category}
            </span>
        );
    };

    // Custom color status badges
    const getAppointmentStatusBadge = (status) => {
        if (!status) return null;

        const colors = {
            'PENDING': 'bg-orange-500 text-white',
            'CONFIRMED': 'bg-blue-600 text-white',
            'CANCELED': 'bg-red-600 text-white',
            'COMPLETED': 'bg-black text-white'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-200'}`}>
                {status}
            </span>
        );
    };

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
                <h1 className="text-5xl font-bold text-red-600 mb-4">Error</h1>
                <p className="text-gray-700 mb-6">{error}</p>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        </div>
    );

    if (!user) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-lg text-gray-700">Loading profile...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen">
            {/* Hero section with user info - dark blue gradient to light blue */}
            <div className="text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="bg-white text-blue-800 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
                            <span className="text-3xl font-bold">{user.name ? user.name.charAt(0) : '?'}</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold">{user.name || 'User'}</h1>
                    <div className="flex justify-center gap-4 mt-2">
                        <div className="bg-black bg-opacity-30 px-3 py-1 rounded-full">{user.email || 'No email'}</div>
                        <div className="bg-orange-500 px-3 py-1 rounded-full">{user.role || 'User'}</div>
                    </div>
                </div>
            </div>

            {/* Latest mood indicator */}
            {moods.length > 0 && (
                <div className="flex justify-center -mt-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="text-center">
                            <div className="text-sm font-semibold text-gray-500 uppercase">Current Mood</div>
                            <div className="flex items-center justify-center gap-2 mt-1">
                                <span className="text-3xl">{getMoodEmoji(moods[0].moodScore)}</span>
                                <span className="text-xl font-bold text-blue-800">{getMoodText(moods[0].moodScore)}</span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">{formatDate(moods[0].moodDate)}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main content tabs */}
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex justify-center mb-8">
                    <div className="bg-white shadow-md rounded-lg p-1 inline-flex">
                        <button
                            className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
                                activeTab === 'posts'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => setActiveTab('posts')}
                        >
                            Posts
                        </button>
                        <button
                            className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
                                activeTab === 'appointments'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => setActiveTab('appointments')}
                        >
                            Appointments
                        </button>
                        <button
                            className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
                                activeTab === 'moods'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => setActiveTab('moods')}
                        >
                            Mood History
                        </button>
                        <button
                            className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
                                activeTab === 'activity'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => setActiveTab('activity')}
                        >
                            Activity
                        </button>
                    </div>
                </div>

                {/* Posts Tab */}
                {activeTab === 'posts' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {posts.length > 0 ? posts.map(post => (
                            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <h2 className="text-xl font-bold text-blue-800">{post.title}</h2>
                                        {getCategoryBadge(post.category)}
                                    </div>
                                    <p className="text-gray-600 line-clamp-3 mb-4">{post.text || "No content available"}</p>
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-500">{formatDate(post.timestamp)}</div>
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                            Read More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-2 bg-white rounded-lg shadow-md p-8 text-center">
                                <h2 className="text-xl font-bold text-gray-700 mb-2">No Posts Yet</h2>
                                <p className="text-gray-500">This user hasn't created any posts.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Appointments Tab */}
                {activeTab === 'appointments' && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-blue-800 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left">Description</th>
                                    <th className="px-6 py-3 text-left">Type</th>
                                    <th className="px-6 py-3 text-left">Date</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3 text-left">With</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {appointments.length > 0 ? appointments.map((appointment, index) => (
                                    <tr key={appointment.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="px-6 py-4 font-medium text-gray-900">{appointment.description}</td>
                                        <td className="px-6 py-4 text-gray-700">{appointment.appointment_type || "OTHER"}</td>
                                        <td className="px-6 py-4 text-gray-700">{formatDate(appointment.appointment_time)}</td>
                                        <td className="px-6 py-4">
                                            {getAppointmentStatusBadge(appointment.appointment_status)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{appointment.appointment_with}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No appointments scheduled</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Moods Tab */}
                {activeTab === 'moods' && (
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-blue-800 mb-6">Mood History</h2>

                            {moods.length > 0 ? (
                                <div className="space-y-4">
                                    {moods.map(mood => (
                                        <div key={mood.id} className="bg-gray-50 rounded-lg shadow-sm p-4 border-l-4 border-blue-600">
                                            <div className="flex items-center gap-4">
                                                <div className="text-4xl">{getMoodEmoji(mood.moodScore)}</div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{getMoodText(mood.moodScore)}</h3>
                                                    <p className="text-sm text-gray-500">{formatDate(mood.moodDate)}</p>
                                                </div>
                                                <div className="ml-auto">
                                                    <div className="bg-blue-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                        {mood.moodScore}/10
                                                    </div>
                                                </div>
                                            </div>

                                            {mood.notes && (
                                                <div className="mt-4 bg-white p-4 rounded-md border border-gray-200">
                                                    <p className="italic text-gray-700">"{mood.notes}"</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">No mood data available</div>
                            )}
                        </div>
                    </div>
                )}

                {/* Activity Tab (Likes & Comments) */}
                {activeTab === 'activity' && (
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-blue-800 mb-4">Recent Activity</h2>

                            {/* Likes Section */}
                            <div className="relative flex items-center py-5">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink mx-4 text-gray-600 font-medium">Likes ({likes.length})</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>

                            {likes.length > 0 ? (
                                <div className="overflow-x-auto bg-gray-50 rounded-lg mb-8">
                                    <table className="w-full">
                                        <thead className="bg-blue-800 text-white">
                                        <tr>
                                            <th className="px-6 py-3 text-left">Post Title</th>
                                            <th className="px-6 py-3 text-left">Timestamp</th>
                                            <th className="px-6 py-3 text-left">Action</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                        {likes.map((like, index) => {
                                            // Find the post associated with the like
                                            const post = posts.find(p => p.id === like.postId);
                                            return (
                                                <tr key={like.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    <td className="px-6 py-4 text-gray-900">{post ? post.title : `Post #${like.postId}`}</td>
                                                    <td className="px-6 py-4 text-gray-600">{formatDate(like.timestamp)}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                                            Liked
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg mb-8">No likes yet</p>
                            )}

                            {/* Comments Section */}
                            <div className="relative flex items-center py-5">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink mx-4 text-gray-600 font-medium">Comments ({comments.length})</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>

                            {comments.length > 0 ? (
                                <div className="space-y-4">
                                    {comments.map(comment => {
                                        // Find the post associated with the comment
                                        const post = posts.find(p => p.id === comment.postId);
                                        return (
                                            <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-500">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">
                                                            {post ? `Post: ${post.title}` : `Post #${comment.postId}`}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">{formatDate(comment.timestamp)}</p>
                                                    </div>
                                                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                                        Commented
                                                    </span>
                                                </div>
                                                <div className="mt-4 bg-white p-4 rounded-md border border-gray-200">
                                                    <p className="italic text-gray-700">"{comment.text}"</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">No comments yet</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;