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
        // Check if moodScore exists and is a number
        if (moodScore === undefined || moodScore === null) {
            return '😐'; // Default neutral emoji
        }

        // Map mood score to emoji based on 1-10 scale
        const score = Number(moodScore);
        if (isNaN(score)) return '😐';

        if (score >= 9) return '🤩'; // Excellent
        if (score >= 7) return '😊'; // Happy
        if (score >= 5) return '😌'; // Okay
        if (score >= 3) return '😔'; // Sad
        return '😢'; // Very sad
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

    const getCategoryBadge = (category) => {
        if (!category) return null;

        const colors = {
            'IMAGE': 'badge-primary',
            'LINK': 'badge-secondary',
            'TEXT': 'badge-accent',
            'ZIP': 'badge-warning'
        };

        return <span className={`badge ${colors[category] || 'badge-ghost'}`}>{category}</span>;
    };

    const getAppointmentStatusBadge = (status) => {
        if (!status) return null;

        const colors = {
            'PENDING': 'badge-warning',
            'CONFIRMED': 'badge-success',
            'CANCELED': 'badge-error',
            'COMPLETED': 'badge-info'
        };

        return <span className={`badge ${colors[status] || 'badge-ghost'}`}>{status}</span>;
    };

    if (error) return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold text-error">Error</h1>
                    <p className="py-6">{error}</p>
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>Try Again</button>
                </div>
            </div>
        </div>
    );

    if (!user) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-lg">Loading profile...</p>
            </div>
        </div>
    );

    return (
        <div className="bg-base-100 min-h-screen">
            {/* Hero section with user info */}
            <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content py-12">
                <div className="hero-content text-center">
                    <div>
                        <div className="avatar placeholder mb-4">
                            <div className="bg-neutral text-neutral-content rounded-full w-24">
                                <span className="text-3xl">{user.name ? user.name.charAt(0) : '?'}</span>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold">{user.name || 'User'}</h1>
                        <div className="flex justify-center gap-4 mt-2">
                            <div className="badge badge-ghost">{user.email || 'No email'}</div>
                            <div className="badge badge-accent badge-outline">{user.role || 'User'}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Latest mood indicator */}
            {moods.length > 0 && (
                <div className="flex justify-center -mt-6">
                    <div className="stats shadow bg-base-100">
                        <div className="stat">
                            <div className="stat-title">Current Mood</div>
                            <div className="stat-value flex items-center gap-2">
                                <span className="text-3xl">{getMoodEmoji(moods[0].moodScore)}</span>
                                <span className="text-xl">{getMoodText(moods[0].moodScore)}</span>
                            </div>
                            <div className="stat-desc">{formatDate(moods[0].moodDate)}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main content tabs */}
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="tabs tabs-boxed mb-6 flex justify-center">
                    <a
                        className={`tab tab-lg ${activeTab === 'posts' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('posts')}
                    >
                        Posts
                    </a>
                    <a
                        className={`tab tab-lg ${activeTab === 'appointments' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('appointments')}
                    >
                        Appointments
                    </a>
                    <a
                        className={`tab tab-lg ${activeTab === 'moods' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('moods')}
                    >
                        Mood History
                    </a>
                    <a
                        className={`tab tab-lg ${activeTab === 'activity' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('activity')}
                    >
                        Activity
                    </a>
                </div>

                {/* Posts Tab */}
                {activeTab === 'posts' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {posts.length > 0 ? posts.map(post => (
                            <div key={post.id} className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    <div className="flex justify-between items-start">
                                        <h2 className="card-title">{post.title}</h2>
                                        {getCategoryBadge(post.category)}
                                    </div>
                                    <p className="line-clamp-3">{post.text || "No content available"}</p>
                                    <div className="card-actions justify-between items-center mt-4">
                                        <div className="badge badge-outline">{formatDate(post.timestamp)}</div>
                                        <button className="btn btn-sm btn-primary">Read More</button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-2 card bg-base-200">
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title">No Posts Yet</h2>
                                    <p>This user hasn't created any posts.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Appointments Tab */}
                {activeTab === 'appointments' && (
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                            <tr>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>With</th>
                            </tr>
                            </thead>
                            <tbody>
                            {appointments.length > 0 ? appointments.map(appointment => (
                                <tr key={appointment.id}>
                                    <td className="font-medium">{appointment.description}</td>
                                    <td>{appointment.appointment_type || "OTHER"}</td>
                                    <td>{formatDate(appointment.appointment_time)}</td>
                                    <td>
                                        {getAppointmentStatusBadge(appointment.appointment_status)}
                                    </td>
                                    <td>{appointment.appointment_with}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-8">No appointments scheduled</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Moods Tab */}
                {activeTab === 'moods' && (
                    <div className="card bg-base-200 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Mood History</h2>

                            {moods.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {moods.map(mood => (
                                        <div key={mood.id} className="card bg-base-100 shadow-sm">
                                            <div className="card-body">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-4xl">{getMoodEmoji(mood.moodScore)}</div>
                                                    <div>
                                                        <h3 className="font-bold">{getMoodText(mood.moodScore)}</h3>
                                                        <p className="text-sm opacity-70">{formatDate(mood.moodDate)}</p>
                                                    </div>
                                                    <div className="ml-auto">
                                                        <div className="badge badge-lg">{mood.moodScore}/10</div>
                                                    </div>
                                                </div>

                                                {mood.notes && (
                                                    <div className="mt-4 bg-base-200 p-4 rounded-lg">
                                                        <p className="italic">"{mood.notes}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">No mood data available</div>
                            )}
                        </div>
                    </div>
                )}

                {/* Activity Tab (Likes & Comments) */}
                {activeTab === 'activity' && (
                    <div className="grid grid-cols-1 gap-6">
                        <div className="card bg-base-200 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Recent Activity</h2>

                                <div className="divider">Likes ({likes.length})</div>
                                {likes.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="table table-compact w-full">
                                            <thead>
                                            <tr>
                                                <th>Post ID</th>
                                                <th>Timestamp</th>
                                                <th>Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {likes.map(like => (
                                                <tr key={like.id}>
                                                    <td>{like.postId}</td>
                                                    <td>{formatDate(like.timestamp)}</td>
                                                    <td>
                                                        <button className="btn btn-xs btn-ghost">View Post</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-center py-4">No likes yet</p>
                                )}

                                <div className="divider">Comments ({comments.length})</div>
                                {comments.length > 0 ? comments.map(comment => (
                                    <div key={comment.id} className="chat chat-start">
                                        <div className="chat-header">
                                            {formatDate(comment.timestamp)}
                                            <span className="ml-2 text-xs opacity-70">Post #{comment.postId}</span>
                                        </div>
                                        <div className="chat-bubble">{comment.text}</div>
                                    </div>
                                )) : (
                                    <p className="text-center py-4">No comments yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;