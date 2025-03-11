import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import axios from 'axios';

const Form = () => {
    const { user } = useAuth(); // Access user from AuthContext
    const userId = user?.id; // Ensure userId is available
    const isAdmin = user?.role === 'admin'; // Check if the user is an admin

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('TEXT');
    const [text, setText] = useState('');
    const [posts, setPosts] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [likedPosts, setLikedPosts] = useState(new Set()); // Track liked posts using a Set

    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchPosts();
        if (userId) {
            fetchUserLikedPosts(userId);
        }
    }, [userId]);

    useEffect(() => {
        if (selectedPostId) {
            fetchComments(selectedPostId);
        }
    }, [selectedPostId]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('api/forum/forum/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    const fetchUserLikedPosts = async (userId) => {
        try {
            const response = await axios.get(`/api/likes/user/${userId}/likes`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const likedPostIds = response.data.map((like) => like.postId);
            setLikedPosts(new Set(likedPostIds));
        } catch (error) {
            console.error('Failed to fetch liked posts:', error);
        }
    };

    const fetchComments = async (postId) => {
        try {
            const response = await axios.get(`/api/comments/post/${postId}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!userId) {
            console.error('User not logged in');
            return;
        }

        // Validate file input for ZIP category
        if (category === 'ZIP' && fileInputRef.current?.files.length === 0) {
            alert('Please upload a ZIP file.');
            return;
        }

        // Validate file type for ZIP category
        if (category === 'ZIP' && fileInputRef.current?.files.length > 0) {
            const file = fileInputRef.current.files[0];
            if (file.type !== 'application/zip' && file.type !== 'application/x-zip-compressed') {
                alert('Please upload a valid ZIP file.');
                return;
            }
        }

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('category', category);
            formData.append('text', text);
            formData.append('userId', userId);

            // Append the file only if it exists and matches the category
            if ((category === 'IMAGE' || category === 'ZIP') && fileInputRef.current?.files.length > 0) {
                formData.append('file', fileInputRef.current.files[0]);
            }

            // Log FormData for debugging
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const response = await axios.post('api/forum/forum/post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Ensure correct content type
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setPosts((prevPosts) => [...prevPosts, response.data]);
            setTitle('');
            setText('');
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Clear the file input
            }
            alert('Post created successfully!');
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('Failed to create post. Please try again.');
        }
    };
    const handleLike = async (postId) => {
        try {
            if (likedPosts.has(postId)) {
                await axios.delete('api/likes/like', {
                    data: { userId, postId },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setLikedPosts((prev) => {
                    const newLikedPosts = new Set(prev);
                    newLikedPosts.delete(postId);
                    return newLikedPosts;
                });
            } else {
                await axios.post('api/likes/like', { userId, postId }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setLikedPosts((prev) => new Set([...prev, postId]));
            }
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(`api/forum/forum/post/${postId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setPosts(posts.filter((post) => post.id !== postId)); // Remove deleted post from state
            alert('Post deleted successfully');
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const handleCreateComment = async (e) => {
        e.preventDefault();
        if (!commentText || !commentText.trim()) {
            console.error('Comment is empty');
            return;
        }
        try {
            const response = await axios.post(
                'api/forum/forum/comment',
                { userId: userId || 'guest', postId: selectedPostId, text: commentText },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setComments((prevComments) => [...prevComments, response.data]); // Add the new comment
            setCommentText('');
        } catch (error) {
            console.error('Failed to create comment:', error);
        }
    };

    return (
        <div className="container mx-auto p-5">
            <div className="bg-white p-5 rounded-lg shadow-md mb-5">
                <h2 className="text-2xl font-semibold text-center mb-4">Create a New Forum Post</h2>
                <form onSubmit={handleCreatePost}>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input input-bordered w-full"
                            required
                        />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="select select-bordered w-full"
                            required
                        >
                            <option value="TEXT">Text</option>
                            <option value="IMAGE">Image</option>
                            <option value="ZIP">Zip</option>
                        </select>
                        {category !== 'TEXT' && (
                            <input
                                type="file"
                                name="file"
                                className="file-input file-input-bordered w-full"
                                ref={fileInputRef}
                            />
                        )}
                        <textarea
                            placeholder="Text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="textarea textarea-bordered w-full"
                            required
                        />
                        <button className="btn btn-primary w-full" type="submit">
                            Create Post
                        </button>
                    </div>
                </form>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Forum Posts</h2>
                {posts.map((post) => (
                    <div key={post.id} className={`card shadow-lg bg-base-100 ${likedPosts.has(post.id) ? 'bg-yellow-100' : ''}`}>
                        <div className="card-body">
                            <h3 className="card-title text-xl font-bold">{post.title}</h3>
                            <p className="text-sm">{post.text}</p>
                            {post.category !== 'TEXT' && post.fileDest && (
                                <a
                                    href={`/api/download/${post.fileDest}`}
                                    className="btn btn-link mt-2"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Download {post.category === 'IMAGE' ? 'Image' : 'ZIP File'}
                                </a>
                            )}
                            <div className="mt-4 flex justify-between items-center">
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => handleLike(post.id)}
                                >
                                    {likedPosts.has(post.id) ? 'Unlike' : 'Like'}
                                </button>
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => {
                                        setSelectedPostId(post.id);
                                        fetchComments(post.id); // Fetch comments when post is selected
                                    }}
                                >
                                    View Comments
                                </button>

                                {isAdmin && ( // Only render delete button if user is an admin
                                    <button
                                        className="btn btn-danger btn-sm ml-4"
                                        onClick={() => handleDeletePost(post.id)}
                                    >
                                        Delete Post
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedPostId && (
                <div className="bg-white p-5 rounded-lg shadow-md mt-5">
                    <h3 className="text-xl font-semibold mb-4">Comments</h3>
                    <form onSubmit={handleCreateComment}>
                        <textarea
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="textarea textarea-bordered w-full mb-4"
                        />
                        <button className="btn btn-primary" type="submit">
                            Post Comment
                        </button>
                    </form>

                    <div className="mt-4 space-y-2">
                        {comments.map((comment) => (
                            <div key={comment.id} className="p-2 border-b">
                                <p><strong>{comment.user.name}</strong>: {comment.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Form;
