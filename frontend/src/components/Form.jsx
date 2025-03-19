import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Form = () => {
    const { user } = useAuth();
    const userId = user?.id;
    const isAdmin = user?.role === 'admin';
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Post creation state
    const [postForm, setPostForm] = useState({
        title: '',
        category: 'TEXT',
        text: ''
    });

    // Forum state
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Comments state
    const [expandedPostId, setExpandedPostId] = useState(null);
    const [commentsByPost, setCommentsByPost] = useState({});
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isSubmittingPost, setIsSubmittingPost] = useState(false);

    // Fetch initial data
    useEffect(() => {
        fetchPosts();
        if (userId) {
            fetchUserLikedPosts(userId);
        }
    }, [userId]);

    // Fetch comments when a post is expanded
    useEffect(() => {
        if (expandedPostId && !commentsByPost[expandedPostId]) {
            fetchComments(expandedPostId);
        }
    }, [expandedPostId]);

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/forum/forum/posts');
            setPosts(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch posts:', err);
            setError('Failed to load posts. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserLikedPosts = async (userId) => {
        try {
            const response = await axios.get(`/api/likes/user/${userId}/likes`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // Parse the response based on your API structure
            // Assuming response.data is an array of post objects that the user has liked
            const likedPostIds = response.data.map((post) => post.id);
            setLikedPosts(new Set(likedPostIds));
        } catch (err) {
            console.error('Failed to fetch liked posts:', err);
        }
    };

    const fetchComments = async (postId) => {
        try {
            const response = await axios.get(`/api/comments/post/${postId}/comments`);
            setCommentsByPost(prev => ({
                ...prev,
                [postId]: response.data
            }));
        } catch (err) {
            console.error(`Failed to fetch comments for post ${postId}:`, err);
            setCommentsByPost(prev => ({
                ...prev,
                [postId]: []
            }));
        }
    };

    // Handle file input change for live preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && postForm.category === 'IMAGE') {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    // Form handlers
    const handlePostInputChange = (e) => {
        const { name, value } = e.target;
        setPostForm(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear image preview when changing category from IMAGE to something else
        if (name === 'category' && value !== 'IMAGE') {
            setImagePreview(null);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();

        if (!userId) {
            toast.error('You must be logged in to create a post.');
            return;
        }

        // Validate file for non-TEXT categories
        if (postForm.category !== 'TEXT') {
            if (!fileInputRef.current?.files.length) {
                toast.error(`Please upload a ${postForm.category === 'IMAGE' ? 'image' : 'ZIP'} file.`);
                return;
            }

            // Validate file type
            const file = fileInputRef.current.files[0];
            if (postForm.category === 'ZIP' &&
                file.type !== 'application/zip' &&
                file.type !== 'application/x-zip-compressed') {
                toast.error('Please upload a valid ZIP file.');
                return;
            }

            if (postForm.category === 'IMAGE' &&
                !file.type.startsWith('image/')) {
                toast.error('Please upload a valid image file.');
                return;
            }
        }

        try {
            setIsSubmittingPost(true);
            const formData = new FormData();
            formData.append('title', postForm.title);
            formData.append('category', postForm.category);
            formData.append('text', postForm.text);
            formData.append('userId', userId);

            if (postForm.category !== 'TEXT' && fileInputRef.current?.files.length) {
                formData.append('file', fileInputRef.current.files[0]);
            }

            const response = await axios.post('/api/forum/forum/post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setPosts(prev => [response.data, ...prev]);
            toast.success('Post created successfully!');

            // Reset form
            setPostForm({
                title: '',
                category: 'TEXT',
                text: ''
            });
            setImagePreview(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

        } catch (err) {
            console.error('Failed to create post:', err);
            toast.error('Failed to create post. Please try again.');
        } finally {
            setIsSubmittingPost(false);
        }
    };

    const handleToggleLike = async (postId) => {
        if (!userId) {
            toast.error('You must be logged in to like posts.');
            return;
        }

        try {
            if (likedPosts.has(postId)) {
                await axios.delete('/api/likes/like', {
                    data: { userId, postId },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });

                setLikedPosts(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(postId);
                    return newSet;
                });
            } else {
                await axios.post('/api/likes/like',
                    { userId, postId },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
                );

                setLikedPosts(prev => new Set([...prev, postId]));
            }
        } catch (err) {
            console.error('Failed to toggle like:', err);
            toast.error('Failed to update like status.');
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        try {
            await axios.delete(`/api/forum/forum/post/${postId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setPosts(prev => prev.filter(post => post.id !== postId));
            toast.success('Post deleted successfully');

            // Also clear comments for this post if they exist
            if (commentsByPost[postId]) {
                setCommentsByPost(prev => {
                    const updated = {...prev};
                    delete updated[postId];
                    return updated;
                });
            }

        } catch (err) {
            console.error('Failed to delete post:', err);
            toast.error('Failed to delete post. Please try again.');
        }
    };

    const handleSubmitComment = async (postId) => {
        if (!newComment.trim()) {
            return;
        }

        if (!userId) {
            toast.error('You must be logged in to comment.');
            return;
        }

        try {
            setIsSubmittingComment(true);

            const response = await axios.post(
                'api/comments/comment',
                {
                    userId,
                    postId,
                    text: newComment
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );

            // Update comments for this post
            setCommentsByPost(prev => ({
                ...prev,
                [postId]: [...(prev[postId] || []), response.data]
            }));

            setNewComment('');
            toast.success('Comment posted successfully');

        } catch (err) {
            console.error('Failed to submit comment:', err);
            toast.error('Failed to submit comment. Please try again.');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const toggleComments = (postId) => {
        if (expandedPostId === postId) {
            setExpandedPostId(null);
        } else {
            setExpandedPostId(postId);
        }
    };

    // Toast notification helper (you'll need to install react-hot-toast)
    const toast = {
        success: (message) => {
            // You can replace this with your preferred toast library
            console.log('Success:', message);
            // e.g., toast.success(message)
        },
        error: (message) => {
            // You can replace this with your preferred toast library
            console.log('Error:', message);
            // e.g., toast.error(message)
        }
    };

    // Rendering helpers
    const renderPostAttachment = (post) => {
        if (post.category === 'TEXT' || !post.fileDest) return null;

        if (post.category === 'IMAGE') {
            return (
                <div className="mt-4 flex justify-center">
                    <img
                        src={`/api/download/${post.fileDest}`}
                        alt={post.title}
                        className="rounded-xl max-h-96 object-contain shadow-md hover:shadow-lg transition-shadow"
                        loading="lazy"
                    />
                </div>
            );
        }

        return (
            <div className="mt-4 flex justify-center">
                <a
                    href={`/api/download/${post.fileDest}`}
                    className="btn btn-accent btn-outline gap-2"
                    download
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download {post.category === 'ZIP' ? 'ZIP File' : 'Image'}
                </a>
            </div>
        );
    };

    // Format date for better display
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            {/* Create Post Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-10 transition-all hover:shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Create a New Post</h2>

                <form onSubmit={handleCreatePost} className="space-y-6">
                    {/* Title Input */}
                    <div className="form-control">
                        <label className="label font-medium">
                            <span className="label-text text-gray-700">Title</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            placeholder="What's on your mind?"
                            value={postForm.title}
                            onChange={handlePostInputChange}
                            className="input input-bordered w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors rounded-lg p-3"
                            required
                        />
                    </div>

                    {/* Category and File Upload */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category Dropdown */}
                        <div className="form-control">
                            <label className="label font-medium">
                                <span className="label-text text-gray-700">Category</span>
                            </label>
                            <select
                                name="category"
                                value={postForm.category}
                                onChange={handlePostInputChange}
                                className="select select-bordered w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors rounded-lg p-3"
                            >
                                <option value="TEXT">Text</option>
                                <option value="IMAGE">Image</option>
                                <option value="ZIP">ZIP File</option>
                            </select>
                        </div>

                        {/* File Upload (Conditional) */}
                        {postForm.category !== 'TEXT' && (
                            <div className="form-control">
                                <label className="label font-medium">
                        <span className="label-text text-gray-700">
                            Upload {postForm.category === 'IMAGE' ? 'Image' : 'ZIP File'}
                        </span>
                                </label>
                                <input
                                    type="file"
                                    className="file-input file-input-bordered w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors rounded-lg p-3"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept={postForm.category === 'IMAGE' ? 'image/*' : '.zip,application/zip,application/x-zip-compressed'}
                                />
                            </div>
                        )}
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="flex justify-center mt-4">
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-h-64 rounded-lg object-contain border-2 border-gray-200"
                                />
                                <button
                                    type="button"
                                    className="btn btn-circle btn-sm absolute top-1 right-1 bg-gray-200 hover:bg-red-500 text-gray-700 hover:text-white"
                                    onClick={() => {
                                        setImagePreview(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Content Textarea */}
                    <div className="form-control">
                        <label className="label font-medium">
                            <span className="label-text text-gray-700">Content</span>
                        </label>
                        <textarea
                            name="text"
                            placeholder="Share your thoughts, ideas, or questions..."
                            value={postForm.text}
                            onChange={handlePostInputChange}
                            className="textarea textarea-bordered w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors rounded-lg p-3 min-h-40"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn w-full text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 transition-colors"
                        disabled={!userId || isSubmittingPost}
                    >
                        {isSubmittingPost ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Creating...
                            </>
                        ) : (
                            'Post'
                        )}
                    </button>

                    {/* Login Warning */}
                    {!userId && (
                        <div className="text-sm text-center text-red-500 mt-4">
                            You must be logged in to create a post.
                        </div>
                    )}
                </form>
            </div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Community Posts
                </h2>

                {isLoading ? (
                    <div className="flex justify-center my-12">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : error ? (
                    <div className="alert alert-error shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="alert shadow-lg bg-base-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>No posts found. Be the first to create a post!</span>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {posts.map(post => (
                            <div
                                key={post.id}
                                className={`card bg-base-100 shadow-xl transition-all hover:shadow-2xl overflow-hidden ${
                                    likedPosts.has(post.id) ? 'border-2 border-primary' : ''
                                }`}
                            >
                                <div className="card-body">
                                    {/* Post Header */}
                                    <div className="flex justify-between items-center">
                                        <h3 className="card-title text-xl md:text-2xl">{post.title}</h3>
                                        <div className="badge badge-lg">{post.category}</div>
                                    </div>

                                    {/* Post Metadata */}
                                    <div className="text-sm text-gray-500 mb-2">
                                        Posted {formatDate(post.timestamp)}
                                    </div>

                                    {/* Post Content */}
                                    <p className="whitespace-pre-line">{post.text}</p>

                                    {/* Post Attachment */}
                                    {renderPostAttachment(post)}

                                    {/* Post Actions */}
                                    <div className="card-actions justify-between items-center mt-6">
                                        <div className="flex gap-3">
                                            <button
                                                className={`btn ${likedPosts.has(post.id) ? 'btn-primary' : 'btn-outline'}`}
                                                onClick={() => handleToggleLike(post.id)}
                                                disabled={!userId}
                                            >
                                                {likedPosts.has(post.id) ? (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                                        </svg>
                                                        Liked
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                                        </svg>
                                                        Like
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                className="btn btn-outline gap-2"
                                                onClick={() => toggleComments(post.id)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                </svg>
                                                {expandedPostId === post.id ? 'Hide Comments' : 'Comments'}
                                            </button>
                                        </div>

                                        {/* Only show delete button if user is admin */}
                                        {isAdmin && (
                                            <button
                                                className="btn btn-error btn-outline gap-2"
                                                onClick={() => handleDeletePost(post.id)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        )}
                                    </div>

                                    {/* Comments Section */}
                                    {expandedPostId === post.id && (
                                        <div className="mt-8 pt-6 border-t-2 border-base-300">
                                            <h4 className="font-bold text-xl mb-6">Comments</h4>

                                            {userId ? (
                                                <div className="flex gap-2 mb-6">
                                                    <input
                                                        type="text"
                                                        placeholder="Join the conversation..."
                                                        value={newComment}
                                                        onChange={(e) => setNewComment(e.target.value)}
                                                        className="input input-bordered flex-grow focus:border-primary transition-colors"
                                                    />
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => handleSubmitComment(post.id)}
                                                        disabled={!newComment.trim() || isSubmittingComment}
                                                    >
                                                        {isSubmittingComment ? (
                                                            <span className="loading loading-spinner loading-sm"></span>
                                                        ) : 'Post'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="alert alert-info mb-6 shadow-md">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>You must be logged in to comment</span>
                                                </div>
                                            )}

                                            <div className="space-y-4">
                                                {!commentsByPost[post.id] ? (
                                                    <div className="flex justify-center py-6">
                                                        <span className="loading loading-dots loading-md"></span>
                                                    </div>
                                                ) : commentsByPost[post.id].length === 0 ? (
                                                    <div className="text-center py-6 text-gray-500">
                                                        No comments yet. Be the first to share your thoughts!
                                                    </div>
                                                ) : (
                                                    commentsByPost[post.id].map(comment => (
                                                        <div key={comment.id} className="bg-base-200 p-4 rounded-xl transition-transform hover:scale-[1.01]">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="avatar placeholder">
                                                                    <div className="bg-primary text-primary-content w-10 rounded-full">
                                                                        <span>{comment.user?.name?.charAt(0) || '?'}</span>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">{comment.user?.name || 'Anonymous'}</span>
                                                                    <div className="text-xs text-gray-500">
                                                                        {comment.timestamp ? formatDate(comment.timestamp) : 'Just now'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <p className="ml-12">{comment.text}</p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Form;